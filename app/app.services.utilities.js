module.exports.formattingTasks = (initialPayload, zKillboardURL, fcName) => {
	let finalResult;
	const checkForKeywords = JSON.stringify(initialPayload)
		.toUpperCase()
		.replace(':', '');

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

		console.log(`Debug the removal of comms ${finalResult}`);
		const regexRemoveCommsAndBroadcast =
			/(comms:)(.*)(doctrine:)(.*)(~~~\sThis was a)(.*)/gims;

		const substRemoveCommsAndBroadcast = `$3$4`;
		finalResult = finalResult.replace(
			regexRemoveCommsAndBroadcast,
			substRemoveCommsAndBroadcast
		);

		console.log(`Debug Final Result for Formatting WITH Comms: ${finalResult}`);
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

		console.log(
			`Debug show me the reults for the initial formattin for no comms: \n${finalResult}`
		);
		const regexRemoveBroadcast = /(.*)(doctrine:)(.*)(~~~\sThis was a)(.*)/gims;
		const substRemoveBroadcast = `$1$2$3`;

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
	} else {
		const regexInitialPayloadFormatting = /(.*)(directorbot:\s)(.*)(")/gims;
		const substInitialPayloadFormatting = `$3`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);

		const regexRemoveBroadcast = /(.*)(~~~\sThis was a)(.*)/gims;
		const substRemoveBroadcast = `$1`;

		finalResult = finalResult.replace(
			regexRemoveBroadcast,
			substRemoveBroadcast
		);
	}

	console.log(`Debugging before line breaks: ${finalResult}`);

	const regexRemoveLineBreaks = /(\\t\\n)|(\\n)|(\\r)|(\\n\\n)/g;
	const substRemoveLineBreaks = ` `;
	finalResult = finalResult.replace(
		regexRemoveLineBreaks,
		substRemoveLineBreaks
	);

	console.log(`Debugging after line breaks: ${finalResult}`);

	const regexDescriptionItalics = /^.*^(.*)$/m;
	const substDescriptionItalics = `_$1_`;
	finalResult = finalResult.replace(
		regexDescriptionItalics,
		substDescriptionItalics
	);

	const regexFcBreak = /(FC Name:)(.*)/gm;
	const substFcBreak = `\n**FC Name:** [${fcName}](${zKillboardURL})`;
	finalResult = finalResult.replace(regexFcBreak, substFcBreak);

	const regexFinalResultFormatting =
		/(Formup Location:)|(Pap Type:)|(Doctrine:)/gim;
	const substFinalresultFormatting = `**$1$2$3**`;
	return finalResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	);
};
