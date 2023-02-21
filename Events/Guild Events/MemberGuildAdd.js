const DISCORDJS = require('discord.js');
const CHALK = require('chalk');
const DISCORDJS_CLIENT = require("../../index.js");

DISCORDJS_CLIENT.on('guildMemberAdd', async (member) => {

    if(member.guild.id == ''){

        const JOIN_CHANNEL = DISCORDJS_CLIENT.channels.cache.get('');
        const JOIN_EMBED = new DISCORDJS.MessageEmbed()
        .setTitle(`New user has just joined ${member.guild.name}!`)
        .setDescription(`Welcome ${member.toString()} to **${member.guild.name}**. This is a Development server. \n\n Please **verify** in <#>.\n **Joined at:** <t:${Math.floor(member.joinedTimestamp/1000)}:F> `)
        .setColor('#2f3136')
        .setThumbnail('')
        .setFooter('User Joined:', '')
        .setTimestamp()
        JOIN_CHANNEL.send({ embeds: [JOIN_EMBED]});
    
        console.log(`${CHALK.yellowBright(member.user.tag)} just joined ${CHALK.blueBright(member.guild.name)}`)
    }
})