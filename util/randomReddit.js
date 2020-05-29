const snoowrap = require('snoowrap');
const keys = require('../config/keys');

module.exports = {
	name: 'r',

	async search(subredditName, message) {
		const r = new snoowrap({
			userAgent: keys.reddit.userAgent,
			clientId: keys.reddit.clientId,
			clientSecret: keys.reddit.clientSecret,
			username: keys.reddit.username,
			password: keys.reddit.password
		});

		try {
			let post = await r
				.getRandomSubmission(subredditName)
				.catch((err) => message.channel.send(`No subreddits could be found for '${subredditName}'`));

			//Breaks out of an infinite loop if none of the parameters are true for a given subreddit
			let tries = 0;
			while (post.over_18 || post.is_video || !post.is_reddit_media_domain || post.ups < 250) {
				post = await r.getRandomSubmission(subredditName);
				tries++;

				if (tries > 25) {
					break;
				}
			}

			const embed = {
				color: '#f5db47',
				author: {
					name: post.title,
					url: `https://reddit.com${post.permalink}`
				},
				image: {
					url: post.url
				},
				footer: {
					text: `Posted by ${post.author.name} in ${post.subreddit_name_prefixed}`
				}
			};

			message.channel.send({ embed: embed });
		} catch (err) {
			message.channel.send('Sorry, no dank memes could be found!');
		}
	}
};
