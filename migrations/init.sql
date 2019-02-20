drop table if exists reviews;
drop table if exists beers;

create table beers (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    brewery varchar(100) NOT NULL,
    abv decimal NOT NULL,
    short_description varchar,
    created timestamp NOT NULL,
    unique(name, brewery, abv)
);

create table reviews (
    id serial PRIMARY KEY,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    beer_id INTEGER references beers(id),
    comments varchar not null,
    created timestamp NOT NULL,
    unique(first_name, last_name, beer_id)
)