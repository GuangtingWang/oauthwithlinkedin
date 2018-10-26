const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    linkedinId: String,
    job: String,
    link: String,
    thumbnail:String
});

const User = mongoose.model("user",userSchema);

module.exports = User;