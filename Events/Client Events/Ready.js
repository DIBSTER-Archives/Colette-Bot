const CHALK = require('chalk');
const fs = require('fs');
const DISCORDJS_CLIENT = require("../../index.js");

//MongooseDB Database Connection.
require('../../Handlers/Modules/Mongoose.js')


DISCORDJS_CLIENT.once('ready', async (DISCORDJS_CLIENT) => {
    DISCORDJS_CLIENT.user.setPresence({ activities: [{ name: "Discord.js V13" }], status: "online" });
    setTimeout(function(){
    console.log(`${CHALK.bold.black('| ')}${CHALK.bold.greenBright('Connected to ' + DISCORDJS_CLIENT.user.tag)}`);
    console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`)
    }, 500);
})
