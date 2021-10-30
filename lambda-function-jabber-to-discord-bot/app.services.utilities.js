module.exports.formattingTasks = (initialPayload, zKillboardURL, fcName) => {
	let finalResult;
	const checkForKeywords = JSON.stringify(initialPayload)
		.toUpperCase()
		.replace(':', '');

	const formattingMatches = () => {
		const regexFormatList = /(•)/gm;
		const substFormatList = `-`;
		finalResult = finalResult.replace(regexFormatList, substFormatList);

		const regexRemoveLineBreaks = /(\\t\\n)|(\\n)|(\\r)|(\\n\\n)/g;
		const substRemoveLineBreaks = `\n`;
		finalResult = finalResult.replace(
			regexRemoveLineBreaks,
			substRemoveLineBreaks
		);

		const regexDescriptionItalics = /^.*^(.*)$/m;
		const substDescriptionItalics = `_$1_`;
		finalResult = finalResult.replace(
			regexDescriptionItalics,
			substDescriptionItalics
		);

		const regexFcBreak = /(FC Name:)(.*)/gm;
		const substFcBreak = `**FC Name:** [${fcName}](${zKillboardURL})`;
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
		const regexInitialPayloadFormatting =
			/(.*)(directorbot:)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(comms:)(.*)(Doctrine:)(.*)(")/gims;
		const substInitialPayloadFormatting = `$3\n$4$5\n$6$7\n$8$9\n$10$11\n$12$13`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		const regexRemoveCommsAndBroadcast =
			/(comms:)(.*)(doctrine:)(.*)(~~~\sThis was a)(.*)/gims;

		const substRemoveCommsAndBroadcast = `$3$4`;
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
		const regexInitialPayloadFormatting =
			/(.*)(directorbot:)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(.*)(Doctrine:)(.*)(")/gims;
		const substInitialPayloadFormatting = `$3\n$4$5\n$6$7\n$8$9\n$11$12`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		const regexRemoveBroadcast = /(.*)(doctrine:)(.*)(~~~\sThis was a)(.*)/gims;
		const substRemoveBroadcast = `$1$2$3`;

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
		const regexInitialPayloadFormatting =
			/(.*)(directorbot:)(.*)(FC Name:)(.*)(Fleet Name:)(.*)(Formup Location:)(.*)(Reimbursement:)(.*)(comms:)(.*)(Doctrine:)(.*)(")/gim;
		const substInitialPayloadFormatting = `$3\n$4$5\n$6$7\n$8$9\n$10$11\n$12$13\n$14$15`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		const regexRemoveCommsAndBroadcast =
			/(.*)(comms:)(.*)(doctrine:)(.*\\n)|(~~~ This was a.*)/gims;

		const substRemoveCommsAndBroadcast = `$1$4$5`;
		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);
		formattingMatches();
	} else {
		const regexInitialPayloadFormatting = /(.*)(directorbot:\s)(.*)(")/gims;
		const substInitialPayloadFormatting = `$3`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		const regexRemoveLineBreaks = /(\\t\\n)|(\\n)|(\\r)|(\\n\\n)/g;
		const substRemoveLineBreaks = `\n`;
		finalResult = finalResult.replace(
			regexRemoveLineBreaks,
			substRemoveLineBreaks
		);

		const regexRemoveBroadcast = /(.*)(~~~\sThis was a)(.*)/gims;
		const substRemoveBroadcast = `$1`;

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
	}

	const regexFinalResultFormatting =
		/(Fleet Name:)|(Formup Location:)|(Reimbursement:)|(Pap Type:)|(Doctrine:)/gim;
	const substFinalresultFormatting = `**$1$2$3$4$5**`;
	return finalResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	);
};
