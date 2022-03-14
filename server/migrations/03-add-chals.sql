insert into challenge (event_id, category_name, name, description, points)
values (11, 'Pwn', 'Baby heap', 'Let\'s get you all warmed up with a classic little 4-function heap challenge, with a
        twist ofc.\n\n `nc hack.scythe2021.sdslabs.co 17169`\n\n
        `static.scythe2021.sdslabs.co/static/babyHeap/libc-2.31.so`\n\n
        `static.scythe2021.sdslabs.co/static/babyHeap/babyHeap` ', 1);
insert into challenge (event_id, category_name, name, description, points)
values (11, 'Misc', 'SCAndal', 'Your aim
        is to identify the 6 removed values, sort them in ascending order, then your flag would be
        `flag{num[0],num[1],num[2],num[3],num[4],num[5]}`\n\nFor example :\nif the missing numbers are [1, 69, 42, 169,
        142, 242], the flag would be `flag{1,42,69,142,169,242}`.', 1);
insert into challenge (event_id, category_name, name, description, points)
values (10, 'Web', 'Completely secure publishing', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (8, 'Web', 'phpme', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Web', 'Secure Flag Distribution Service',
        'We\'ve recently discovered that APOCALYPSE is running an illegal [flag distribution service](http://aiodmb3uswokssp2pp7eum8qwcsdf52r.ctf.sg:50401/) to share flags among all their agents. Can you infiltrate their system and take a look? Seems like they\'re using some OTP system to ensure that only their members can login.',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Web', 'Secret base 1',
        'APOCALYPSE hired an administrator improve the physical security of their secret base.\nYour task is to gain access to the physical security device.\nThe flag for this challenge is similar to 15{h...e} (starts with \'h\' and ends with \'e\').',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Web', 'Secret base 2', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Web', 'Secret base 3', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Web', 'Login portal', 'During our investigations,
        we \'ve manage to find the [login portal](http://aiodmb3uswokssp2pp7eum8qwcsdf52r.ctf.sg:50201/) for APOCALYSE members. Seems like all you have to do is login to get the flag,
        but it seems to be pretty damn secure since they actually filter user input and use password hashes. :(',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (15, 'Misc', 'Zero Mart',
        'APOCALYPSE has recently started ZeroMart, which is a service that lets their agents redeem the latest 0-day exploits with their credits. Seems like their members have been accessing their underground service by using a client program that has been given to them. We\'ve managed to get our hands on the client,
        so can you try and infiltrate their system? The server runs python 3.7\nNote: flag.txt is located at `/app/flag.txt`. Also you might need to install the python requests library to get the client running.',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (1, 'Pwn', 'Coffee shop',
        'Userspace heap feng shui is too complicated. Here is a peak into kernel heap exploitation. Use your instincts.',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (4, 'Misc', 'Badseed', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (4, 'Pwn', 'Gradebook', 'My teachers been using a commandline gradebook made by a first year student,
        must be vulnerable somehow.\n\n`nc ctf.k3rn3l4rmy.com 2250`', 1);
insert into challenge (event_id, category_name, name, description, points)
values (14, 'Web', 'Can\'t use DB',
        'Can\'t use DB.\nI have so little money that I can\'t even buy the ingredients for ramen.\n🍜', 1);
insert into challenge (event_id, category_name, name, description, points)
values (14, 'Web', 'Check URL', 'Have you ever used `curl`?', 1);
insert into challenge (event_id, category_name, name, description, points)
values (14, 'Web', 'JSON',
        'We have found an internal system that is externally exposed. Retrieve the Flag from this system.', 1);
insert into challenge (event_id, category_name, name, description, points)
values (14, 'Web', 'Magic', 'Can you find the trick?', 1);
insert into challenge (event_id, category_name, name, description, points)
values (13, 'Pwn', 'Malloc', 'Can you somehow get the flag? Have fun!\n\n```\nnc challs.sieberrsec.tech 1470\n```', 1);
insert into challenge (event_id, category_name, name, description, points)
values (13, 'Pwn', 'Simple', 'Simple game right?', 1);
insert into challenge (event_id, category_name, name, description, points)
values (13, 'Pwn', 'Turbo crypto part 2',
        'Using the key you extracted, we found a [link](https://drive.google.com/uc?id=19mmImjpreALZSs0D88BtLY65cFBkHsMC&export=download) to the source code for `turbofastcrypto`. There happens to be a secret `flag` file on the server, and you need to extract it.',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (13, 'Pwn', 'warmup', '', 1);
insert into challenge (event_id, category_name, name, description, points)
values (12, 'Web', 'BabyPHP',
        'John is trying to juggle between learning PHP and his other homework. Fortunately, he managed to complete his PHP task - creating a simple web login. He challenges you to find a way to bypass his login.\n\nTake a look at his PHP masterpiece now! [chals.whitehacks.ctf.sg:50201](http://chals.whitehacks.ctf.sg:50201/)',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (12, 'Web', 'WAF Bypass',
        'Can you get flag from the environment?\n\n[chals.whitehacks.ctf.sg:50401](http://chals.whitehacks.ctf.sg:50401/)',
        1);
insert into challenge (event_id, category_name, name, description, points)
values (12, 'Web', 'X marks Louis\'s treasure',
        'Finding a web page that leads to Louis\' hidden treasure on his server HEHEHEHE\n\n[chals.whitehacks.ctf.sg:50101](http://chals.whitehacks.ctf.sg:50101/)',
        1);


insert into challenge_tag
values (1, 'heap');
insert into challenge_tag
values (1, 'uaf');
insert into challenge_tag
values (18, 'malloc');
insert into challenge_tag
values (20, 'cpython-extension');
insert into challenge_tag
values (20, 'OOB');
insert into challenge_tag
values (21, 'strcmp');
insert into challenge_tag
values (21, 'bof');
insert into challenge_tag
values (11, 'heap');
insert into challenge_tag
values (11, 'uaf');
insert into challenge_tag
values (13, 'heap');
insert into challenge_tag
values (13, 'tcache');

insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (1, 'baby-heap', 'application/x-elf', '/data/files/baby-heap/baby-heap');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (1, 'libc.so.6', 'application/x-elf', '/data/files/baby-heap/libc.so.6');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (11, 'coffee', 'application/x-elf', '/data/files/coffee-shop/coffee');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (11, 'libc.so.6', 'application/x-elf', '/data/files/coffee-shop/libc.so.6');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (13, 'gradebook', 'application/x-elf', '/data/files/gradebook/gradebook');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (13, 'libc.so.6', 'application/x-elf', '/data/files/gradebook/libc.so.6');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (19, 'simple', 'application/x-elf', '/data/files/simple/simple');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (20, 'main.py', 'text/plain', '/data/files/turbo-crypto-2/main.py');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (20, 'crypto.so', 'application/x-elf', '/data/files/turbo-crypto-2/crypto.so');
insert into challenge_file (challenge_id, file_name, file_type, file_path)
VALUES (21, 'warmup', 'application/x-elf', '/data/files/warmup/warmup');
