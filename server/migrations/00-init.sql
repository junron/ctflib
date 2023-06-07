create table if not exists user
(
    username        varchar(255) not null,
    email           varchar(255) not null,
    github_username varchar(255) not null,
    password_hash   varchar(255) not null,
    primary key (username)
);

create table if not exists ctf_series
(
    name      varchar(255) not null,
    organizer varchar(255) not null,
    primary key (name)
);

create table if not exists ctf_event
(
    event_id   int          not null auto_increment,
    ctf_name   varchar(255) not null,
    start_date datetime     not null,
    end_date   datetime     not null,
    website    varchar(255) not null,
    primary key (event_id),
    foreign key (ctf_name) references ctf_series (name) on delete cascade on update cascade
);

create table if not exists ctftime_event
(
    ctftime_id    int          not null,
    event_id      int          not null,
    winner_score  int,
    num_teams     int,
    score         int,
    ranking       int,
    weight        float,
    rating_points float default 0,
    image_url     varchar(255) not null,
    primary key (ctftime_id),
    foreign key (event_id) references ctf_event (event_id) on delete cascade on update cascade
);

create table if not exists category
(
    name        varchar(255) not null,
    icon        varchar(255) not null,
    color       varchar(255) not null,
    light_color varchar(255),
    is_major    boolean      not null default false,
    primary key (name)
);

create table if not exists challenge
(
    challenge_id  int          not null auto_increment,
    event_id      int          not null,
    category_name varchar(255) not null,
    name          varchar(255) not null,
    description   MEDIUMTEXT,
    points        int,
    primary key (challenge_id),
    foreign key (event_id) references ctf_event (event_id) on delete cascade on update cascade,
    foreign key (category_name) references category (name) on delete cascade on update cascade
);

create table if not exists challenge_file
(
    file_id      int          not null auto_increment,
    challenge_id int          not null,
    file_name    varchar(255) not null,
    file_type    varchar(255) not null,
    file_path    varchar(255) not null,
    primary key (file_id),
    foreign key (challenge_id) references challenge (challenge_id) on delete cascade on update cascade
);

create table if not exists challenge_tag
(
    challenge_id int          not null,
    tag_name     varchar(255) not null,
    primary key (challenge_id, tag_name),
    foreign key (challenge_id) references challenge (challenge_id) on delete cascade on update cascade
);

create table if not exists writeup
(
    writeup_id      int     not null auto_increment,
    challenge_id    int     not null,
    poster_username varchar(255),
    is_private      boolean not null default true,
    primary key (writeup_id),
    foreign key (challenge_id) references challenge (challenge_id),
    foreign key (poster_username) references user (username) on delete set null on update cascade
);

create table if not exists external_writeup
(
    external_writeup_id int          not null,
    url                 varchar(255) not null,
    primary key (external_writeup_id),
    foreign key (external_writeup_id) references writeup (writeup_id) on delete cascade on update cascade
);

create table if not exists internal_writeup
(
    internal_writeup_id int        not null,
    body                MEDIUMTEXT not null,
    primary key (internal_writeup_id),
    foreign key (internal_writeup_id) references writeup (writeup_id) on delete cascade on update cascade
);

create table if not exists post
(
    post_id         int          not null auto_increment,
    poster_username varchar(255),
    post_category   varchar(255) not null,
    title           varchar(255) not null,
    is_private      boolean      not null default true,
    primary key (post_id),
    foreign key (poster_username) references user (username) on delete set null on update cascade,
    foreign key (post_category) references category (name) on delete cascade on update cascade
);

create table if not exists post_tag
(
    post_id  int          not null,
    tag_name varchar(255) not null,
    primary key (post_id, tag_name),
    foreign key (post_id) references post (post_id) on delete cascade on update cascade
);

create table if not exists resource
(
    resource_id int        not null,
    body        MEDIUMTEXT not null,
    primary key (resource_id),
    foreign key (resource_id) references post (post_id) on delete cascade on update cascade
);

create table if not exists series
(
    series_id int          not null auto_increment,
    title     varchar(255) not null,
    primary key (series_id)
);

create table if not exists guide
(
    guide_id     int        not null,
    description  MEDIUMTEXT not null,
    body         MEDIUMTEXT not null,
    series_id    int,
    guide_number int,
    primary key (guide_id),
    foreign key (guide_id) references post (post_id) on delete cascade on update cascade,
    foreign key (series_id) references series (series_id) on delete set null on update cascade
);

INSERT INTO user (username, email, github_username, password_hash)
VALUES ('jro', 'junron1@outlook.com', 'junron',
        'dab8cb04b569b6e102b84e1123b42ad9b38165e0074607e7abeb7ad0a6423f8926817c5d44df01d59298c1fa8290b6dbf5ccd0eed0ee14d57a5f29028a2d430b.c6a39fee5a464ed544d0d11bb78f4a10');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test', 'sus@sus.com', 'amogus',
        '504fec8df7d9e7a9f52a91b2428ce7fa89015d33581002a12467a8a651ede20547353079db46d5b45105ef847c193ecc33943aface3d54a176fe153be23bdf52.94b8884244adacf556f05e268443c9e1');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 1', 'test1@outlook.com', 'test1',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 2', 'test2@outlook.com', 'test2',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 3', 'test3@outlook.com', 'test3',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 4', 'test4@outlook.com', 'test4',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 5', 'test5@outlook.com', 'test5',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 6', 'test6@outlook.com', 'test6',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 7', 'test7@outlook.com', 'test7',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
INSERT INTO user (username, email, github_username, password_hash)
VALUES ('test user 8', 'test8@outlook.com', 'test8',
        '26abce92b4e9d39784d3201206cbb479f9ea7c64555b7c92e1e15a99bdb10db7e5315e5d6fae181da61d640d6b2e7857f7c40fef6177fea319ae9f6d35072876.2c7f90a52fde90c4372a185c1aaf88bc');
