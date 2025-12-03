// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')
var session = require ('express-session')
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000

require('dotenv').config();

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Create an input sanitizer
app.use(expressSanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: {
     expires: 600000
  }
}))
// Define our application-specific data
app.locals.shopData = {shopName: "Bertie's Books"}

// Define the database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'berties_books_app',
  password: process.env.DB_PASSWORD || 'qwertyuiop',
  database: process.env.DB_NAME || 'berties_books',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
})
    global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

const weatherRoutes = require('./routes/weather')
app.use('/weather', weatherRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

