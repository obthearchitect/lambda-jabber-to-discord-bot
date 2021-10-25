/**
 * I'm extracting a more data from the initial payload
 * to be processed and appended to the final output
 * passed to Discord
 */

module.exports.extractBroadcastMesssage = (initialPayload) => {
	const broadcastFrom = JSON.stringify(initialPayload);

	const regexBroadcastFrom = /(This was a\s.*)/gm;
	let resultsBroadcastFrom = [];
	resultsBroadcastFrom = broadcastFrom.match(regexBroadcastFrom);

	if (resultsBroadcastFrom !== null) {
		resultsBroadcastFrom = JSON.stringify(resultsBroadcastFrom[0]);
		resultsBroadcastFrom = resultsBroadcastFrom.replace(/(['""\\])/gim, '');
		return (resultsBroadcastFrom = resultsBroadcastFrom.replace(
			/(~~~)/gim,
			''
		));
	} else {
		return (resultsBroadcastFrom = 'Broadcast Message from Directorbot');
	}
};

module.exports.extractCommsURL = (initialPayload) => {
	let transformURL = JSON.stringify(initialPayload);
	const regexTransformURL = /comms/gim;
	const substTransformURL = `comms`;
	const resultTransformURL = transformURL.replace(
		regexTransformURL,
		substTransformURL
	);

	if (resultTransformURL.indexOf('comms') > -1) {
		const regexExtractURL = /(^.*(?<=OP\s[0-9]{1,4}\s))|(\\nDoctrine.*$)/gim;
		const substExtractURL = ``;
		transformURL = transformURL.replace(regexExtractURL, substExtractURL);
		return (transformURL = transformURL.split('"')[0].trim());
	} else {
		return (transformURL = null);
	}
};

module.exports.generateKillboardURL = (initialPayload) => {
	const flightCommander = JSON.stringify(initialPayload);
	const zKillboardURL = 'https://zkillboard.com/character/';

	const regexFlightCommanderName =
		/^.*(FC Name:)(.*)(\\\\nFormup Location:).*/gis;
	const substFlightCommanderName = `$2`;

	let resultFlightCommanderName = flightCommander.replace(
		regexFlightCommanderName,
		substFlightCommanderName
	);

	resultFlightCommanderName = resultFlightCommanderName.split(' ');
	resultFlightCommanderName = resultFlightCommanderName.splice(1);
	resultFlightCommanderName = resultFlightCommanderName.join(' ');
	// const fcName = resultFlightCommanderName;
	// console.log(fcName);

	const regexzKillboardURL = /\s/gim;
	const substzKillboardURL = `%20`;

	let finalzKillboardURL = zKillboardURL + resultFlightCommanderName;
	return (finalzKillboardURL = finalzKillboardURL.replace(
		regexzKillboardURL,
		substzKillboardURL
	));
};
