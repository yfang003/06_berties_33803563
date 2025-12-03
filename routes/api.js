const express = require('express')
const router = express.Router()


// GET /api/books
router.get('/books', function (req, res, next) {

  const search = req.query.search        
  const minprice = req.query.minprice    
  const maxprice = req.query.maxprice   
  const sort = req.query.sort           

  let sqlquery = 'SELECT * FROM books'
  let conditions = []
  let params = []


  if (search) {
    conditions.push('name LIKE ?')
    params.push(`%${search}%`)
  }

  if (minprice) {
    conditions.push('price >= ?')
    params.push(minprice)
  }

  if (maxprice) {
    conditions.push('price <= ?')
    params.push(maxprice)
  }
//sorting
  if (conditions.length > 0) {
    sqlquery += ' WHERE ' + conditions.join(' AND ')
  }


  if (sort === 'name') {
    sqlquery += ' ORDER BY name'
  } else if (sort === 'price') {
    sqlquery += ' ORDER BY price'
  }

  db.query(sqlquery, params, (err, result) => {
    if (err) {
      console.log('SQL error:', err, 'query:', sqlquery, 'params:', params)
      return next(err)
    }

    res.json(result)
  })
})

module.exports = router
