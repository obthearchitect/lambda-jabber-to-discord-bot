/** 
 * We initialize the core libraries outside of the handler 
 * to improve performance and resuse the /tmp cache
 * ! TODO: Add a maintenance mode for the bot
 */

// eslint-disable-next-line no-undef
const zlib = require("zlib");

// eslint-disable-next-line no-undef
const Discord = require("discord.js");

/** 
 * This section is responsible for processing the Cloudwatch
 * Logs that the Lambda function is subscribed to  
 */

// eslint-disable-next-line no-undef
exports.handler = function (input, context, callback) {
    // eslint-disable-next-line no-undef
    let cwlogs_payload = new Buffer.from(input.awslogs.data, "base64");

    zlib.gunzip(cwlogs_payload, function (e, result) {
        if (e) {
            context.fail(e);
            return callback(console.log("Lambda did not complete successfully"));
        } else {
            result = JSON.parse(result.toString("utf-8"));
            return callback(
                gsfFleetAlerts(result) + console.log("Lambda ran successfully")
            );
        }
    });
};

/**
 * I put all the Logic for the Discord bot inside of this one 
 * function! I know it's not the best method, but I first wanted to 
 * write up the bot and then worry about optimizing after
 */

function gsfFleetAlerts(result) {
    const payload = result;
    const jsonStringify = JSON.stringify(payload.logEvents[0].message);
    console.log(`Debug and see the original payload ${jsonStringify}`);

    /**
     * I'm extracting a character name from the initial payload 
     * to be processed and appended to the final output that is
     * sent to Discord 
     */

    let flightCommander = JSON.stringify(jsonStringify);
    let zkillboard_URL = "https://zkillboard.com/character/";

    const regex_flightCommanderName =
        /^.*(FC Name:)(.*)(\\\\nFormup Location:).*/gis;
    const subst_flightCommanderName = `$2`;

    let result_flightCommanderName = flightCommander.replace(
        regex_flightCommanderName,
        subst_flightCommanderName
    );

    const regex_zkillboard_URL = /\s/gim;
    const subst_zkillboard_URL = `%20`;

    result_flightCommanderName = result_flightCommanderName.split(" ");
    result_flightCommanderName = result_flightCommanderName.splice(1);
    result_flightCommanderName = result_flightCommanderName.join(" ");
    const fcName = result_flightCommanderName;
    console.log(fcName);

    let final_zkillboard_URL = zkillboard_URL + result_flightCommanderName;
    final_zkillboard_URL = final_zkillboard_URL.replace(
        regex_zkillboard_URL,
        subst_zkillboard_URL
    );

    /**
     * The majority of this section contains regex expressions
     * which I use to breakup and format the final string object
     * that will be passed to Discord
     */

    // Remove incorrectly formated line breaks
    const regex_removeLineBreaks = /\\n|\r/gim;
    const subst_removeLineBreaks = `\n`;
    let result_linkebreaks = jsonStringify.replace(
        regex_removeLineBreaks,
        subst_removeLineBreaks
    );

    // Remove tildes which cause strikeouts
    const regex_removeTildes = /(~~~ |~~~| ~~~|~~ |~~)/gim;
    const subst_removeTildes = ``;
    let result_tildes = result_linkebreaks.replace(
        regex_removeTildes,
        subst_removeTildes
    );

    // Remove the conversation from intro
    const regex_removeConversation = /(conversation).*/gim;
    const subst_removeConversation = ``;
    let result_removeCoversation = result_tildes.replace(
        regex_removeConversation,
        subst_removeConversation
    );

    // Remove the timestamp
    const regex_removeTimestamp =
        /([(][0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (?:A|P)\.?M[)]\.? directorbot: )/gm;
    const subst_removeTimestamp = ``;
    let result_removeTimestamp = result_removeCoversation.replace(
        regex_removeTimestamp,
        subst_removeTimestamp
    );

    // Remove the quotes from Stringify
    const regex_removeQuotes = /(")/gm;
    const subst_removeQuotes = ``;
    let result_removeQuotes = result_removeTimestamp.replace(
        regex_removeQuotes,
        subst_removeQuotes
    );

    let final_result = result_removeQuotes;

    // Insert Line Break for FC
    const regex_fcBreak = /(FC Name:)/gms;
    const subst_fcBreak = `\n**FC Name:** [FC's Killboard](${final_zkillboard_URL})`;
    final_result = final_result.replace(regex_fcBreak, subst_fcBreak);

    // Remove comms since we have a mumble button
    const regex_removeComms = /(Comms:)(.*$\n)/gim;
    const subst_removeComms = ``;
    final_result = final_result.replace(regex_removeComms, subst_removeComms);

    // Remove broadcast message since we moved it up
    const regex_removeBroadcast = /(This was a).*/gim;
    const subst_removeBroadcast = ``;
    final_result = final_result.replace(
        regex_removeBroadcast,
        subst_removeBroadcast
    );

    // Let's format the payload
    const regex_finalResultFormatting =
        /(Formup Location:)|(Pap Type:)|(Doctrine:)/gim;
    const subst_finalresultFormatting = `**$1$2$3**`;
    final_result = final_result.replace(
        regex_finalResultFormatting,
        subst_finalresultFormatting
    );

    // Format the message
    const regex_formatMessage = /(^)(.*\S)(.*$\s)/m;
    const subst_formatMessage = `_$2_`;
    final_result = final_result.replace(regex_formatMessage, subst_formatMessage);

    // Show me the final output that's going to be sent to discord
    console.log(
        "Heres the final output before extract url: " +
        JSON.stringify(final_result, null, 2)
    );

    // indexOf is case sensitive, so I'll convert the url first
    let transformURL = JSON.stringify(payload);
    const regex_transformURL = /comms/gim;
    const subst_transformURL = `comms`;
    const result_transformURL = transformURL.replace(
        regex_transformURL,
        subst_transformURL
    );

    /**
     * I'm extracting a more data from the initial payload 
     * to be processed and appended to the final output
     * passed to Discord 
     * TODO: I need to move these two pieces up to the extraction section
     */

    // Moving broadcast message to the top
    let broadcastFrom = JSON.stringify(jsonStringify);

    const regex_broadcastFrom = /(This was a\s.*)/gm;
    let results_broadcastFrom = [];
    results_broadcastFrom = broadcastFrom.match(regex_broadcastFrom);

    if (results_broadcastFrom !== null) {
        results_broadcastFrom = JSON.stringify(results_broadcastFrom[0]);
        results_broadcastFrom = results_broadcastFrom.replace(/(['""\\])/gim, "");
        results_broadcastFrom = results_broadcastFrom.replace(/(~~~)/gim, "");
    } else {
        results_broadcastFrom = "Broadcast Message from Directorbot";
    }

    // Comms Extraction
    if (result_transformURL.indexOf("comms") > -1) {
        const regex_extractURL = /(^.*(?<=OP\s[0-9]{1,4}\s))|(\\nDoctrine.*$)/gim;
        const subst_extractURL = ``;
        transformURL = transformURL.replace(regex_extractURL, subst_extractURL);
        transformURL = transformURL.split('"')[0].trim();
    } else {
        transformURL = null;
        console.log(
            "There was no comms link, therefore there is no URL to extract"
        );
    }

    // Store the final result for transform URL
    const mumbleURL = transformURL;

    /**
     * Inspiration quotes that I use to pump up the team!
     */

    const war_quotes = [
        "War is what happens when language fails.",
        "Appear weak when you are strong, and strong when you are weak.",
        "Only the dead have seen the end of war.",
        "If you win, you need not have to explain...If you lose, you should not be there to explain!",
        "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.",
        "In the midst of chaos, there is also opportunity",
        "When the enemy is relaxed, make them toil. When full, starve them. When settled, make them move.",
        "He who is prudent and lies in wait for an enemy who is not, will be victorious.",
        "Great results, can be achieved with small forces.",
        "Know your enemy and know yourself and you can fight a hundred battles without disaster",
    ];

    const random_warQuote =
        war_quotes[Math.floor(Math.random() * war_quotes.length)];

    /**
     * This is the main event! This is where we take all the data that's been
     * extracted and transformed and send it to discord
     */
    const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

    // eslint-disable-next-line no-undef
    const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

    console.log(
        `Debugging final output for: Mumble URL ${mumbleURL}\nand ${results_broadcastFrom}\nand final result ${final_result}`
    );

    const fleetEmbed = new MessageEmbed()
        .setColor("#00FF00")
        .setAuthor(results_broadcastFrom)
        .setDescription(final_result)
        .setThumbnail("https://i.redd.it/p6pkqvqa5w821.png")
        .setTimestamp()
        .setFooter("Fleet up and get those PAPs!");

    if (mumbleURL != null) {
        const fleetButton = new MessageActionRow().addComponents(
            new MessageButton()
                .setURL(mumbleURL)
                .setLabel("Join Mumble Comms")
                .setStyle("LINK")
                .setDisabled(false)
        );

        client.on("ready", (client) => {
            // eslint-disable-next-line no-undef
            client.channels.cache.get(process.env.BOT_CHANNEL_ID).send({
                content: `_${random_warQuote}_`,
                embeds: [fleetEmbed],
                components: [fleetButton],
            });

        })
    }
    else (
        client.on("ready", (client) => {
            // eslint-disable-next-line no-undef
            client.channels.cache.get(process.env.BOT_CHANNEL_ID).send({
                content: `_${random_warQuote}_`,
                embeds: [fleetEmbed]
            });
        })
    );
    // eslint-disable-next-line no-undef
    client.login(process.env.BOT_TOKEN);

    /**
     * TODO: client.destroy method on Discord connection!
     * ! Running into an issue where the client connection is being 
     * ! terminated prematurely before the payload is sent. Probably 
     * ! need to consider using a promise
     */
    // client.on("ready", (client) => {
    //     client.destroy(console.log("Terminated the connection"))
    // })
}