/**
 * Inspiration quotes that I use to pump up the team!
 */

module.exports.warQuotes = [
	'War is what happens when language fails.',
	'Appear weak when you are strong, and strong when you are weak.',
	'Only the dead have seen the end of war.',
	'If you win, you need not have to explain...If you lose, you should not be there to explain!',
	'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.',
	'In the midst of chaos, there is also opportunity',
	'When the enemy is relaxed, make them toil. When full, starve them. When settled, make them move.',
	'He who is prudent and lies in wait for an enemy who is not, will be victorious.',
	'Great results, can be achieved with small forces.',
	'Know your enemy and know yourself and you can fight a hundred battles without disaster',
];

/**
 * Regex Utility Constants
 */

module.exports.regexFormatList = /(•)/gm;
module.exports.substFormatList = `-`;
module.exports.regexRemoveLineBreaks = /(\\t\\n)|(\\n)|(\\r)|(\\n\\n)/g;
module.exports.substRemoveLineBreaks = `\n`;
module.exports.regexDescriptionItalics = /^.*^(.*)$/m;
module.exports.substDescriptionItalics = `_$1_`;
module.exports.regexInitialPayloadFormatting =
	/(.*)(directorbot:)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(comms:)(.*)(Doctrine:)(.*)(")/gims;
module.exports.substInitialPayloadFormatting = `$3\n$4$5\n$6$7\n$8$9\n$10$11\n$12$13`;
module.exports.regexInitialPayloadFormattingElseIfOne =
	/(.*)(directorbot:)(.*)(FC Name:)(.*)(Formup Location:)(.*)(Pap Type:)(.*)(.*)(Doctrine:)(.*)(")/gims;
module.exports.substInitialPayloadFormattingElseIfOne = `$3\n$4$5\n$6$7\n$8$9\n$11$12`;
module.exports.regexInitialPayloadFormattingElseIfTwo =
	/(.*)(directorbot:)(.*)(FC Name:)(.*)(Fleet Name:)(.*)(Formup Location:)(.*)(Reimbursement:)(.*)(comms:)(.*)(Doctrine:)(.*)(")/gim;
module.exports.substInitialPayloadFormattingElseIfTwo = `$3\n$4$5\n$6$7\n$8$9\n$10$11\n$12$13\n$14$15`;
module.exports.regexRemoveCommsAndBroadcast =
	/(.*)(comms:)(.*)(doctrine:)(.*\\n)|(~~~ This was a.*)/gims;
module.exports.substRemoveCommsAndBroadcast = `$1$4$5`;
module.exports.regexInitialPayloadFormattingElseIfThree =
	/(.*)(directorbot:\s)(.*)(")/gims;
module.exports.substInitialPayloadFormattingElseIfThree = `$3`;
module.exports.regexRemoveBroadcast = /(.*)(~~~\sThis was a)(.*)/gims;
module.exports.substRemoveBroadcast = `$1`;
module.exports.regexFinalResultFormatting =
	/(Fleet Name:)|(Formup Location:)|(Reimbursement:)|(Pap Type:)|(Doctrine:)/gim;
module.exports.substFinalresultFormatting = `**$1$2$3$4$5**`;

/**
 * Extraction Constants
 */

module.exports.regexBroadcastFrom = /(.*)(This was a\s.*)(~~~.*)/gim;
module.exports.regexExtractURL =
	/(.*)(comms:)(.*)(htt[p]|[s],2:)(.*)(\\nDoctrine)(.*)/gim;
module.exports.substExtractURL = `$4$5`;
module.exports.regexFlightCommanderName =
	/(.*)(FC Name:)(.*?)(Fleet Name:|Formup Location|\\)(.*)/s;
module.exports.substFlightCommanderName = `$3`;
module.exports.zKillboardURL = 'https://zkillboard.com/character/';
module.exports.regexzKillboardURL = /\s/gim;
module.exports.substzKillboardURL = `%20`;
