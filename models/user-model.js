const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for each user that logs in with discord --saved in mongoDB
const userSchema = new Schema({
    userID: String,
    username: String,
    accessToken: String,
    avatar: String,
    ownedGuilds: Array,
    joinedGuilds: Array
})

const User = mongoose.model('Users', userSchema);

module.exports = User;