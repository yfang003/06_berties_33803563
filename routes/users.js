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


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
  // Store hashed password in your database.
        if(err){
            next(err)
        }
            let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)"
            let newrecord = [
                            req.body.username, 
                            req.body.firstname, 
                            req.body.lastname, 
                            req.body.email, 
                            hashedPassword]
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                next(err)
                }
                else{
                    result = 'Hello '+ req.body.firstname + ' '+ req.body.lastname +' you are now registered! We will send an email to you at ' + req.body.email
                    result += '  ' + 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                    res.send(result)
                
                }
                
                })
        
    })
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

router.post('/loggedin', function(req, res, next){
    const username = req.body.username
    const password = req.body.password
    
    const sql = 'SELECT * FROM users WHERE username = ?'
    const auditSql = 'INSERT INTO audit_log (username, success) VALUES (?, ?)'

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
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
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
