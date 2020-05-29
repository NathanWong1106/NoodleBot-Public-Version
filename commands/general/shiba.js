const axios = require('axios');
const urlAPI = require('../../config/urlAPI');

//honestly I was just bored and wanted to look at some shibas

module.exports = {
	name: 'shiba',
	type: 'general',

	execute(message, args, client) {
		//heres your normal GET request using axios
		axios.default
			.get(urlAPI.shibe)
			.then((shibe) => {
				//get the url, create embed message, send embed message, get doggo, ...profit?
				const url = shibe.data[0];

				const embed = {
					title: 'Doggo!',
					color: '#f5db47',
					image: {
						url: url
					}
				};

				message.channel.send({ embed: embed });
			})
			.catch((err) => {
				console.log(err);
				message.channel.send('No doggos were found ;-;');
			});
	}
};
