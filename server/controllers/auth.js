const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.")
    error.statusCode = 422
    error.data = errors.array()
    return next(error)
  }

  const email = req.body.email
  const password = req.body.password
  const name = req.body.name

  try {
    const existingUser = await User.findOne({ where: { email: email } })
    if (existingUser) {
      const error = new Error("E-Mail address already exists!")
      error.statusCode = 422
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: email,
      password: hashedPassword,
      name: name,
      status: "I am new!",
    })

    res.status(201).json({ message: "User created!", userId: user.id })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser;
  User.findOne({ where: { email: email } }).then(user =>{
    if(!user){
      const error = new Error('A user with this email could not be found.')
      error.statusCode = 401
        throw error
    }
  loadedUser = user;
    return bcrypt.compare(password, user.password)
  }).then(isEqual =>{
if(!isEqual){
    const error = new Error('Wrong password!')
    error.statusCode = 401
  throw error
}
const token = jwt.sign({
    email: loadedUser.email,
    userId: loadedUser.id.toString()
    }, 'somesupersecretsecret', {expiresIn: '1h'})
    res.status(200).json({token: token, userId: loadedUser.id.toString()})
  }).catch(err => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    next(err)
  })
}