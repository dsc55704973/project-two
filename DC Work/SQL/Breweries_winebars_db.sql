-- Drop table if exists
DROP TABLE denver_brew_wine_whiskey;

-- Create table
Create table denver_brew_wine_whiskey (
	id_ varchar(100),
	name_ varchar(100),
	img_url varchar(500),
	is_closed boolean,
	url varchar(500),
	review_count integer,
	category varchar (20),
	rating float,
	price varchar (10),
	display_phone varchar,
	latitude float,
	longitude float,
	address1 varchar(100),
	address2 varchar(100),
	address3 varchar(100),
	city varchar(20),
	zip_code integer,
	country varchar,
	state_ varchar
	);

select * from denver_brew_wine_whiskey;