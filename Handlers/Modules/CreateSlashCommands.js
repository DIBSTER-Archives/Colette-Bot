const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config(); //Requires dotenv.
const fs = require('fs');

const SLASH_COMMAND = [];
const DEV_GUILD_ID = '';
const DEV_CLIENT_ID = '';
const SLASH_COMMANDS_FOLDER = fs.readdirSync('./Slash_Commands');

for (const SLASH_COMMANDS_CATERGORIES of SLASH_COMMANDS_FOLDER){
    const SLASH_COMMAND_FILES = fs.readdirSync(`./Slash_Commands/${SLASH_COMMANDS_CATERGORIES}`).filter(Event => Event.endsWith('.js'));
    for (const SLASH_COMMAND_FILE of SLASH_COMMAND_FILES){
        const SLASH_COMMAND_FILE_DATA = require(`../../Slash_Commands/${SLASH_COMMANDS_CATERGORIES}/${SLASH_COMMAND_FILE}`);
        SLASH_COMMAND.push(SLASH_COMMAND_FILE_DATA.data);
    }
}

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN)
;(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(DEV_CLIENT_ID, DEV_GUILD_ID),
			{ body: SLASH_COMMAND },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();