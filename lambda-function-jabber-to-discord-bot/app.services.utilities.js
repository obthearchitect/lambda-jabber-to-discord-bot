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
	regexInitialPayloadFormattingElseIfTwo,
	substInitialPayloadFormattingElseIfTwo,
	regexInitialPayloadFormattingElseIfThree,
	substInitialPayloadFormattingElseIfThree,
	regexInitialPayloadFormattingElseIfFour,
	substInitialPayloadFormattingElseIfFour,
	regexRemoveBroadcast,
	substRemoveBroadcast,
	regexRemoveCommsAndBroadcastNoDoctrine,
	substRemoveCommsAndBroadcastNoDoctrine,
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

	console.log(`Debug Formatting Tasks ${checkForKeywords}`);
	if (
		checkForKeywords.includes('FC NAME') &&
		checkForKeywords.includes('FORMUP LOCATION') &&
		checkForKeywords.includes('PAP TYPE') &&
		checkForKeywords.includes('COMMS') &&
		checkForKeywords.includes('DOCTRINE')
	) {
		console.log(
			'Debug Matched: FC NAME, FORMUP LOCATION, PAP TYPE, COMMS, DOCTRINE'
		);
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
		console.log('Debug Matched: FC NAME, FORMUP LOCATION, PAP TYPE, DOCTRINE');
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
		console.log(
			'Debug Matched: FC NAME, FLEET NAME, FORMUP LOCATION, REIMBURSEMENT, COMMS, DOCTRINE'
		);
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfTwo,
			substInitialPayloadFormattingElseIfTwo
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
	} else if (
		checkForKeywords.includes('FC NAME') &&
		checkForKeywords.includes('FORMUP LOCATION') &&
		checkForKeywords.includes('PAP TYPE') &&
		checkForKeywords.includes('COMMS')
	) {
		console.log('Debug Matched: FC NAME, FORMUP LOCATION, PAP TYPE, COMMS');
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfFour,
			substInitialPayloadFormattingElseIfFour
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcastNoDoctrine,
			substRemoveCommsAndBroadcastNoDoctrine
		);
	} else {
		console.log('Debug Matched: Didnt match anything');
		console.log('Debug No matches finalresult: ' + finalResult);

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
	const checkForKeywords = JSON.stringify(finalString)
		.toUpperCase()
		.replace(':', '');

	if (
		!checkForKeywords.includes('FC NAME') &&
		!checkForKeywords.includes('FORMUP LOCATION') &&
		!checkForKeywords.includes('PAP TYPE') &&
		!checkForKeywords.includes('COMMS') &&
		!checkForKeywords.includes('DOCTRINE')
	) {
		console.log('Debug Matched: No matches!');
		return finalString;
	} else {
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
}

module.exports.randomWarQuote = () =>
	warQuotes[Math.floor(Math.random() * warQuotes.length)];
