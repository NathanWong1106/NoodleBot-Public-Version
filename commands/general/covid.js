const axios = require('axios');
const urlAPI = require('../../config/urlAPI');

module.exports = {
	name: 'covid',
	type: 'general',

	//check for actual args
	//Concatenate args

	execute(message, args, client) {
		if (!args[0]) {
			message.channel.send('Please enter a country name/code!');
			return;
		}

		let country = args.shift();

		args.forEach((word) => {
			country += ' ' + word;
		});

		axios.default
			.get(urlAPI.covid)
			.then(async (result) => {
				let data = result.data.Countries.find((item) => item.Country.toLowerCase() === country.toLowerCase());
				if (!data) {
					data = result.data.Countries.find(
						(item) => item.CountryCode.toLowerCase() === country.toLowerCase()
					);
				}

				const embed = {
					title: data.Country,
					color: '#f5db47',
					author: {
						name: 'COVID-19 Stats For:'
					},
					fields: [
						{
							name: 'Confirmed Today:',
							value: data.NewConfirmed,
							inline: true
						},
						{
							name: 'Total Confirmed:',
							value: data.TotalConfirmed,
							inline: true
						},
						{
							name: 'Deaths Today:',
							value: data.NewDeaths,
							inline: true
						},
						{
							name: 'Total Deaths:',
							value: data.TotalDeaths,
							inline: true
						},
						{
							name: 'Recovered Today:',
							value: data.NewRecovered,
							inline: true
						},
						{
							name: 'Total Recovered:',
							value: data.TotalRecovered,
							inline: true
						}
					],
					footer: {
						text: 'Figures from: https://covid19api.com/'
					}
				};
				message.channel.send({ embed: embed });
			})
			.catch((err) => {
				message.channel.send(`No data was found for ${args[0]}`);
			});
	}
};
