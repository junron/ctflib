update challenge
set points = 454
where challenge_id = 13;
update challenge
set points = 486
where challenge_id = 11;
update challenge
set points = 469
where challenge_id = 4;

insert into ctf_event (ctf_name, start_date, end_date, website)
VALUES ('Whitehacks', '2022-03-20 09:00:00', '2022-03-20 17:15:00', 'https://play.whitehacks.ctf.sg/');

insert into challenge (event_id, name, category_name, description, points)
values ((select max(event_id) from ctf_event), 'Meoware', 'Web',
        'SpaceY Corp. has been hit by a meoware attack. Wait a second, what even is a meoware? Nevertheless, your job here is simple. Retrieve the stolen flag from their web servers before they vanish for good.',1000)
