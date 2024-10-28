const express = require("express");
const { body } = require("express-validator");
const feedCotroller = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

//GET /feed/posts
router.get("/posts", isAuth, feedCotroller.getPosts);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedCotroller.createPost,
);
router.get("/post/:postId", isAuth, feedCotroller.getPost);

router.put("/post/:postId", isAuth, [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
  feedCotroller.updatePost,
]);

router.delete("/post/:postId", isAuth, feedCotroller.deletePost);
module.exports = router;
