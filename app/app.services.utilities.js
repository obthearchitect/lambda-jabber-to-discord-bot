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
			/(conversation)(.*)(directorbot:\s)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(Comms:)(.*)(Doctrine:)(.*)(this was a)(.*)/gims;
		const substInitialPayloadFormatting = `_$4_\n\n$5$6\n$7$8\n$9$10\n$13$14`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);
	} else if (
		checkForKeywords.includes('FC NAME') == true &&
		checkForKeywords.includes('FORMUP LOCATION') == true &&
		checkForKeywords.includes('PAP TYPE') == true &&
		checkForKeywords.includes('COMMS') !== true &&
		checkForKeywords.includes('DOCTRINE') == true
	) {
		const regexInitialPayloadFormatting =
			/(conversation)(.*)(directorbot:\s)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(.*)(Doctrine:)(.*)(this was a)(.*)/gim;
		const substInitialPayloadFormatting = `_$4_\n\n$5$6\n$7$8\n$9$10\n$12$13`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);
	} else {
		const regexInitialPayloadFormatting = /(.*)(directorbot:\s)|(\\n|\r)/gim;
		const substInitialPayloadFormatting = `\n`;

		finalResult = initialPayload.replace(
			regexInitialPayloadFormatting,
			substInitialPayloadFormatting
		);
	}

	const regexRemoveLineBreaks = /(\\n|\r)|(~~~)|(")/gims;
	const substRemoveLineBreaks = ``;

	finalResult = finalResult.replace(
		regexRemoveLineBreaks,
		substRemoveLineBreaks
	);

	const regexFcBreak = /(FC Name:)(.*)/gm;
	const substFcBreak = `**FC Name:** [${fcName}](${zKillboardURL})`;
	finalResult = finalResult.replace(regexFcBreak, substFcBreak);

	const regexFinalResultFormatting =
		/(Formup Location:)|(Pap Type:)|(Doctrine:)/gim;
	const substFinalresultFormatting = `**$1$2$3**`;
	return (finalResult = finalResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	));
};
