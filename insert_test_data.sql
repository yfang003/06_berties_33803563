# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users(username, fistname, lastname, email, hashedPassword)
VALUES (
    'gold',
    'gold',
    'gold',
    'gold@gold.ac.uk',
    '$2b$10$TRI0jxzzPx16lP234439R.tV6rElsWwLj8vsQuBWZ.f57fBuZ9SfC'
);