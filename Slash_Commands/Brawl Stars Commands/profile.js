const { SlashCommandBuilder } = require('@discordjs/builders');                             //Requires the @discordjs/builders package.
require('dotenv').config();                                                                 //Requires the dotenv package.
const PlayerTags = require('../../Handlers/DB-Models/PlayerTagModel');						//Requires the Player Tag Database.
const fs = require('fs');																	//Requires the fs package.
const { MessageActionRow } = require('discord.js');

const SLASH_COMMAND = new SlashCommandBuilder()
SLASH_COMMAND.setName('profile')
SLASH_COMMAND.setDescription('Check player stats for any Brawl Stars profile!')
SLASH_COMMAND.addUserOption((option) =>
option.setName('user')
.setDescription('Gets the stats of another player!')
.setRequired(false));
SLASH_COMMAND.addStringOption((option) =>
option.setName('tag')
.setDescription('Gets the stats of a player tag!')
.setRequired(false)
);

module.exports = {
data: SLASH_COMMAND.toJSON(),                                                                    

async execute(SLASH_COMMAND_INTERACTION, BRAWLSTARSJS_CLIENT, DISCORDJS_CLIENT, DISCORDJS, Configuration) {
try{

	if(!SLASH_COMMAND_INTERACTION.options._hoistedOptions[0]){
		const PlayerData = await PlayerTags.findOne({
			Discord_ID: SLASH_COMMAND_INTERACTION.user.id
		})
		if(!PlayerData){
			var CmdTag = null
		} else {
			var CmdTag = PlayerData.Player_Tag			
		}

		var User = await DISCORDJS_CLIENT.users.cache.get(`${SLASH_COMMAND_INTERACTION.user.id}`)
	} else if (SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name == 'user'){
		const PlayerData = await PlayerTags.findOne({
			Discord_ID: SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value
		})
		if(!PlayerData){
			var CmdTag = null
		} else {
			var CmdTag = PlayerData.Player_Tag			
		}

		var User = await DISCORDJS_CLIENT.users.cache.get(`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}`)
	} else {
		var CmdTag = SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value
		var User = null
	};

	if(CmdTag == null){
		if(User.id == SLASH_COMMAND_INTERACTION.user.id){
			Description = `${Configuration.Discord.ERROR_EMOTE} You haven't saved a player tag! Use the slash command \`\`/save\`\` to save a tag to Discord Account!`;
		} else {
			Description = `${Configuration.Discord.ERROR_EMOTE} **${User.tag}** doesn't have a player tag saved to his Discord Account!`;
		};

		const NoTagUserEmbed = new DISCORDJS.MessageEmbed()
			.setTitle('No Player Tag Found!')
			.setColor(Configuration.Discord.ERROR_COLOR)
			.setDescription(Description)
			.setTimestamp()
			.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
		await SLASH_COMMAND_INTERACTION.reply({embeds: [NoTagUserEmbed]})
	} else {

	const Player = await BRAWLSTARSJS_CLIENT.getPlayer(CmdTag)
	const Brawler_Stats = await BRAWLSTARSJS_CLIENT.getBrawlers();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CLUB INFORMATION

var Player_Club = "";

if(Player.club == null || Player.club.name == undefined || Player.club.tag == undefined){

    Player_Club = "No Club " + DISCORDJS_CLIENT.emojis.cache.find(e => e.name === 'LS_NoClub').toString();

} else {
	let Player_Club_JSON = await BRAWLSTARSJS_CLIENT.getClub(Player.club.tag) //GRABS THE RAW JSON FROM BRAWL STARS API
    Player_Club = "[" + Player.club.name + "](https://brawlify.com/stats/club/"  + Player.club.tag.replace("#","") + "#utm_source=ColetteBot-DIBSTER&utm_medium=profile&utm_campaign=ClubField)" + "\n" + "(\`" + Player.club.tag + "\`) " + DISCORDJS_CLIENT.emojis.cache.find(EMOJI => EMOJI.name === 'LS_' + Player_Club_JSON.badgeId).toString();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER INFO
function Brawlers_Find(b) {
	try{
		const b2 = b.name.replace(' ', '').replace('-','').replace('.', '')
		const EMOTE = DISCORDJS_CLIENT.emojis.cache.find(e => e.name == "LS_" + b2).toString()
		return(EMOTE)
		}catch(ERROR){
		return('<:black:771110520148197418>')
		} 
}

let Brawlers = "";
var Brawl_Count = 0;
Player.sortBrawlersByTrophies(`${Player.tag}`).reverse().forEach(b => {
	Brawl_Count++;
	if(Brawl_Count%8==0){
		if(b.power == 10)
			Brawlers += Brawlers_Find(b) + "`" + b.power + '`\n';
		else
			Brawlers += Brawlers_Find(b) + "`0" + b.power + '`\n';
	} else {
		if(b.power == 10)
			Brawlers += Brawlers_Find(b) + "`" + b.power + '`';
		else
			Brawlers += Brawlers_Find(b) + "`0" + b.power + '`';
	}
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Season Reset Information

var Reset_StarPoints = 0;
var Reset_Trophies = 0;

Player.brawlers.forEach(b => {
if (b.trophies <= 500) {
	Reset_StarPoints += 0;
	Reset_Trophies += b.trophies;
}					
else if (b.trophies >= 501 && b.trophies <= 524) {
	Reset_StarPoints += 20;
	Reset_Trophies += 500;
}
else if (b.trophies >= 525 && b.trophies <= 549) {
	Reset_StarPoints += 50;
	Reset_Trophies += 524;
}
else if (b.trophies >= 550 && b.trophies <= 574) {
	Reset_StarPoints += 70;
	Reset_Trophies += 549;
}
else if (b.trophies >= 575 && b.trophies <= 599) {
	Reset_StarPoints += 80;
	Reset_Trophies += 574;
}
else if (b.trophies >= 600 && b.trophies <= 624) {
	Reset_StarPoints += 90;
    Reset_Trophies += 599;
}
else if (b.trophies >= 625 && b.trophies <= 649) {
	Reset_StarPoints += 100;
    Reset_Trophies += 624;
}
else if (b.trophies >= 650 && b.trophies <= 674) {
	Reset_StarPoints += 110;
    Reset_Trophies += 649;
}
else if (b.trophies >= 675 && b.trophies <= 699) {
	Reset_StarPoints += 120;
    Reset_Trophies += 674;
}
else if (b.trophies >= 700 && b.trophies <= 724) {
	Reset_StarPoints += 130;
    Reset_Trophies += 699;
}
else if (b.trophies >= 725 && b.trophies <= 749) {
	Reset_StarPoints += 140;
    Reset_Trophies += 724;
}
else if (b.trophies >= 750 && b.trophies <= 774) {
	Reset_StarPoints += 150;
    Reset_Trophies += 749;
}
else if (b.trophies >= 775 && b.trophies <= 799) {
	Reset_StarPoints += 160;
    Reset_Trophies += 774;
}
else if (b.trophies >= 800 && b.trophies <= 824) {
	Reset_StarPoints += 170;
    Reset_Trophies += 799;
}
else if (b.trophies >= 825 && b.trophies <= 849) {
	Reset_StarPoints += 180;
    Reset_Trophies += 824;
}
else if (b.trophies >= 850 && b.trophies <= 874) {
	Reset_StarPoints += 190;
    Reset_Trophies += 849;
}
else if (b.trophies >= 875 && b.trophies <= 899) {
	Reset_StarPoints += 200;
	Reset_Trophies += 874;
}
else if (b.trophies >= 900 && b.trophies <= 924) {
	Reset_StarPoints += 210;
	Reset_Trophies += 885;
}
else if (b.trophies >= 925 && b.trophies <= 949) {
	Reset_StarPoints += 220;
	Reset_Trophies += 900;
}
else if (b.trophies >= 950 && b.trophies <= 974) {
	Reset_StarPoints += 230;
	Reset_Trophies += 920;
}
else if (b.trophies >= 975 && b.trophies <= 999) {
	Reset_StarPoints += 240;
	Reset_Trophies += 940;
}
else if (b.trophies >= 1000 && b.trophies <= 1049) {
	Reset_StarPoints += 250;
	Reset_Trophies += 960;
}
else if (b.trophies >= 1050 && b.trophies <= 1099) {
	Reset_StarPoints += 260;
	Reset_Trophies += 980;
}
else if (b.trophies >= 1100 && b.trophies <= 1149) {
	Reset_StarPoints += 270;
	Reset_Trophies += 1000;
}
else if (b.trophies >= 1150 && b.trophies <= 1199) {
	Reset_StarPoints += 280;
	Reset_Trophies += 1020;
}
else if (b.trophies >= 1200 && b.trophies <= 1249) {
	Reset_StarPoints += 290;
	Reset_Trophies += 1040;
}
else if (b.trophies >= 1250 && b.trophies <= 1299) {
	Reset_StarPoints += 300;
	Reset_Trophies += 1060;
}
else if (b.trophies >= 1300 && b.trophies <= 1349) {
	Reset_StarPoints += 310;
	Reset_Trophies += 1080;
}
else if (b.trophies >= 1350 && b.trophies <= 1399) {
	Reset_StarPoints += 320;
	Reset_Trophies += 1100;
}
else if (b.trophies >= 1400 && b.trophies <= 1449) {
	Reset_StarPoints += 330;
	Reset_Trophies += 1120;
}
else if (b.trophies >= 1450 && b.trophies <= 1499) {
	Reset_StarPoints += 340;
	Reset_Trophies += 1140;
}
else if (b.trophies > 1500 ) {
	Reset_StarPoints += 350;
	Reset_Trophies += 1150;
}})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//EXPERIENCE POINTS

if(!Player.expPoints)
Player.expPoints = 0;

let ExperiencePoints = Player.expPoints;
var ExperienceLevels = 0;
var Minus_Experience = 30;

while (ExperiencePoints >= 0){
    Minus_Experience += 10;
    ExperiencePoints -= Minus_Experience;
    ExperienceLevels += 1;
}
if(ExperiencePoints < 0){
    ExperiencePoints += Minus_Experience;
} else {
    ExperiencePoints = ExperiencePoints;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//QUALIFIED FOR CHAMPIONSHIP

let isQualifiedFromChampionshipChallenge = "";
if(Player.isQualifiedFromChampionshipChallenge == true)
    isQualifiedFromChampionshipChallenge = "True";
else if(Player.isQualifiedFromChampionshipChallenge == false)
    isQualifiedFromChampionshipChallenge = "False";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROBO RUMBLE

let bestRoboRumbleTime = "";
const lvl = Player.bestRoboRumbleTime;
if(lvl == 1)
    bestRoboRumbleTime = "Normal";
else if(lvl == 2)
    bestRoboRumbleTime = "Hard";
else if(lvl == 3)
    bestRoboRumbleTime = "Expert";
else if(lvl == 4)
	bestRoboRumbleTime = "Master";
else if(lvl == 5)
	bestRoboRumbleTime = "Insane";
else if(lvl == 6)
	bestRoboRumbleTime = "Insane II (2)";
else if(lvl == 7)
	bestRoboRumbleTime = "Insane III (3)";
else if(lvl == 8)
	bestRoboRumbleTime = "Insane IV (4)";
else if(lvl == 9)
	bestRoboRumbleTime = "Insane V (5)";
else if(lvl == 10)
	bestRoboRumbleTime = "Insane VI (6)";
else if(lvl == 11)
	bestRoboRumbleTime = "Insane VII (7)";
else if(lvl == 12)
	bestRoboRumbleTime = "Insane VIII (8)";
else if(lvl == 13)
	bestRoboRumbleTime = "Insane IX (9)";
else if(lvl == 14)
	bestRoboRumbleTime = "Insane X (10)";
else if(lvl == 15)
	bestRoboRumbleTime = "Insane XI (11)";
else if(lvl == 16)
	bestRoboRumbleTime = "Insane XII (12)";
else if(lvl == 17)
	bestRoboRumbleTime = "Insane XIII (13)";
else
	bestRoboRumbleTime = "None"
//////////////////////////////////////////////////////////////////////////////////////////////
//POWER 10 BRAWLERS

let Power10 = 0;
Player.brawlers.forEach(b => {
if (b.starPowers.length == 0) {
	Power10 += 0;
}
else if(b.starPowers.length == 1) {
	Power10 += 1;
}
else if(b.starPowers.length == 2) {
	Power10 += 1;
}})

//////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER TROPHY RANGES
var Current_Brawlers = Player.sortBrawlersByTrophies(`${Player.tag}`);
var Current_Lowest = Current_Brawlers[0].trophies;
var Current_Highest = Current_Brawlers[Current_Brawlers.length-1].trophies;

var overallHighest = Current_Brawlers[0].highestTrophies;
var overallLowest = Current_Brawlers[0].highestTrophies;

for(var i = 1; i < Current_Brawlers.length; i++)
{
	if(Current_Brawlers[i].highestTrophies >= overallHighest)
		overallHighest = Current_Brawlers[i].highestTrophies;

	if(Current_Brawlers[i].highestTrophies <= overallLowest)
		overallLowest = Current_Brawlers[i].highestTrophies;
}
//////////////////////////////////////////////////////////////////////////////////////////////
//POWER PLAY POINTS

if(!Player.highestPowerPlayPoints) 
    Player.highestPowerPlayPoints = 0
//////////////////////////////////////////////////////////////////////////////////////////////
//EMBEDS AND BUTTONS
const PlayerStatsRow = new DISCORDJS.MessageActionRow()
.addComponents(
	new DISCORDJS.MessageButton()
		.setEmoji('909272615506559076')
		.setLabel('More Advanced Statistics!')
		.setStyle('LINK')
		.setURL(`https://brawlify.com/stats/profile/${Player.tag.replace('#','')}#utm_source=ColetteBot-DIBSTER&utm_medium=profile&utm_campaign=Button`)
)

const playerEmbed = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.data.icon.id + '.png?v=1', 'https://www.brawlify.com/stats/profile/' + Player.tag.replace("#","") + "#utm_source=ColetteBot-DIBSTER&utm_medium=profile&utm_campaign=Author")
.setDescription(Brawlers)
.addFields(
{name: 'Trophies', value: Player.trophies.toLocaleString() + ' <:LS_Trophies:825844323341041746>', inline: true},
{name: 'Highest Trophies', value: Player.highestTrophies.toLocaleString() + ' <:LS_HighestTrophies:826549981376413766>', inline: true},
{name: 'Season Reset', value: Reset_Trophies.toLocaleString() + ' <:LS_ResetTrophies:826549981108371476> | ' + Reset_StarPoints.toLocaleString() + ' <:LS_StarPoints:826549981020160100>', inline: true},
{name: 'XP Level', value: Player.expLevel + ' (' + ExperiencePoints + '/' + Minus_Experience + ') <:LS_XP:826549981296459806>', inline: true},
{name: 'Club', value: Player_Club, inline: true},
{name: 'Qualified For Championship', value: isQualifiedFromChampionshipChallenge	+ ' <:LS_Championship:826549980914384968>', inline: true},
{name: '3v3 Victories', value: Player.trioVictories.toLocaleString() + ' <:LS_3v3:826549980726427697>', inline: true},
{name: 'Solo Victories', value: Player.soloVictories.toLocaleString() + ' <:LS_Solos:826549981200252988>', inline: true},
{name: 'Duo Victories', value: Player.duoVictories.toLocaleString() + ' <:LS_Duos:826549981158047804>', inline: true},
{name: 'Total Victories', value: Player.totalVictories.toLocaleString() + ' <:LS_TotalWins:826549981066166353>', inline: true},
{name: 'Best Robo Rumble Level', value: bestRoboRumbleTime + ' <:LS_RoboRumble:826549980777021470>', inline: true},
{name: 'Highest PowerPlay Points', value: Player.highestPowerPlayPoints.toLocaleString() + ' <:LS_PowerPlayPoints:874690834853941348>', inline: true},
{name: 'Brawlers Unlocked', value: Player.brawlerCount + '/' + Brawler_Stats.brawlerCount + ' <:LS_Unlock:857999593316155422>', inline: true},
{name: 'Star Powers Unlocked', value: Player.starPowerCount + '/' + Brawler_Stats.starPowersCount + ' <:LS_StarPowers:826549981208510474>', inline: true},
{name: 'Gadgets Unlocked', value: Player.gadgetCount + ' /' + Brawler_Stats.gadgetsCount + ' <:LS_Gadgets:826549981158309928>', inline: true},
{name: 'Power 10 Brawlers', value: Power10 + '/' + Brawler_Stats.brawlerCount  + ' <:LS_Power10:886404027489853441>', inline: true},
{name: 'Brawler Trophy Range', value: Current_Lowest.toLocaleString() + " <:LS_Arrow1:886313023881478155>" + Current_Highest.toLocaleString() + '\n (' + overallLowest.toLocaleString() + ' <:LS_Arrow2:886313075366580246>' + overallHighest.toLocaleString() + ')', inline: true},
{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount).toLocaleString() + ' (' + Math.round(Player.highestTrophies/Player.brawlerCount).toLocaleString() + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setTimestamp()
.setImage(`https://share.brawlify.com/player-graph/${Player.tag.replace('#', '')}?${new Date().getTime()}`)
.setFooter('Trophy Graphs by Brawlify.com', 'https://cdn.brawlify.com/front/Star.png');

await SLASH_COMMAND_INTERACTION.reply({embeds: [playerEmbed], components: [PlayerStatsRow]})
}
} catch(ERROR){
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
	.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
	.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
	.setTimestamp()
	.setFooter('Error at', `${process.env.LOGO}`)

const ERRORS = fs.readdirSync('./ERRORS')
const NewNumber = ERRORS.length + 1

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

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

} else if (ERROR.code == 404){
const USER_ERROR_Reason = "Player tag given is invalid, check the tag to make sure it is indeed a valid player tag.";
const ERROR_EMBED = new DISCORDJS.MessageEmbed()
.setColor(process.env.ERROR_COLOR)
.setTitle(`ERROR: Invalid Player Tag`)
.setDescription(`${process.env.ERROR_EMOTE} ${USER_ERROR_Reason}`)
.setTimestamp()
.setFooter(`Error at`, `${process.env.LOGO}`)

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
.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
.setTimestamp()
.setFooter('Error at', `${process.env.LOGO}`)

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

} else {
const ERRORS = fs.readdirSync('./ERRORS')
const NewNumber = ERRORS.length + 1

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
.addField('ERROR:', `\`\`\` ${ERROR} \`\`\``, false)
.addField('ERROR File', `\`\`\`ERROR_LOG_${NewNumber}.txt\`\`\``)
.setTimestamp()
.setFooter('Error at', `${process.env.LOGO}`)

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

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.
await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

	}                                                                           	//End of ERROR Handling if statements.
	}                                                                               //End of Catch.
	},                                                                              //End of Execute.
};                                                                                  //End of module.exports.    