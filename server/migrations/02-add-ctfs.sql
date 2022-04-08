insert into ctf_series (name, organizer)
values ('idekCTF', 'idekCTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('idekCTF', '2021-12-11 08:00:00+08:00', '2021-12-13 08:00:00+08:00', 'https://ctf.idek.team/');
insert into ctftime_event (ctftime_id, event_id, winner_score, num_teams, score, ranking, weight, image_url)
values (1512, (select max(event_id) from ctf_event), 16862.0, 235, 13394.0, 4, 24.56,
        'https://ctftime.org/media/cache/a1/e9/a1e90dea545fe60da5ee556418358e7a.png');
insert into ctf_series (name, organizer)
values ('MetaCTF CyberGames', 'MetaCTF CyberGames');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('MetaCTF CyberGames', '2021-12-04 04:00:00+08:00', '2021-12-06 04:00:00+08:00', 'https://metactf.com/');
insert into ctftime_event
values (1476, (select max(event_id) from ctf_event), 15075.0, 1343, 8325.0, 54, 24.09, 0,
        'https://ctftime.org/media/cache/ef/f3/eff335bca6487a16740cc7af8dc81e33.png');
insert into ctf_series (name, organizer)
values ('TFC CTF', 'TFC CTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('TFC CTF', '2021-11-26 20:00:00+08:00', '2021-11-28 20:00:00+08:00', 'https://ctf.thefewchosen.com/');
insert into ctftime_event
values (1501, (select max(event_id) from ctf_event), 4786.0, 451, 3019.0, 12, 24.27, 0,
        'https://ctftime.org/media/cache/39/30/393076a10b85b9b69d88e72beb47f456.png');
insert into ctf_series (name, organizer)
values ('K3RN3LCTF', 'K3RN3LCTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('K3RN3LCTF', '2021-11-13 01:00:00+08:00', '2021-11-14 12:59:59+08:00', 'https://ctf.k3rn3l4rmy.com/');
insert into ctftime_event
values (1438, (select max(event_id) from ctf_event), 11221.0, 501, 8220.0, 3, 24.37, 0,
        'https://ctftime.org/media/cache/83/b8/83b8d12a915bf9867fcea45697e84692.png');
insert into ctf_series (name, organizer)
values ('DamCTF', 'DamCTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('DamCTF', '2021-11-06 08:00:00+08:00', '2021-11-08 08:00:00+08:00', 'https://damctf.xyz/');
insert into ctftime_event
values (1401, (select max(event_id) from ctf_event), 8142.0, 827, 4703.0, 21, 24.43, 0,
        'https://ctftime.org/media/cache/7f/e3/7fe33a21de49b6f09bc948546950cc14.png');
insert into ctf_series (name, organizer)
values ('Killer Queen CTF', 'Killer Queen CTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('Killer Queen CTF', '2021-10-29 22:00:00+08:00', '2021-11-01 08:00:00+08:00', 'https://killerqueenctf.org/');
insert into ctftime_event
values (1482, (select max(event_id) from ctf_event), 8971.0, 250, 7129.0, 4, 21.14, 0,
        'https://ctftime.org/media/cache/46/0f/460fce339bd61bbb3e1ab1af22adc872.png');
insert into ctf_series (name, organizer)
values ('PBjar CTF', 'PBjar CTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('PBjar CTF', '2021-09-17 17:00:00+08:00', '2021-09-20 04:59:59+08:00', 'https://pbjar.net/');
insert into ctftime_event
values (1430, (select max(event_id) from ctf_event), 13246.0, 560, 10838.0, 5, 23.18, 0,
        'https://ctftime.org/media/cache/23/12/2312a5abe2baf8a344da7655e482e72a.png');
insert into ctf_series (name, organizer)
values ('corCTF', 'corCTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('corCTF', '2021-08-21 08:00:00+08:00', '2021-08-23 08:00:00+08:00', 'https://ctf.cor.team/');
insert into ctftime_event
values (1364, (select max(event_id) from ctf_event), 13712.0, 904, 6873.0, 20, 24.92, 0,
        'https://ctftime.org/media/cache/6c/4c/6c4c7049aaaafdcc977b0a0d7bf85be2.png');
insert into ctf_series (name, organizer)
values ('HSCTF', 'HSCTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('HSCTF', '2021-06-14 20:00:00+08:00', '2021-06-19 08:00:00+08:00', 'http://hsctf.com/');
insert into ctftime_event
values (1264, (select max(event_id) from ctf_event), 17982.0, 1162, 16007.0, 11, 24.5, 0,
        'https://ctftime.org/media/cache/dc/c7/dcc75f15305ed49cc5e94f4ade87e997.png');
insert into ctf_series (name, organizer)
values ('BCACTF', 'BCACTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('BCACTF', '2021-06-11 08:00:00+08:00', '2021-06-14 08:00:00+08:00', 'https://bcactf.com/');
insert into ctftime_event
values (1369, (select max(event_id) from ctf_event), 12675.0, 837, 10100.0, 5, 24.33, 0,
        'https://ctftime.org/media/cache/57/4e/574ecb4339fab0b3c3248950b3d58903.png');
insert into ctf_series (name, organizer)
values ('Backdoor CTF', 'Backdoor CTF');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('Backdoor CTF', '2021-12-25 02:00:00+08:00', '2021-12-26 02:00:00+08:00', 'https://backdoor.sdslabs.co/');
insert into ctftime_event
values (1536, (select max(event_id) from ctf_event), 3847.0, 123, 2582.0, 3, 24.7, 0,
        'https://ctftime.org/media/cache/2d/cf/2dcf99c09ffdfd27a845c647adb7e4ac.png');
insert into ctf_series (name, organizer)
values ('Whitehacks', 'SMU');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('Whitehacks', '2021-03-07 09:00:00+08:00', '2021-03-07 17:00:00+08:00',
        'https://play.whitehacks.ctf.sg/competition');
insert into ctf_series (name, organizer)
values ('Sieberrsec', 'Hwa Chong Institution');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('Sieberrsec', '2021-12-26 07:15:00+08:00', '2021-12-27 00:15:00+08:00', 'https://ctfx.sieberrsec.tech/');
insert into ctf_series (name, organizer)
values ('SECCON Beginner', 'SECCON');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('SECCON Beginner', '2021-05-22 00:00:00+08:00', '2021-05-23 00:00:00+08:00',
        'https://www.seccon.jp/2021/beginners/about-seccon-beginners.html');
insert into ctf_series (name, organizer)
values ('Cyberthon', 'Hwa Chong Institution');
insert into ctf_event(ctf_name, start_date, end_date, website)
values ('Cyberthon', '2021-05-08 09:30:00+08:00', '2021-05-08 00:18:00+08:00',
        'https://play.cyberthon21f.ctf.sg/game/ckocbvyy2eo1i0860fzv22h3l');
