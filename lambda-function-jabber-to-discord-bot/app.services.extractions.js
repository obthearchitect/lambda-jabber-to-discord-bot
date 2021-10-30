/**
 * I'm extracting more data from the initial payload
 * to be processed and appended to the final output
 * passed to Discord
 */

module.exports.extractBroadcastMesssage = (initialPayload) => {
	const broadcastFrom = JSON.stringify(initialPayload);

	const regexBroadcastFrom = /(.*)(This was a\s.*)(~~~.*)/gim;
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
	console.log(`Debug iniitial transform url string: ${transformURL}`);

	if (transformURL.indexOf('comms') && transformURL.indexOf('http') > -1) {
		const regexExtractURL =
			/(.*)(comms:)(.*)(htt[p]|[s],2:)(.*)(\\nDoctrine)(.*)/gim;
		const substExtractURL = `$4$5`;
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
	const flightCommander = JSON.stringify(initialPayload);
	console.log(`Debug FC Name stringify: ${flightCommander}`);

	const regexFlightCommanderName =
		/(.*)(FC Name:)(.*?)(Fleet Name:|Formup Location|\\)(.*)/s;
	const substFlightCommanderName = `$3`;

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
	const zKillboardURL = 'https://zkillboard.com/character/';
	const regexzKillboardURL = /\s/gim;
	const substzKillboardURL = `%20`;

	let finalzKillboardURL = zKillboardURL + initialPayload;
	return (finalzKillboardURL = finalzKillboardURL.replace(
		regexzKillboardURL,
		substzKillboardURL
	));
};
