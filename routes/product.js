const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const productController = require('../controllers/product')
const upload = require('../middleware/upload')

router.get('/', productController.index)

router.get('/:id', productController.findOne)

router.post(
  '/',
  upload.single('photo'),
  [
    check('name', 'กรุณาป้อนข้อมูล').notEmpty(),
    check('description', 'กรุณาป้อนรายละเอียด').notEmpty(),
    check('price', 'กรุณาใส่ราคา').notEmpty(),
  ],
  productController.create
)

router.put('/:id', upload.single('photo'), productController.update)

router.delete('/:id', upload.single('photo'), productController.delete)

module.exports = router
