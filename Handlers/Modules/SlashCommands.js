require('dotenv').config(); 															//Requires dotenv package & file.
const CHALK = require('chalk'); 														//Requires the chalk package.
const DISCORDJS = require('discord.js');												//Requires the Discord.js package.
const fs = require('fs');																//Requires the fs package.
const BRAWLSTARSJS = require('brawlstars.js');											//Requires the brawlstars.js package.
const mongoose = require('mongoose');                   								//Requires Mongoose Package.
const Configuration = require('../../configuration.json')								//Requires the configuration file.

const BRAWLSTARSJS_CLIENT = new BRAWLSTARSJS.Client(process.env.BRAWLSTARS_TOKEN);		//Creates a new brawlstars.js client.

const DISCORDJS_CLIENT = require('../../index.js');										//Requires the original Discord client.
DISCORDJS_CLIENT.commands = new DISCORDJS.Collection();									//Creates a new collection in the client.
const PlayerTags = require('../../Handlers/DB-Models/PlayerTagModel');					//Requires the Player Tag Database.

const SLASH_COMMANDS_FOLDER = fs.readdirSync('./Slash_Commands');

console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`);
console.log(CHALK.bold.gray('| (Slash Command Files)\n|'));


for (const SLASH_COMMANDS_CATERGORIES of SLASH_COMMANDS_FOLDER){
    console.log(`${CHALK.bold.gray('|')} ${CHALK.bold.rgb(97, 237, 95)(`${SLASH_COMMANDS_CATERGORIES}`)}`);
    const SLASH_COMMAND_FILES = fs.readdirSync(`./Slash_Commands/${SLASH_COMMANDS_CATERGORIES}`).filter(Event => Event.endsWith('.js'));
    for (const SLASH_COMMAND_FILE of SLASH_COMMAND_FILES){
        const SLASH_COMMAND_FILE_DATA = require(`../../Slash_Commands/${SLASH_COMMANDS_CATERGORIES}/${SLASH_COMMAND_FILE}`);
        DISCORDJS_CLIENT.commands.set(SLASH_COMMAND_FILE_DATA.data.name, SLASH_COMMAND_FILE_DATA);
        console.log(`${CHALK.bold.black('|')} ${CHALK.greenBright('Sucessfully')} ${CHALK.yellowBright(`loaded`)} ${CHALK.cyanBright(`/${SLASH_COMMAND_FILE_DATA.data.name}`)} ${CHALK.yellowBright(`into`)} ${CHALK.blueBright(SLASH_COMMAND_FILE.replace('.js', ''))}${CHALK.red('.js')} ${CHALK.bold.cyanBright('(Slash Commands)')}`);
    }
}
console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`)

DISCORDJS_CLIENT.on('interactionCreate', async SLASH_COMMAND_INTERACTION => {
	if (!SLASH_COMMAND_INTERACTION.isCommand()) return;
	const SLASH_COMMAND = DISCORDJS_CLIENT.commands.get(SLASH_COMMAND_INTERACTION.commandName);
	if (!SLASH_COMMAND) return;
	try {
		await SLASH_COMMAND.execute(SLASH_COMMAND_INTERACTION, BRAWLSTARSJS_CLIENT, DISCORDJS_CLIENT, DISCORDJS, Configuration);
	} catch (ERROR) {
		console.log(ERROR);
		DIBSTER_ERROR_Reason = "I encounted a unexpected error. Please check the console for the error. Please contact DIBSTER#9419 or DIBSTER#2317 if this error persists.";
		USER_ERROR_Reason = "Internal (Discord Bot) Error occurred. Please contact [DIBSTER#2317](https://discordapp.com/users/757296951925538856) or [DIBSTER#9419](https://discordapp.com/users/721509602205630475) regarding this issue this issue.";
		
		const ERROR_EMBED = new DISCORDJS.MessageEmbed()                                    //USER ERROR LOG.
			.setColor(process.env.ERROR_COLOR)
			.setTitle(`ERROR: Discord Bot Error`)
			.setDescription(`${process.env.ERROR_EMOTE} ${USER_ERROR_Reason}`)
			.setTimestamp()
			.setFooter(`Error at`, `${process.env.LOGO}`)
	
		const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
			.setColor(process.env.ERROR_COLOR)
			.setTitle(`ERROR: ${ERROR.code}`)
			.setDescription(`${process.env.ERROR_EMOTE} ${DIBSTER_ERROR_Reason}`)
			.addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
			.addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
			.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
			.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
			.addField('ERROR:', `\`\`\` ${ERROR} \`\`\``)
			.setTimestamp()
			.setFooter('Error at', `${process.env.LOGO}`)
			
		const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
		const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
		CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

		var getTimeString = function(input, separator) {
			var pad = function(input) {return input < 10 ? "0" + input : input;};
			var date = input ? new Date(input) : new Date();
			return [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), date.getMilliseconds()].join(typeof separator !== 'undefined' ?  separator : ':' );
		}
		let DATE = new Date().toISOString().slice(0, 10)
		
		const DIVIDER_LINE = `------------------------------------------------------------------------------------------------------------------`;
		const CRASH_LOG = "ERROR Below: \n" + DIVIDER_LINE + "\n" + ERROR + " \n" + DIVIDER_LINE + " \nERROR CODE: " + ERROR.code + "\n" + DIVIDER_LINE + " \nERROR Reason: \n" + DIBSTER_ERROR_Reason + "\n" + DIVIDER_LINE + "\nTime of ERROR: " + DATE + " | "  + getTimeString("", ":") + "\n" + DIVIDER_LINE;
		
		fs.writeFile('./ERRORS/ERROR_LOG_' + NewNumber + '.txt', CRASH_LOG, err => {
		})
		
		await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.		
	}
});
