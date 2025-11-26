// Create a new router
const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', 
    [ 
        check('keyword').trim().isLength({ min: 1, max: 20 }) 
    ],
    function (req, res, next) {
    //searching in the database
    let keyword = req.query.keyword;
    //searching
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchValue = '%' + keyword + '%';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send("Invalid search keyword");
    }

    db.query(sqlquery, [searchValue], (err, result) => {
        if (err){
            next(err);
        }else{
            res.render("list.ejs", { availableBooks: result });
        }
    });
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
// execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})

    });
});

router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render('addbook.ejs');
});

router.post('/bookadded', 
    [
        check('name').notEmpty().isLength({max: 50}),
        check('price').isFloat({min:0})
    ],
    function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.price)]
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
   return res.send("Invalid book input");
}

    db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
    next(err)
    }
    else{
        res.send(' This book is added to database, name: '+ req.sanitize(req.body.name) + ' price '+ req.sanitize(req.body.price))
    }
    
    })
    }) 

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', { availableBooks: result });
        }
    });
});
    
// Export the router object so index.js can access it
module.exports = router
