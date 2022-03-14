INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (24, 'jro', 'Forensics', 'QuickBMS', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (25, 'jro', 'Misc', 'Unredacter', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (26, 'jro', 'Misc', 'breakpoint()', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (27, 'jro', 'Misc', 'Parser for USB keyboard packet captures', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (28, 'jro', 'Crypto', 'Mersenne twister cracker', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (29, 'jro', 'Crypto', 'Recover RSA public key from JWT', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (30, 'jro', 'Misc', 'bkcrack', 1);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (31, 'jro', 'Pwn', 'Buffer overflows', 1);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (32, 'jro', 'Pwn', 'Return oriented programming', 1);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (33, 'jro', 'Pwn', 'Ret2libc', 1);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (37, 'jro', 'Web', 'window.name', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (38, 'jro', 'Web', 'Creating strings with toString', 0);
INSERT INTO ctflib.post (post_id, poster_username, post_category, title, is_private)
VALUES (39, 'jro', 'Web', 'LFI tips', 0);
INSERT INTO post_tag (post_id, tag_name)
VALUES (24, 'files');
INSERT INTO post_tag (post_id, tag_name)
VALUES (25, 'pixellation');
INSERT INTO post_tag (post_id, tag_name)
VALUES (26, 'python');
INSERT INTO post_tag (post_id, tag_name)
VALUES (26, 'shell');
INSERT INTO post_tag (post_id, tag_name)
VALUES (27, 'keyboard');
INSERT INTO post_tag (post_id, tag_name)
VALUES (28, 'mersenne');
INSERT INTO post_tag (post_id, tag_name)
VALUES (28, 'rng');
INSERT INTO post_tag (post_id, tag_name)
VALUES (29, 'jwt');
INSERT INTO post_tag (post_id, tag_name)
VALUES (29, 'rsa');
INSERT INTO post_tag (post_id, tag_name)
VALUES (30, 'zip');
INSERT INTO post_tag (post_id, tag_name)
VALUES (39, 'lfi');
INSERT INTO post_tag (post_id, tag_name)
VALUES (38, 'javascript');
INSERT INTO post_tag (post_id, tag_name)
VALUES (37, 'javascript');
INSERT INTO post_tag (post_id, tag_name)
VALUES (37, 'xss');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (24, 'http://aluigi.altervista.org/quickbms.htm
 Library for decoding weird file types');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (25, 'https://github.com/bishopfox/unredacter
 Reverse pixellation');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (26, 'Apparently calling the breakpoint() function in python gives you a python shell');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (27, 'https://github.com/TeamRocketIst/ctf-usb-keyboard-parser');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (28, 'https://github.com/icemonster/symbolic_mersenne_cracker

Library for cracking Mersenne twister using symbolic execution.');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (29, 'https://github.com/silentsignal/rsa_sign2n

Library for obtaining RSA public key from multiple signed JWTs');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (30, ' https://github.com/kimci86/bkcrack/blob/master/example/tutorial.md

Library for cracking encrypted GIFs with partial known plaintext');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (37, '`window.name` can be used for cross domain XSS as it is persisted across page loads within the same tab.
This allows code on another site to set the `name` variable if it is not already set, possibly resulting in RCE or other unexpected behavior.');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (38, 'When an integer is converted to a string using `.toString`, a base can be specified using the first argument.
This allows the creation of arbitrary strings with sufficiently high bases. For example, `359416796..toString(32)`');
INSERT INTO ctflib.resource (resource_id, body)
VALUES (39, '1. Always try to leak the source first
  a. Try stuff like `index.php`, `main.py`, `index.js`
2. Use proc fs (`/proc/self/environ`)
3. Leak log files
4. `/dev/fd` is symlinked to `/proc/self/fd` allowing indirect access to proc fs


Source: [liveoverflow video](https://www.youtube.com/watch?v=0TPXvpaiYWc)');
