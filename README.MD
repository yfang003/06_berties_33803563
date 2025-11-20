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