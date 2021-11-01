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
	let transformURL = JSON.stringify(initialPayload);
	transformURL = transformURL.toLowerCase();

	if (transformURL.includes('comms') && transformURL.includes('http')) {
		transformURL = transformURL
			.replace(regexExtractURL, substExtractURL)
			.split('"')[0]
			.trim()
			.replace('\\', '');
		console.log(`Here's the Mumble URL: ${transformURL}`);
		return transformURL;
	} else {
		transformURL = null;
		console.log(`There is no Mumble URL: ${transformURL}`);
		return (transformURL = null);
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
