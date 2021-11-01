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
	let checkForKeywords = JSON.stringify(initialPayload)
		.toUpperCase()
		.replace(':', '');

	let formattingMatches = () => {
		finalResult = finalResult.replace(regexFormatList, substFormatList);
		finalResult = finalResult.replace(
			regexRemoveLineBreaks,
			substRemoveLineBreaks
		);

		finalResult = finalResult.replace(
			regexDescriptionItalics,
			substDescriptionItalics
		);

		let regexFcBreak = /(FC Name:)(.*)/gm;
		let substFcBreak = `**FC Name:** [${fcName}](${zKillboardURL})`;
		finalResult = finalResult.replace(regexFcBreak, substFcBreak);

		let topSplit = finalResult.split('**')[0];
		topSplit = topSplit.replace(/^\s+|\s+$/g, '');
		let bottomSplit = finalResult.substring(
			finalResult.indexOf('\n**FC Name:') + 1
		);
		bottomSplit = bottomSplit.replace(/(^\n)/gm, '');
		bottomSplit = bottomSplit.replace(/(\*\*FC Name:\*\*)/gms, '\n\n$1');
		console.log(`Debug Bottom Split for insert ${bottomSplit}`);
		finalResult = topSplit + bottomSplit;
		return finalResult;
	};

	if (
		checkForKeywords.includes('FC NAME') == true &&
		checkForKeywords.includes('FORMUP LOCATION') == true &&
		checkForKeywords.includes('PAP TYPE') == true &&
		checkForKeywords.includes('COMMS') == true &&
		checkForKeywords.includes('DOCTRINE') == true
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
		formattingMatches();
	} else if (
		checkForKeywords.includes('FC NAME') == true &&
		checkForKeywords.includes('FORMUP LOCATION') == true &&
		checkForKeywords.includes('PAP TYPE') == true &&
		checkForKeywords.includes('COMMS') !== true &&
		checkForKeywords.includes('DOCTRINE') == true
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfOne,
			substInitialPayloadFormattingElseIfOne
		);

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
		formattingMatches();
	} else if (
		checkForKeywords.includes('FC NAME') == true &&
		checkForKeywords.includes('FLEET NAME') == true &&
		checkForKeywords.includes('FORMUP LOCATION') == true &&
		checkForKeywords.includes('REIMBURSEMENT') == true &&
		checkForKeywords.includes('COMMS') == true &&
		checkForKeywords.includes('DOCTRINE') == true
	) {
		finalResult = initialPayload.replace(
			regexInitialPayloadFormattingElseIfTwo,
			substInitialPayloadFormattingElseIfTwo
		);

		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
		formattingMatches();
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

	return finalResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	);
};
module.exports.randomWarQuote = () =>
	warQuotes[Math.floor(Math.random() * warQuotes.length)];
