module.exports = {
	convert(args) {
		const minutes = Math.floor(args / 60);
		const seconds = args % 60;

		if (minutes === 1 && seconds !== 1) {
			return `${minutes} minute and ${seconds} seconds`;
		} else if (minutes === 1 && seconds === 1) {
			return `${minutes} minute and ${seconds} second`;
		} else if (minutes !== 1 && seconds === 1) {
			return `${minutes} minutes and ${seconds} second`;
		} else {
			return `${minutes} minutes and ${seconds} seconds`;
		}
	}
};
