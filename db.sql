create table person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

create table dog(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    birthday DATE NOT NULL,
    img VARCHAR NOT NULL,
    owner_id INT REFERENCES person (id)
);

create table appointment(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    purpose VARCHAR(250) NOT NULL,
    pet VARCHAR(100) NOT NULL,
    user_id INT REFERENCES person (id),
    dog_id INT REFERENCES dog (id)
);

create table cart(
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    productname VARCHAR(100) NOT NULL,
    pet VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    user_id INT REFERENCES person (id)    
);

create table ordered (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    productname VARCHAR(100) NOT NULL,
    pet VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    user_id INT REFERENCES person (id)    
);
