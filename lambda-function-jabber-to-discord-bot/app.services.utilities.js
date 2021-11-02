const {
	regexFormatList,
	substFormatList,
	regexRemoveLineBreaks,
	substRemoveLineBreaks,
	regexDescriptionItalics,
	substDescriptionItalics,
	regexInitialPayloadFormatting,
	substInitialPayloadFormatting,
	regexRemoveCommsAndBroadcast,
	substRemoveCommsAndBroadcast,
	regexInitialPayloadFormattingElseIfOne,
	substInitialPayloadFormattingElseIfOne,
	regexRemoveBroadcast,
	substRemoveBroadcast,
	regexInitialPayloadFormattingElseIfTwo,
	substInitialPayloadFormattingElseIfTwo,
	regexInitialPayloadFormattingElseIfThree,
	substInitialPayloadFormattingElseIfThree,
	regexFinalResultFormatting,
	substFinalresultFormatting,
	warQuotes,
} = require('./app.constants');

module.exports.formattingTasks = (initialPayload, zKillboardURL, fcName) => {
	let finalResult;
	const passzKillboardURL = zKillboardURL;
	const passfcName = fcName;
	let checkForKeywords = JSON.stringify(initialPayload)
		.toUpperCase()
		.replace(':', '');

	if (
		checkForKeywords.includes('FC NAME') &&
		checkForKeywords.includes('FORMUP LOCATION') &&
		checkForKeywords.includes('PAP TYPE') &&
		checkForKeywords.includes('COMMS') &&
		checkForKeywords.includes('DOCTRINE')
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
	} else if (
		checkForKeywords.includes('FC NAME') &&
		checkForKeywords.includes('FORMUP LOCATION') &&
		checkForKeywords.includes('PAP TYPE') &&
		!checkForKeywords.includes('COMMS') &&
		checkForKeywords.includes('DOCTRINE')
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfOne,
			substInitialPayloadFormattingElseIfOne
		);

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
	} else if (
		checkForKeywords.includes('FC NAME') &&
		checkForKeywords.includes('FLEET NAME') &&
		checkForKeywords.includes('FORMUP LOCATION') &&
		checkForKeywords.includes('REIMBURSEMENT') &&
		checkForKeywords.includes('COMMS') &&
		checkForKeywords.includes('DOCTRINE')
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfTwo,
			substInitialPayloadFormattingElseIfTwo
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
	} else {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfThree,
			substInitialPayloadFormattingElseIfThree
		);

		finalResult = finalResult.replace(
			regexRemoveLineBreaks,
			substRemoveLineBreaks
		);

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
	}

	const callToFinalFormattedResult = formattingMatches(
		finalResult,
		passzKillboardURL,
		passfcName
	);
	return callToFinalFormattedResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	);
};

function formattingMatches(finalString, zKillboardURL, fcName) {
	let finalFormattedString = finalString.replace(
		regexFormatList,
		substFormatList
	);
	finalFormattedString = finalFormattedString.replace(
		regexRemoveLineBreaks,
		substRemoveLineBreaks
	);

	finalFormattedString = finalFormattedString.replace(
		regexDescriptionItalics,
		substDescriptionItalics
	);

	let regexFcBreak = /(FC Name:)(.*)/gm;
	let substFcBreak = `**FC Name:** [${fcName}](${zKillboardURL})`;
	finalFormattedString = finalFormattedString.replace(
		regexFcBreak,
		substFcBreak
	);

	let topSplit = finalFormattedString.split('**')[0];
	topSplit = topSplit.replace(/^\s+|\s+$/g, '');
	let bottomSplit = finalFormattedString.substring(
		finalFormattedString.indexOf('\n**FC Name:') + 1
	);
	bottomSplit = bottomSplit.replace(/(^\n)/gm, '');
	bottomSplit = bottomSplit.replace(/(\*\*FC Name:\*\*)/gms, '\n\n$1');
	console.log(`Debug Bottom Split for insert ${bottomSplit}`);
	finalFormattedString = topSplit + bottomSplit;
	return finalFormattedString;
}

module.exports.randomWarQuote = () =>
	warQuotes[Math.floor(Math.random() * warQuotes.length)];
