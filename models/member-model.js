const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for each user that logs in with discord --saved in mongoDB
const memberSchema = new Schema({
	userID: String,
	username: String,
	currency: Number,
	bank: Number,
	items: Array
});

const Member = mongoose.model('members', memberSchema);

module.exports = Member;
