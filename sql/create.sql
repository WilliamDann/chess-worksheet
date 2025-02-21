create schema if not exists chessws;
use chessws;

create table if not exists users (
    id              int          not null auto_increment,
    name            varchar(64)  not null unique,
    email           varchar(254) not null unique,
    passwordHash    varchar(72)  not null,
    accountType     varchar(64)  not null default("Student"),
    
    primary key(id)
);

create table if not exists tokens (
    token   varchar(124) not null,
    userid  int not null,

    primary key(token),
    foreign key(userid) references users(id)
);

create table if not exists classes (
    id      int not null auto_increment,
    name    varchar(124),
    descr   varchar(500),
    coach   int,

    primary key (id),
    foreign key (coach) references users(id)
);

create table if not exists enrollment (
    userid          int not null,
    classid         int not null,

    foreign key (userid)  references users(id),
    foreign key (classid) references classes(id)
);

create table if not exists assignments (
    id              int not null auto_increment,
    title           varchar(124) not null,
    descr           varchar(500) not null,
    author          int not null,

    primary key (id),
    foreign key (author) references users(id)
);

create table if not exists curriculum (
    classid         int not null,
    assignmentid    int not null,

    foreign key (classid)       references classes(id),
    foreign key (assignmentId)  references assignments(id)
);

create table if not exists positions (
    id              int auto_increment,
    assignmentid    int not null,
    fen             varchar(200) not null,
    pgn             varchar(500) not null,
    points          int not null,

    primary key (id),
    foreign key (assignmentid) references assignments(id)
);

create table if not exists scores (
    positionid int not null,
    userid     int not null,
    points     int not null,

    foreign key (positionid) references positions(id),
    foreign key (userid)     references users(id)
);