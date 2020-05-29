const workConfig = require('../../currency-config/workConfig');
let response = new Map();

response.set(workConfig.work.AMAZINGWORK, 'did an ungodly amount of work and earned');
response.set(workConfig.work.GOODWORK, 'did most of their work and earned');
response.set(workConfig.work.MEDIUMWORK, 'slept at work and earned');
response.set(workConfig.work.BADWORK, 'forgot what work they had to do, but still earned');

module.exports = {
	getResponse(WORKTYPE) {
		return response.get(WORKTYPE);
	}
};
