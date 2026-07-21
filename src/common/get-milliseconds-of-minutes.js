export const getMillisecondsOfMinutes = (minutes) =>
	getMillisecondsOfSeconds(getSecondsOfMinutes(minutes));

const getSecondsOfMinutes = (minutes) => minutes * 60;

const getMillisecondsOfSeconds = (seconds) => seconds * 1000;
