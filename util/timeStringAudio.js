module.exports = {
	convert(timeSeconds) {
		const hours = Math.floor(timeSeconds / 3600);
		timeSeconds -= hours * 3600;
		const minutes = Math.floor(timeSeconds / 60);
		timeSeconds -= minutes * 60;
		const seconds = timeSeconds;

		let stringReturn = '';

		if (hours > 0) {
			stringReturn += `${hours}:`;

			if (minutes < 10) {
				stringReturn += `0${minutes}:`;
			} else {
				stringReturn += `${minutes}:`;
			}
		} else {
			stringReturn += `${minutes}:`;
		}

		if (seconds < 10) {
			stringReturn += `0${seconds}`;
		} else {
			stringReturn += seconds;
		}

		return stringReturn;
	}
};
