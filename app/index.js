/**
 * Let's initialize all our required modules & libraries
 * TODO: Add a maintenance mode for the bot
 */

const zlib = require('zlib');
const { randomWarQuote } = require('./app.services');
const { discordMessage } = require('./app.services.discord.js');
const {
	extractBroadcastMesssage,
	extractCommsURL,
	generateKillboardURL,
	extractFCName,
} = require('./app.services.extractions');
const { formattingTasks } = require('./app.services.utilities');
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
	console.log(`Debug statement for storedPayload: ${storedPayloadStringified}`);
	const storedKillboardURL = generateKillboardURL(storedPayloadStringified);
	const storedFCName = extractFCName(storedPayloadStringified);
	const storedFinalResult = formattingTasks(
		storedPayloadStringified,
		storedKillboardURL,
		storedFCName
	);
	const storedExtractCommsURL = extractCommsURL(storedPayloadStringified);

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
}
