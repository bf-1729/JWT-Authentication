const mongoose = require("mongoose")

const users = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    confirmpassword:String
});

module.exports = mongoose.model("model",users)