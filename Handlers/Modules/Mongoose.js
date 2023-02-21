const CHALK = require('chalk');                         //Requires chlak Package.
require('dotenv').config();                             //Requires dotenv Package.
const mongoose = require('mongoose');                   //Requires Mongoose Package.

mongoose.connect(process.env.MONGOOSEDB_CONNECTION_URL).then(() => {
    console.log(CHALK.bold.gray('| (Mongoose Database Connection)\n|'))
    console.log(`${CHALK.bold.black('|')} ${CHALK.greenBright('Sucessfully')} ${CHALK.yellowBright('connected to')} ${CHALK.blueBright('Mongoose')}${CHALK.red('.js')} ${CHALK.bold.cyanBright('(Database)')}`)
    console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`)
    require('./Models.js')
}).catch(console.error);


