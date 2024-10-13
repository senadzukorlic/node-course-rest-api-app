const { validationResult } = require("express-validator")
const Post = require("../models/post")

exports.getPosts = (req, res, next) => {
  Post.findAll()
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Fetched post successfully.", posts: posts })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
    })
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed,entered data is incorrect")
    error.statusCode = 422
    throw error
  }
  if (!req.file) {
    const error = new Error("No image provided.")
    error.statusCode = 442 //Pitaj da li je ovo statusCode ugradjeno
    throw error
  }
  const imageUrl = req.file.path.replace("\\", "/")
  const title = req.body.title
  const content = req.body.content
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: "Senad",
    },
  })
  post
    .save()
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getPost = (req, res, next) => {
  const prodId = req.params.postId
  Post.findByPk(prodId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.") //ovo moram sebi razjasnit
        error.statusCode = 404
        throw error
      }
      res.status(200).json({ message: "Post fetched.", post: post })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
