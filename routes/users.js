var express = require('express')
var router = express.Router()

const { check } = require('express-validator')

const userController = require('../controllers/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post(
  '/register',
  [
    check('email', 'กรุณาป้อนอีเมล').isEmail(),
    check('name', 'กรุณาป้อนชื่อของท่าน').not().isEmpty(),
    check('password', 'กรุณาป้อนรหัสผ่าน').not().isEmpty(),
  ],
  userController.register
)

router.post(
  '/login',
  [
    check('email', 'กรุณาป้อนอีเมล').isEmail(),
    check('password', 'กรุณาป้อนรหัสผ่าน').notEmpty(),
  ],
  userController.login
)

module.exports = router
