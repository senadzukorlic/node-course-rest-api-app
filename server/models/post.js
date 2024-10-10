const Sequelize = require("sequelize")

const sequelize = require("../util/database")

const Post = sequelize.define(
  "post",
  {
    title: { type: Sequelize.STRING, allowNull: false },
    imageUrl: { type: Sequelize.STRING, allowNull: false },
    content: { type: Sequelize.STRING, allowNull: false },
    creator: { type: Object, allowNull: false },
  },
  { timestamps: true }
)

module.exports = Post
