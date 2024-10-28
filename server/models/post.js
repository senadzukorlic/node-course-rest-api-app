// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
// const User = require("./user");
//
// const Post = sequelize.define(
//   "post",
//   {
//     title: { type: Sequelize.STRING, allowNull: false },
//     imageUrl: { type: Sequelize.STRING, allowNull: false },
//     content: { type: Sequelize.STRING, allowNull: false },
//     creator: { type: Sequelize.DataTypes.UUID, allowNull: false },
//   },
//   { timestamps: true },
// );
//
// Post.belongsTo(User, { foreignKey: "creator", as: "user" });
// User.hasMany(Post, { foreignKey: "creator" });
//
// module.exports = Post;

const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Post = sequelize.define(
  "post",
  {
    title: { type: Sequelize.STRING, allowNull: false },
    imageUrl: { type: Sequelize.STRING, allowNull: false },
    content: { type: Sequelize.STRING, allowNull: false },
    creator: { type: Sequelize.DataTypes.UUID, allowNull: false },
  },
  { timestamps: true },
);

Post.belongsTo(User, { foreignKey: "creator", as: "user" });
User.hasMany(Post, { foreignKey: "creator", as: "userPosts" });

module.exports = Post;
