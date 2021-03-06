/**
 * Let's initialize all our required modules & libraries
 * TODO: Add a maintenance mode for the bot
 */
const zlib = require('zlib');
const { discordMessage } = require('./app.services.discord.js');
const {
	extractBroadcastMesssage,
	extractCommsURL,
	extractFCName,
	generateKillboardURL,
} = require('./app.services.extractions');
const { formattingTasks, randomWarQuote } = require('./app.services.utilities');
const { Client, Intents } = require('discord.js');

/**
 * This section is the handler that's responsible for processing
 * the Cloudwatch Logs that the Lambda function is subscribed to
 */

exports.handler = function (input, context, callback) {
	const cwlogsPayload = new Buffer.from(input.awslogs.data, 'base64');

	zlib.gunzip(cwlogsPayload, function (e, result) {
		if (e) {
			context.fail(e);
			return callback(console.log('Lambda did not complete successfully'));
		} else {
			result = JSON.parse(result.toString('utf-8'));
			const result2 = JSON.stringify(result);
			console.log(`Debug Showign Result2 ${result2}`);
			return callback(
				FleetAlerts(result) + console.log('Lambda ran successfully')
			);
		}
	});
};

/**
 * In this section we take the payload that we recieved from Lambda
 * and perform all the required transformations, and send the final
 * result to Discord via the MessageEmbed API
 */

function FleetAlerts(result) {
	const storedPayloadStringified = JSON.stringify(result.logEvents[0].message);

	const storedExtractCommsURL = extractCommsURL(storedPayloadStringified);
	const storedFCName = extractFCName(storedPayloadStringified);

	const storedKillboardURL = generateKillboardURL(storedFCName);
	const storedFinalResult = formattingTasks(
		storedPayloadStringified,
		storedKillboardURL,
		storedFCName
	);

	const storedBroadcastMessage = extractBroadcastMesssage(
		storedPayloadStringified
	);

	const storedWarQuotes = randomWarQuote(storedPayloadStringified);

	const createDiscordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

	discordMessage(
		storedBroadcastMessage,
		storedFinalResult,
		storedExtractCommsURL,
		storedWarQuotes,
		createDiscordClient
	);

	console.log(`Debug Killboard URL: ${storedKillboardURL}`);
}
