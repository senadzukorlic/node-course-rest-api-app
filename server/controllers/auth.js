// const User = require("../models/user")
// const { validationResult } = require("express-validator")
// const bcrypt = require("bcryptjs")
// exports.signup = (req, res, next) => {
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed.")
//     error.statusCode = 422
//     error.data = errors.array()
//     throw error
//   }
//   const email = req.body.email
//   const password = req.body.password
//   const name = req.body.name
//   bcrypt
//     .hash(password, 12)
//     .then((hashedPassword) => {
//       const newUser = new User({
//         email: email,
//         password: hashedPassword,
//         name: name,
//       })
//       return newUser.save()
//     })
//     .then((result) => {
//       res.statusCode(201).json({ message: "User created!", userId: result._id })
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500
//       }
//       next(err)
//     })
// }

const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const User = require("../models/user")

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
