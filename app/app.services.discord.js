const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports.discordMessage = (
	discordMessageBroadcastMessage,
	discordMessageFinalResult,
	discordMessageMumbleURL,
	discordMessageWarQuote
) => {
	const fleetEmbed = new MessageEmbed()
		.setColor('#00FF00')
		.setAuthor(discordMessageBroadcastMessage)
		.setDescription(discordMessageFinalResult)
		.setThumbnail('https://i.redd.it/p6pkqvqa5w821.png')
		.setTimestamp()
		.setFooter('Fleet up and get those PAPs!');

	if (discordMessageMumbleURL != null) {
		const fleetButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL(discordMessageMumbleURL)
				.setLabel('Join Mumble Comms')
				.setStyle('LINK')
				.setDisabled(false)
		);

		client.on('ready', (client) => {
			client.channels.cache
				.get(process.env.BOT_CHANNEL_ID)
				.send({
					content: `_${discordMessageWarQuote}_`,
					embeds: [fleetEmbed],
					components: [fleetButton],
				})
				.then(setTimeout(() => client.destroy(), 200))
				.catch(console.error);
		});
	} else {
		client.on('ready', (client) => {
			client.channels.cache
				.get(process.env.BOT_CHANNEL_ID)
				.send({
					content: `_${discordMessageWarQuote}_`,
					embeds: [fleetEmbed],
				})
				.then(setTimeout(() => client.destroy(), 200))
				.catch(console.error);
		});
	}
};
client.login(process.env.BOT_TOKEN);
