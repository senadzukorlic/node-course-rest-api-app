const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    email:{type: String,required:true},
    password:{type: String,required:true},
    name:{type: String,required:true},
    status:{type: String,required:true},
    posts: {type:Sequelize.JSON,ref:'post'}
})
module.exports = User;