const axios = require('axios');
const keys = require('../../config/keys');

module.exports = {
	name: 'gif',
	type: 'general',

	execute(message, args, client) {
		if (!args[0]) {
			message.channel.send('Please enter search terms to get a gif!');
			return;
		}

		let search = args.shift();

		args.forEach((word) => {
			search += '+' + word;
		});

		axios.default
			.get(`http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${keys.giphy_key}&limit=1`)
			.then((result) => {
				const embed = {
					color: '#f5db47',
					author: {
						name: `${result.data.data[0].title}`,
						url: result.data.data[0].url
					},
					image: {
						url: `https://media.giphy.com/media/${result.data.data[0].id}/giphy.gif`
					},
					footer: {
						text: 'Powered by GIPHY',
						icon_url: 'https://giphy.com/static/img/giphy_logo_square_social.png'
					}
				};

				message.channel.send({ embed: embed });
			})
			.catch((err) => {
				message.channel.send("Sorry we couldn't get that gif from Giphy ;-;");
			});
	}
};
