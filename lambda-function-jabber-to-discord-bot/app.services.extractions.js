/**
 * I'm extracting more data from the initial payload
 * to be processed and appended to the final output
 * passed to Discord
 */

const {
	zKillboardURL,
	regexzKillboardURL,
	substzKillboardURL,
	regexFlightCommanderName,
	substFlightCommanderName,
	regexExtractURL,
	substExtractURL,
	regexBroadcastFrom,
} = require('./app.constants');

module.exports.extractBroadcastMesssage = (initialPayload) => {
	let broadcastFrom = JSON.stringify(initialPayload);
	let resultsBroadcastFrom = [];
	resultsBroadcastFrom = broadcastFrom.match(regexBroadcastFrom);

	if (resultsBroadcastFrom !== null) {
		resultsBroadcastFrom = JSON.stringify(resultsBroadcastFrom[0]);
		return (resultsBroadcastFrom = resultsBroadcastFrom
			.replace(/(.*)(This was a\s.*)(~~~.*)/gim, '$2')
			.trim());
	} else {
		return (resultsBroadcastFrom = 'Broadcast Message from Directorbot');
	}
};

module.exports.extractCommsURL = (initialPayload) => {
	const transformURL = JSON.stringify(initialPayload).toLocaleLowerCase();
	let mumbleURL = JSON.stringify(initialPayload);

	if (transformURL.includes('comms') && transformURL.includes('http')) {
		mumbleURL = mumbleURL
			.replace(regexExtractURL, substExtractURL)
			.split('"')[0]
			.trim()
			.replace('\\', '');
		mumbleURL = mumbleURL.replace(/(.*)(html)(.*)/, '$1$2');
		console.log(`Here's the Mumble URL: ${mumbleURL}`);
		return mumbleURL;
	} else {
		mumbleURL = null;
		console.log(`There is no Mumble URL: ${mumbleURL}`);
		return (mumbleURL = null);
	}
};

module.exports.extractFCName = (initialPayload) => {
	let flightCommander = JSON.stringify(initialPayload);
	let resultFlightCommanderName = flightCommander.replace(
		regexFlightCommanderName,
		substFlightCommanderName
	);

	resultFlightCommanderName = resultFlightCommanderName.split(' ').splice(1);
	resultFlightCommanderName = resultFlightCommanderName.join(' ').trim();
	console.log(`Debug FC Name: ${resultFlightCommanderName}`);

	return resultFlightCommanderName;
};

module.exports.generateKillboardURL = (initialPayload) => {
	let finalzKillboardURL = zKillboardURL + initialPayload;
	return (finalzKillboardURL = finalzKillboardURL.replace(
		regexzKillboardURL,
		substzKillboardURL
	));
};
