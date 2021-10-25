module.exports.formattingTasks = (initialPayload, zKillboardURL, fcName) => {
	// Remove incorrectly formated line breaks
	const regexRemoveLineBreaks = /\\n|\r/gim;
	const substRemoveLineBreaks = `\n`;
	const resultLineBreaks = initialPayload.replace(
		regexRemoveLineBreaks,
		substRemoveLineBreaks
	);

	// Remove tildes which cause strikeouts
	const regexRemoveTildes = /(~~~ |~~~| ~~~|~~ |~~)/gim;
	const substRemoveTildes = ``;
	const resultTildes = resultLineBreaks.replace(
		regexRemoveTildes,
		substRemoveTildes
	);

	// Remove the conversation from intro
	const regexRemoveConversation = /(conversation).*/gim;
	const substRemoveConversation = ``;
	const resultRemoveCoversation = resultTildes.replace(
		regexRemoveConversation,
		substRemoveConversation
	);

	// Remove the timestamp
	const regexRemoveTimestamp =
		/([(][0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (?:A|P)\.?M[)]\.? directorbot: )/gm;
	const substRemoveTimestamp = ``;
	const resultRemoveTimestamp = resultRemoveCoversation.replace(
		regexRemoveTimestamp,
		substRemoveTimestamp
	);

	// Remove the quotes from Stringify
	const regexRemoveQuotes = /(")/gm;
	const substRemoveQuotes = ``;
	const resultRemoveQuotes = resultRemoveTimestamp.replace(
		regexRemoveQuotes,
		substRemoveQuotes
	);

	let finalResult = resultRemoveQuotes;

	// Insert Line Break for FC
	const regexFcBreak = /(FC Name:)(.*)/gm;
	const substFcBreak = `\n**FC Name:** [${fcName}](${zKillboardURL})`;
	finalResult = finalResult.replace(regexFcBreak, substFcBreak);

	// Remove comms since we have a mumble button
	const regexRemoveComms = /(Comms:)(.*$\n)/gim;
	const substRemoveComms = ``;
	finalResult = finalResult.replace(regexRemoveComms, substRemoveComms);

	// Remove broadcast message since we moved it up
	const regexRemoveBroadcast = /(This was a).*/gim;
	const substRemoveBroadcast = ``;
	finalResult = finalResult.replace(regexRemoveBroadcast, substRemoveBroadcast);

	// Let's format the payload
	const regexFinalResultFormatting =
		/(Formup Location:)|(Pap Type:)|(Doctrine:)/gim;
	const substFinalresultFormatting = `**$1$2$3**`;
	finalResult = finalResult.replace(
		regexFinalResultFormatting,
		substFinalresultFormatting
	);

	// Format the message
	const regexFormatMessage = /(^)(.*\S)(.*$\s)/m;
	const substFormatMessage = `_$2_`;
	return (finalResult = finalResult.replace(
		regexFormatMessage,
		substFormatMessage
	));
};
