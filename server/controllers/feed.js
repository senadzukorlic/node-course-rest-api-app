const { validationResult } = require("express-validator")
const Post = require("../models/post")
const fs = require("fs")
const path = require("path")

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.count()
      .then(count => {
        totalItems = count;
        return Post.findAll({
          offset: (currentPage - 1) * perPage,
          limit: perPage
        })
      })
      .then(posts => {
        res.status(200).json({
          message: "Fetched posts successfully.",
          posts: posts,
          totalItems: totalItems
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId
  console.log("Update Post ID:", postId) // Dodaj ovaj log
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect")
    error.statusCode = 422
    throw error
  }
  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/")
  }
  if (!imageUrl) {
    const error = new Error("No file picked.")
    error.statusCode = 422
    throw error
  }
  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.")
        error.statusCode = 404
        throw error
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }
      post.title = title
      post.imageUrl = imageUrl
      post.content = content
      return post.save()
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated", post: result })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deletePost = (req,res,next)=>{
  const postId  = req.params.postId
  Post.findByPk(postId).then(post => {
    //Check logged in user
    if (!post) {
      const error = new Error("Could not find post.")
      error.statusCode = 404
      throw error
    }
    clearImage(post.imageUrl)

    return Post.destroy({ where: { id: postId } })
  }).then(result =>{
    console.log(result)
    res.status(200).json({message:'Deleted post'})
  }).catch(err => {
    if (!err.statusCode) {
    err.statusCode = 500
  }
  next(err)})
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath)
  fs.unlink(filePath, (err) => console.log(err))
}
