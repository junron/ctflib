create table if not exists user
(
    username        varchar(255) not null,
    email           varchar(255) not null,
    github_username varchar(255) not null,
    password_hash   varchar(255) not null,
    primary key (username)
);

create table if not exists ctf
(
    name      varchar(255) not null,
    organizer varchar(255) not null,
    primary key (name)
);

create table if not exists event
(
    event_id   int          not null auto_increment,
    ctf_name   varchar(255) not null,
    start_date datetime     not null,
    end_date   datetime     not null,
    website    varchar(255) not null,
    primary key (event_id),
    foreign key (ctf_name) references ctf (name)
);

create table if not exists ctftime_event
(
    ctftime_id    int          not null,
    event_id      int          not null,
    winner_score  int          not null,
    num_teams     int          not null,
    score         int          not null,
    ranking       int          not null,
    weight        int,
    rating_points float,
    image_url     varchar(255) not null,
    primary key (ctftime_id),
    foreign key (event_id) references event (event_id)
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
    description   varchar(255) not null,
    points        int          not null,
    primary key (challenge_id),
    foreign key (event_id) references event (event_id),
    foreign key (category_name) references category (name)
);

create table if not exists challenge_file
(
    file_id      int          not null auto_increment,
    challenge_id int          not null,
    file_name    varchar(255) not null,
    file_type    varchar(255) not null,
    file_path    varchar(255) not null,
    primary key (file_id),
    foreign key (challenge_id) references challenge (challenge_id)
);

create table if not exists challenge_tag
(
    challenge_id int          not null,
    tag_name     varchar(255) not null,
    primary key (challenge_id, tag_name),
    foreign key (challenge_id) references challenge (challenge_id)
);

create table if not exists writeup
(
    writeup_id      int          not null auto_increment,
    challenge_id    int          not null,
    poster_username varchar(255) not null,
    is_private      boolean      not null default true,
    primary key (writeup_id),
    foreign key (challenge_id) references challenge (challenge_id),
    foreign key (poster_username) references user (username)
);

create table if not exists external_writeup
(
    external_writeup_id int          not null,
    url                 varchar(255) not null,
    primary key (external_writeup_id),
    foreign key (external_writeup_id) references writeup (writeup_id)
);

create table if not exists internal_writeup
(
    internal_writeup_id int        not null,
    body                MEDIUMTEXT not null,
    primary key (internal_writeup_id),
    foreign key (internal_writeup_id) references writeup (writeup_id)
);

create table if not exists post
(
    post_id         int          not null auto_increment,
    poster_username varchar(255) not null,
    post_category   varchar(255) not null,
    title           varchar(255) not null,
    is_private      boolean      not null default true,
    primary key (post_id),
    foreign key (poster_username) references user (username),
    foreign key (post_category) references category (name)
);

create table if not exists post_tag
(
    post_id  int          not null,
    tag_name varchar(255) not null,
    primary key (post_id, tag_name),
    foreign key (post_id) references post (post_id)
);

create table if not exists resource
(
    resource_id int        not null,
    body        MEDIUMTEXT not null,
    primary key (resource_id),
    foreign key (resource_id) references post (post_id)
);

create table if not exists series
(
    series_id int          not null auto_increment,
    title     varchar(255) not null,
    primary key (series_id)
);

create table if not exists guide
(
    guide_id     int          not null,
    description  varchar(255) not null,
    body         MEDIUMTEXT   not null,
    series_id    int,
    guide_number int,
    primary key (guide_id),
    foreign key (guide_id) references post (post_id),
    foreign key (series_id) references series (series_id)
);

create table if not exists code_snippet
(
    code_snippet_id int          not null,
    title           varchar(255) not null,
    language        varchar(255) not null,
    code            MEDIUMTEXT   not null,
    writeup_id      int,
    guide_id        int,
    primary key (code_snippet_id),
    foreign key (writeup_id) references internal_writeup (internal_writeup_id),
    foreign key (guide_id) references guide (guide_id)
);
