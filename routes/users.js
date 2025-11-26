// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.post('/registered', 
    [
        check('email').isEmail(), 
        check('username').isLength({ min: 5, max: 20}),
        check('password').isLength({min: 8}),
        check('firstname').notEmpty(),
        check('lastname').notEmpty(),
        check('email').notEmpty(),
        //check('username').matches(/^\S+$/),
        //check('firstname').trim().escape(),
        //check('lastname').trim().escape()


    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else { 
        const plainPassword = req.body.password

        const safeFirstname = req.sanitize(req.body.firstname)
        const safeLastname  = req.sanitize(req.body.lastname)
        const safeUseername  = req.sanitize(req.body.username)

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        if(err){
            next(err)
        }
            let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)"
            let newrecord = [
                            safeUseername, 
                            safeFirstname, 
                            safeLastname, 
                            req.body.email, 
                            hashedPassword]
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                next(err)
                }
                else{
                    result = 'Hello '+ safeFirstname + ' '+ safeLastname +' you are now registered! We will send an email to you at ' + req.body.email
                    result += '  ' + 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    res.send(result)
                
                }
                
                })
        
    })
    }
    
    // saving data in database                                                                           
}); 

router.get('/list', redirectLogin, function(req, res, next) {
  const sql = 'SELECT username, firstname, lastname, email FROM users'
  db.query(sql, function(err, rows) {
    if (err) {
      return next(err)
    }
    res.render('user_list', { users: rows })
  })
})

router.get('/login',function(req,res){
    res.render('login')
})

router.post('/loggedin', 
    [
        check('username').notEmpty(),
        check('password').notEmpty()
    ],
function(req, res, next){
    const username = req.body.username
    const password = req.body.password
    
    const sql = 'SELECT * FROM users WHERE username = ?'
    const auditSql = 'INSERT INTO audit_log (username, success) VALUES (?, ?)'

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   return res.send("Username and password cannot be empty")
}

    db.query(sql,[username], function(err,rows){
        if(err){
            return next(err)
        }

        const user = rows[0]
        const hashedPassword = user.hashedPassword

    // Compare the password supplied with the password in the database
    bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
        if (err) {
            return next(err)
        }

        db.query(auditSql, [username, result === true])
        
        if (result == true) {
            // Save user session here, when login is successful
            req.session.userId = req.body.username;
            res.send('Successful! Wlcome ' +  user.firstname)
        }
        else {
            res.send('Wrong password, please check')
        }
    })

    })

})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>');
    })
})

router.get('/audit', function(req,res,next){
    const sql = 'SELECT * FROM audit_log ORDER BY time DESC'
    db.query(sql, function(err, rows){
        if (err){
            return next(err)
        }
        res.render('audit', {logs: rows})
    })
})
// Export the router object so index.js can access it
module.exports = router
