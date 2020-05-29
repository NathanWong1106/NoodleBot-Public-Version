const randomReddit = require('../../util/randomReddit');
const memberObj = require('../../objects/memberObj');
const timeString = require('../../util/timeString');

module.exports = {
	name: 'meme',
	type: 'general',

	async execute(message, args, client) {
		const userID = message.author.id;
		let member = members.get(userID);

		if (!member) {
			const memberObject = memberObj.create(userID);
			members.set(userID, memberObject);
			member = members.get(userID);
		} else if (member.redditTime > 0) {
			message.reply(`please wait ${timeString.convert(member.redditTime)} before searching reddit again!`);
			return;
		}

		randomReddit
			.search('dankmemes', message)
			.then(() => {
				member.redditTime = 5;
			})
			.catch((err) => {
				if (err) {
					return;
				}
			});
	}
};
