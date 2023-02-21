const fs = require('fs');
const CHALK = require('chalk');
const DB_Models = fs.readdirSync('./Handlers/DB-Models');


console.log(CHALK.bold.gray('| (Database Models)\n|'));

for (const Models of DB_Models){
        const Model = require(`../DB-Models/${Models}`);
        console.log(`${CHALK.bold.black('|')} ${CHALK.greenBright('Sucessfully')} ${CHALK.yellowBright(`loaded`)} ${CHALK.cyanBright(`${Models.replace('.js','')}`)} ${CHALK.yellowBright(`into`)} ${CHALK.bold.cyanBright('(Database Models)')}`);
}
console.log(`${CHALK.bold.black('------------------------------------------------------------------------------------------------------')}`)