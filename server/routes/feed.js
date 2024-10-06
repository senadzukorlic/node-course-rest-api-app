const express = require("express")
const feedCotroller = require("../controllers/feed")
const router = express.Router()

//GET /feed/posts
router.get("/posts", feedCotroller.getPosts)
router.post("/post", feedCotroller.createPost)

module.exports = router
