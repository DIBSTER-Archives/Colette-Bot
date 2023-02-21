const { SlashCommandBuilder } = require('@discordjs/builders');                             //Requires the @discordjs/builders Package.
require('dotenv').config();                                                                 //Requires dotenv Package.
const PlayerTags = require('../../Handlers/DB-Models/PlayerTagModel');						//Requires the Player Tag Database.

const SLASH_COMMAND = new SlashCommandBuilder()
SLASH_COMMAND.setName('save')
SLASH_COMMAND.setDescription('Saves a player tag to your Discord account!')
SLASH_COMMAND.addStringOption((option) =>
option.setName('tag')
.setDescription('Your Brawl Stars Player Tag!')
.setRequired(true)
);



module.exports = {
data: SLASH_COMMAND.toJSON(),                                                                    

async execute(SLASH_COMMAND_INTERACTION, BRAWLSTARSJS_CLIENT, DISCORDJS_CLIENT, DISCORDJS) {
    try{
        const BS_PLAYER = await BRAWLSTARSJS_CLIENT.getPlayer(SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value); //Getting the Player Tag via the option value from Slash command interaction.

    const PlayerData = await PlayerTags.findOne({
        Discord_ID: SLASH_COMMAND_INTERACTION.user.id
    })
    
    const d = new Date();
    const seconds = Math.round(d.getTime() / 1000);

    if(!PlayerData){
    const NewPlayer = await new PlayerTags({
        Discord_ID: SLASH_COMMAND_INTERACTION.user.id,
        Player_Tag: BS_PLAYER.tag,
        TimeSaved: seconds
    }) 
    NewPlayer.save()
    } else {
    
    const UpdatePlayer = await PlayerTags.findByIdAndUpdate(PlayerData.id, 
        {Player_Tag: BS_PLAYER.tag},
        {TimeSaved: seconds
        })
    UpdatePlayer.save()
    
    }

        if(BS_PLAYER.club == null){
            var BS_PLAYER_CLUB = "<:LS_NoClub:881210894275706932> No Club";
        } else {
            const CLUB_JSON = await BRAWLSTARSJS_CLIENT.getClub(BS_PLAYER.club.tag);
            var BS_PLAYER_CLUB = DISCORDJS_CLIENT.emojis.cache.find(EMOJI => EMOJI.name === 'LS_' + CLUB_JSON.badgeId).toString() + ` [${BS_PLAYER.club.name}](https://brawlify.com/stats/club/${BS_PLAYER.club.tag.replace('#', '')}) - (\`\`${BS_PLAYER.club.tag}\`\`)`
        }
        
        const SAVE_EMBED = new DISCORDJS.MessageEmbed()
            .setColor(BS_PLAYER.hexColor)
            .setAuthor('Tag Saved', `https://cdn.discordapp.com/emojis/796020496080699393.png`, `https://brawlify.com/stats/profile/${BS_PLAYER.tag.replace('#', '')}`)
            .setThumbnail(`https://cdn.brawlify.com/profile/${BS_PLAYER.icon}.png`)
            .setDescription(`${SLASH_COMMAND_INTERACTION.user.toString()} **has been identified as the following:**`)
            .addField('In Game Username:', DISCORDJS_CLIENT.emojis.cache.find(EMOJI => EMOJI.name === 'LS_' + BS_PLAYER.icon).toString() + ` [${BS_PLAYER.name}](https://brawlify.com/stats/profile/${BS_PLAYER.tag.replace('#', '')}) - (\`\`${BS_PLAYER.tag}\`\`)`, false)
            .addField('Club:', BS_PLAYER_CLUB, false)
            .addField('Trophies:', `<:LS_Trophies:825844323341041746> ${BS_PLAYER.trophies.toLocaleString()}`, false)

        await SLASH_COMMAND_INTERACTION.reply({ embeds: [SAVE_EMBED] });

    }catch(ERROR){
            
	        if(ERROR.code != 400 & 403 & 429 & 500){
                        if    (ERROR.code == 400) {
                        let = DIBSTER_ERROR_Reason = "Client provided incorrect parameters for the request.";
                    } else if (ERROR.code == 403) {
                        let = DIBSTER_ERROR_Reason = "Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.";
                    } else if (ERROR.code == 429) {
                        let = DIBSTER_ERROR_Reason = "Request was throttled, because amount of requests was above the threshold defined for the used API token.";
                    } else if (ERROR.code == 500) {
                        let = DIBSTER_ERROR_Reason = "Unknown error happened when handling the request.";
                    }

                var USER_ERROR_Reason = "Internal (Discord Bot) Error occurred. Please contact [DIBSTER#2317](https://discordapp.com/users/757296951925538856) or [DIBSTER#9419](https://discordapp.com/users/721509602205630475) regarding this issue this issue.";

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
                    .addField('Slash Command Property:', `${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name} | ${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].type}`, false)
                    .addField('Slash Command Property Value:', `\`\`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}\`\``, false)
                    .addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
                    .addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
                    .setTimestamp()
                    .setFooter('Error at', `${process.env.LOGO}`)
    
                const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
                const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
                CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

                await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

    } else if (ERROR.code == 404){
    const DIBSTER_ERROR_Reason = "Resource was not found.";
    const USER_ERROR_Reason = "Player tag given is invalid, check the tag to make sure it is indeed a valid player tag.";
    const ERROR_EMBED = new DISCORDJS.MessageEmbed()
        .setColor(process.env.ERROR_COLOR)
        .setTitle(`ERROR: Invalid Player Tag`)
        .setDescription(`${process.env.ERROR_EMOTE} ${USER_ERROR_Reason}`)
        .setTimestamp()
        .setFooter(`Error at`, `${process.env.LOGO}`)
    
    const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
        .setColor(process.env.ERROR_COLOR)
        .setTitle(`ERROR: ${ERROR.code}`)
        .setDescription(`${process.env.ERROR_EMOTE}  ${DIBSTER_ERROR_Reason}`)
        .addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
        .addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
        .addField('Slash Command Property:', `${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name} | ${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].type}`, false)
        .addField('Slash Command Property Value:', `\`\`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}\`\``, false)
        .addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
        .addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
        .setTimestamp()
        .setFooter('Error at', `${process.env.LOGO}`)
            
    const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
    const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
    CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

    await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

                }else if(ERROR.code == 503){
    DIBSTER_ERROR_Reason = "Service is temprorarily unavailable because of maintenance.";
    USER_ERROR_Reason = "Service is temprorarily unavailable because of maintenance. Brawl Stars is currently in maintainence, therefore, no data from the API is available as of now.";

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
        .addField('Slash Command Property:', `${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name} | ${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].type}`, false)
        .addField('Slash Command Property Value:', `\`\`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}\`\``, false)
        .addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
        .addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
        .setTimestamp()
        .setFooter('Error at', `${process.env.LOGO}`)
            
    const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
    const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
    CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

    await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

        } else {
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
        .addField('Slash Command Property:', `${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name} | ${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].type}`, false)
        .addField('Slash Command Property Value:', `\`\`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}\`\``, false)
        .addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
        .addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
        .addField('ERROR:', `\`\`\` ${ERROR} \`\`\``)
        .setTimestamp()
        .setFooter('Error at', `${process.env.LOGO}`)
        
    const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
    const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
    CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

    await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

            }                                                                           //End of ERROR Handling if statements.
        }                                                                               //End of Catch.
	},                                                                                  //End of Execute.
};                                                                                      //End of module.exports.    
