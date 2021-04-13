var express = require('express')
var router = express.Router()

const index = (req, res, next) => res.status(200).json({ message: 'Hello' })

/* GET home page. */
router.get('/', index)

module.exports = router
