# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js


This project is my work for Week 6 of Dynamic Web Applications.
It is a small web app that uses Node.js, Express, MySQL, and EJS templates.

# Features

Booklist, add book, bargain books, searching

# Database

MySQL


# Using dotenv for Database Credentials

To avoid hard-coding the database username and password in the source code, the project uses the dotenv package.
All database connection details are stored in a .env file in the project root.
These values are loaded using:

require('dotenv').config()


The database connection then uses environment variables instead of plain values in the code.

# Audit Logging

Each login attempt is recorded in an audit_log table.
For every login request, the system saves:
- the username
- whether the login was successful or not
- the timestamp

This allows the system to track failed and successful login attempts for security monitoring.

# Where Validation Was Added
1. User Registration (/registered)

I added server-side validation to ensure the user submits correct and safe data.
email must be a valid email format
username 5–20 characters, no spaces
password minimum 8 characters, not empty
firstname/lastname → cannot be empty

2. User Login (/loggedin)

username must not be empty
password must not be empty

3. Book Search (/search-result)

keyword → must be 1–50 characters (no empty search)

4. Add book(/bookdadded)

name cannot be empty
price must be a number and ≥ 0

# Where Validation Was Not Added

Static Pages such as home page, about page
book list such as the /list and the /bargainbook

Validation is applied only to routes that receive user input (registering, logging in, searching, adding books).
Read-only pages or pages without form input do not need validation.

# Where Sanitisation Was Added

1. User Registration (/registered)

the fist name, last name and the username

These values are shown back to the user and also inserted into the database, so sanitising them prevents malicious HTML or JavaScript from running

2. User Login (/loggedin)

username is sanitised to avoid unexpected characters being submitted to the database.

3. Add Book (/bookadded)

I sanitised name and price

# API Features Summary

This lab adds API functionality to the Bertie’s Books application.
We created a new /api/books endpoint that returns book data in JSON format.
The API supports several optional query parameters:

search=keyword
Filters books whose name contains the given keyword.

minprice=value and maxprice=value
Filters books within a specific price range.

sort=name or sort=price
Sorts the results by book name or price.