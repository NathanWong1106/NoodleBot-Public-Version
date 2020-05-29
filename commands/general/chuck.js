const axios = require('axios');
const urlAPI = require('../../config/urlAPI');

module.exports = {
	name: 'chuck',
	type: 'general',

	execute(message, args, client) {
		axios
			.get(urlAPI.chuckNorris)
			.then(async (result) => {
				message.channel.send(await result.data.value);
			})
			.catch((err) => {
				if (err) {
					message.channel.send("Sadly, we can't get any Chuck Norris facts at the moment");
				}
			});
	}
};
