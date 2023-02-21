const CHALK = require('chalk'); 
const DISCORDJS = require('discord.js');
const fs = require('fs');

const EVENT_FOLDER = fs.readdirSync('./Events');
console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`)
console.log(CHALK.bold.gray('| (Event Files)\n|'))

for (const EVENT_FOLDER_CATERGORIES of EVENT_FOLDER){

    console.log(`${CHALK.bold.gray('|')} ${CHALK.bold.rgb(97, 237, 95)(`${EVENT_FOLDER_CATERGORIES}`)}`)

    const EVENT_FILES = fs.readdirSync(`./Events/${EVENT_FOLDER_CATERGORIES}`).filter(Event => Event.endsWith('.js'));
    for (const EVENT_FILE of EVENT_FILES){
        require(`../../Events/${EVENT_FOLDER_CATERGORIES}/${EVENT_FILE}`)
        console.log(`${CHALK.bold.black('|')} ${CHALK.greenBright('Sucessfully')} ${CHALK.yellowBright('loaded into')} ${CHALK.blueBright(EVENT_FILE.replace('.js', ''))}${CHALK.red('.js')} ${CHALK.bold.cyanBright('(Events)')}`)
    }
}