require('dotenv').config();                                                     //Requires dotenv Package.
const Configuration = require('./configuration.json');                          //Requires the Configuration file.
const DISCORDJS = require('discord.js');                                        //Requires the discord.js Package.

const DISCORDJS_CLIENT = new DISCORDJS.Client(require('./Handlers/Client.js')); //Requires the Discord Client.
module.exports = DISCORDJS_CLIENT;                                              //Exporting The Discord Client.


DISCORDJS_CLIENT.login(Configuration.Tokens.Discord);                           //Logging into the Discord Bot.
require('./Handlers/index.js');                                                 //Requires the Handlers.

//node Handlers\Modules\CreateSlashCommands.js

