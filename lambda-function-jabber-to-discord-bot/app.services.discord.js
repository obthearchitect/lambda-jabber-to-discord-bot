/**
 * Instantiates the connection to Discord, takes all the data that's
 * been formated and send it as an embedded message
 */

module.exports.discordMessage = (
	discordMessageBroadcastMessage,
	discordMessageFinalResult,
	discordMessageMumbleURL,
	discordMessageWarQuote,
	discordClient
) => {
	let { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
	let fleetEmbed = new MessageEmbed()
		.setColor('#00FF00')
		.setAuthor(discordMessageBroadcastMessage)
		.setDescription(discordMessageFinalResult)
		.setThumbnail('https://i.redd.it/p6pkqvqa5w821.png')
		.setTimestamp()
		.setFooter('Fleet up and get those PAPs!');

	/**
	 * Let's switch this to a teneary after we fix formatting
	 */
	if (discordMessageMumbleURL != null) {
		let fleetButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL(discordMessageMumbleURL)
				.setLabel('Join Mumble Comms')
				.setStyle('LINK')
				.setDisabled(false)
		);

		discordClient.on('ready', (client) => {
			client.channels.cache
				.get(process.env.BOT_CHANNEL_ID)
				.send({
					content: `_${discordMessageWarQuote}_`,
					embeds: [fleetEmbed],
					components: [fleetButton],
				})
				.then(() => client.destroy())
				.catch(console.error);
		});
	} else {
		discordClient.on('ready', (client) => {
			client.channels.cache
				.get(process.env.BOT_CHANNEL_ID)
				.send({
					content: `_${discordMessageWarQuote}_`,
					embeds: [fleetEmbed],
				})
				.then(() => client.destroy())
				.catch(console.error);
		});
	}
	discordClient.login(process.env.BOT_TOKEN);
};
