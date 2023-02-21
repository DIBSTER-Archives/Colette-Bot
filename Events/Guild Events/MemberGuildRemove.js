const DISCORDJS = require('discord.js');
const CHALK = require('chalk');
const DISCORDJS_CLIENT = require("../../index.js");

DISCORDJS_CLIENT.on('guildMemberRemove', async (member) => {

    if(member.guild.id == ''){
        
        const LEAVE_CHANNEL = DISCORDJS_CLIENT.channels.cache.get('');
        const LEAVE_EMBED = new DISCORDJS.MessageEmbed()
        .setTitle(`User has left ${member.guild.name}.`)
        .setDescription(`${member.toString()} has just departed from **${member.guild.name}**.`)
        .setColor('#2f3136')
        .setThumbnail('')
        .setFooter('User Left:', '')
        .setTimestamp()
        LEAVE_CHANNEL.send({ embeds: [LEAVE_EMBED]});

        console.log(`${CHALK.yellowBright(member.user.tag)} just left ${CHALK.blueBright(member.guild.name)}`);
    }
})