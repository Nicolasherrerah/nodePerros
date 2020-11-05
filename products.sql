create table products(
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    productname VARCHAR(100) NOT NULL,
    price NUMERIC(4,2) NOT NULL   
);


INSERT INTO products (category, productname, price) VALUES ('Food & Treats',  'Royal Canin, adult 13.6 kg', '75');
INSERT INTO products (category, productname, price) VALUES ('Food & Treats', 'Nupec, adult 20 kg', '60');
INSERT INTO products (category, productname, price) VALUES ('Food & Treats', 'Dog Chow, adult 18 kg', '35');
INSERT INTO products (category, productname, price) VALUES ('Food & Treats', 'BARKYS Steaks 550 g', '7.99' );
INSERT INTO products (category, productname, price) VALUES ('Food & Treats', 'Ol Roy Sticks 24 pcs', '2.99');
INSERT INTO products (category, productname, price) VALUES ('Food & Treats', 'Nupec PENU 180 g', '4.99');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Sweater for large dogs', '25');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Spider costume, small dogs', '17.99');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Blanket coat, medium', '25');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Bandana unisize', '15');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Dog boots medium size', '20');
INSERT INTO products (category, productname, price) VALUES ('Clothes & Accesories', 'Windproof sunglasses', '12');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Fancy Pets shampoo 250 ml', '15');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Flea & tick repellent soap', '10');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Hypoallergenic shampoo 470 ml', '10');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Grooming Trimmers', '9.99');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Deshedding glove', '9.99');
INSERT INTO products (category, productname, price) VALUES ('Grooming & bathing supplies', 'Hair remover', '9.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'KONG T2, medium', '9.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'Duckworth yellow duck toy', '4.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'Nylabone durable chew toys', '11.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'Chuckit! Ball 2pcs', '8.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'Squeaking monkey plush', '7.99');
INSERT INTO products (category, productname, price) VALUES ('Toys', 'Nerf nylon frisbee', '7.99');

