const User = require('../models/user')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config/index')

exports.register = async (req, res, next) => {
  try {
    //Insert  Data
    const { name, password, email } = req.body

    //validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('ข้อมูลที่รับมาไม่ถูกต้อง')
      error.statusCode = 422
      error.validation = errors.array()
      throw error
    }

    //check email ซ้ำ
    const existEmail = await User.findOne({ email: email })
    if (existEmail) {
      const error = new Error('อีเมล์นี้ มีผู้ใช้งานแล้ว')
      error.statusCode = 400
      throw error
    }

    let user = new User()
    user.name = name
    user.password = await user.encryptPassword(password)
    user.email = email

    await user.save()

    const userResponse = { id: user.id, name: user.name, email: user.email }

    res.status(201).json({ message: 'ลงทะเบียนเรียบร้อย', user: userResponse })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //check email ในระบบว่ามี่อยู่หรือไม่
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('ไม่พบผู้ใช้งานในระบบ')
      error.statusCode = 404
      throw error
    }

    //ตรวจสอบรหัสผ่านว่าตรงหรือไม่ ถ้าไม่ตรง (false) ให้โยน error
    const isValid = await user.checkPassword(password)
    if (!isValid) {
      const error = new Error('รหัสผ่านไม่ถูกต้อง')
      error.statusCode = 401
      throw error
    }
    /**/
    //สร้าง  token  {payload,secret, option}
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: '5 days' }
    )

    //decode วันหมดอายุ
    const expires_In = jwt.decode(token)
    res.setHeader('Set-Cookie', 'token=' + token)
    res.status(201).json({
      access_token: token,
      expiresIn: expires_In.exp,
      token_type: 'Bearer',
    })

    // res.render('me')

    // res.status(201).json({
    //     message: 'Login complete'
    // });
  } catch (error) {
    next(error)
  }
}
