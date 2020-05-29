const randomReddit = require('../../util/randomReddit');
const memberObj = require('../../objects/memberObj');
const timeString = require('../../util/timeString');

module.exports = {
	name: 'r',
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

		if (args.length > 1) {
			message.channel.send('Subreddit names must be one word!');
			return;
		} else if (!args[0]) {
			message.channel.send('Give me a subreddit to search!');
			return;
		}

		randomReddit
			.search(args[0], message)
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
