const { SlashCommandBuilder } = require('@discordjs/builders');                             //Requires the @discordjs/builders Package.
require('dotenv').config();                                                                 //Requires dotenv Package.
const PlayerTags = require('../../Handlers/DB-Models/PlayerTagModel');						//Requires the Player Tag Database.
const fs = require('fs')																	//Requires the fs package.
const { pagination } = require('reconlx');													//Requires the reconlx package.
const { Interaction } = require('discord.js');

const SLASH_COMMAND = new SlashCommandBuilder()
SLASH_COMMAND.setName('brawlers')
SLASH_COMMAND.setDescription('Check your Brawler Stats!')
SLASH_COMMAND.addUserOption((option) =>
option.setName('user')
.setDescription('Gets the brawlers of another player!')
.setRequired(false));
SLASH_COMMAND.addStringOption((option) =>
option.setName('tag')
.setDescription('Gets the brawlers of a player tag!')
.setRequired(false)
);

module.exports = {
data: SLASH_COMMAND.toJSON(),                                                                    

async execute(SLASH_COMMAND_INTERACTION, BRAWLSTARSJS_CLIENT, DISCORDJS_CLIENT, DISCORDJS) {
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
const Player = await BRAWLSTARSJS_CLIENT.getPlayer(CmdTag);

const Player_Brawlers_JSON = Player.sortBrawlersByTrophies(CmdTag).reverse();

const Brawlers = await BRAWLSTARSJS_CLIENT.getBrawlers()
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER TROPHIES
function Trophies(i){
	let Trophies = "   0";
	if(Player_Brawlers_JSON[i].trophies < 10)
		Trophies = "   " + Player_Brawlers_JSON[i].trophies;
	else if(Player_Brawlers_JSON[i].trophies < 100)
		Trophies = "  " + Player_Brawlers_JSON[i].trophies;
	else if(Player_Brawlers_JSON[i].trophies < 1000) 
		Trophies = " " + Player_Brawlers_JSON[i].trophies;
	else
		Trophies = "" + Player_Brawlers_JSON[i].trophies;
	return Trophies;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function HighestTrophies(i){
	let HighestTrophies = "   0";
	if(Player_Brawlers_JSON[i].highestTrophies < 10)
		HighestTrophies = "   " + Player_Brawlers_JSON[i].highestTrophies;
	else if(Player_Brawlers_JSON[i].highestTrophies < 100)
		HighestTrophies = "  " + Player_Brawlers_JSON[i].highestTrophies;
	else if(Player_Brawlers_JSON[i].highestTrophies < 1000) 
		HighestTrophies = " " + Player_Brawlers_JSON[i].highestTrophies;
	else
		HighestTrophies = "" + Player_Brawlers_JSON[i].highestTrophies;
	return HighestTrophies;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function POWER_LEVEL(i){
	BRAWLER_INFO = Player_Brawlers_JSON[i];
	let BRAWLER_POWER_LEVEL = "";
	if(BRAWLER_INFO.power == 1)
		BRAWLER_POWER_LEVEL = "<:LS_Power1:886403463737671740>"
	else if(BRAWLER_INFO.power == 2)
		BRAWLER_POWER_LEVEL = "<:LS_Power2:886403543509110854>"
	else if(BRAWLER_INFO.power == 3)
		BRAWLER_POWER_LEVEL = "<:LS_Power3:886403604674654218>"
	else if(BRAWLER_INFO.power == 4)
		BRAWLER_POWER_LEVEL = "<:LS_Power4:886403665768894475>"
	else if(BRAWLER_INFO.power == 5)
		BRAWLER_POWER_LEVEL = "<:LS_Power5:886403763261300736>"
	else if(BRAWLER_INFO.power == 6)
		BRAWLER_POWER_LEVEL = "<:LS_Power6:886403805065920574>"
	else if(BRAWLER_INFO.power == 7)
		BRAWLER_POWER_LEVEL = "<:LS_Power7:886403860497846312>"
	else if(BRAWLER_INFO.power == 8)
		BRAWLER_POWER_LEVEL = "<:LS_Power8:886403911957766165>"
	else if(BRAWLER_INFO.power == 9)
		BRAWLER_POWER_LEVEL = "<:LS_Power9:886403962411040788>"
	else if(BRAWLER_INFO.power == 10)
		BRAWLER_POWER_LEVEL = "<:LS_Power10:886404027489853441>"
	return BRAWLER_POWER_LEVEL;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function STARPOINTS(i) {
	b = Player_Brawlers_JSON[i];
	var x = "   0";
	if (b.trophies <= 500) 
		x = "   0";
	else if (b.trophies >= 501 && b.trophies <= 524) 
		x = "  20";
	else if (b.trophies >= 525 && b.trophies <= 549)
		x = "  50";
	else if (b.trophies >= 550 && b.trophies <= 574)
		x = "  70";
	else if (b.trophies >= 575 && b.trophies <= 599)
		x = "  80";
	else if (b.trophies >= 600 && b.trophies <= 624) 
		x = "  90";
	else if (b.trophies >= 625 && b.trophies <= 649)
		x = " 100";
	else if (b.trophies >= 650 && b.trophies <= 674) 
		x = " 110";
	else if (b.trophies >= 675 && b.trophies <= 699) 
		x = " 120";
	else if (b.trophies >= 700 && b.trophies <= 724) 
		x = " 130";
	else if (b.trophies >= 725 && b.trophies <= 749) 
		x = " 140";
	else if (b.trophies >= 750 && b.trophies <= 774)
		x = " 150";
	else if (b.trophies >= 775 && b.trophies <= 799) 
		x = " 160";
	else if (b.trophies >= 800 && b.trophies <= 824)
		x = " 170";
	else if (b.trophies >= 825 && b.trophies <= 849)
		x = " 180";
	else if (b.trophies >= 850 && b.trophies <= 874)
		x = " 190";
	else if (b.trophies >= 875 && b.trophies <= 899)
		x = " 200";
	else if (b.trophies >= 900 && b.trophies <= 924) 
		x = " 210";
	else if (b.trophies >= 925 && b.trophies <= 949)
		x = " 220";
	else if (b.trophies >= 950 && b.trophies <= 974)
		x = " 230";
	else if (b.trophies >= 975 && b.trophies <= 999)
		x = " 240";
	else if (b.trophies >= 1000 && b.trophies <= 1049) 
		x = " 250";
	else if (b.trophies >= 1050 && b.trophies <= 1099) 	
		x = " 260";
	else if (b.trophies >= 1100 && b.trophies <= 1149)
		x = " 270";
	else if (b.trophies >= 1150 && b.trophies <= 1199) 
		x = " 280";
	else if (b.trophies >= 1200 && b.trophies <= 1249)
		x = " 290";
	else if (b.trophies >= 1250 && b.trophies <= 1299)
		x = " 300";
	else if (b.trophies >= 1300 && b.trophies <= 1349)
		x += " 310";
	else if (b.trophies >= 1350 && b.trophies <= 1399)
		x = " 320";
	else if (b.trophies >= 1400 && b.trophies <= 1449)
		x = " 330";
	else if (b.trophies >= 1450 && b.trophies <= 1499)
		x += " 340";
	else if (b.trophies > 1500 )
		x = " 350";
	return x;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER PINS

function BRAWLER_PINS(i) {
    return DISCORDJS_CLIENT.emojis.cache.find(e => e.name === "LS_" + Player_Brawlers_JSON[i].name.replace(' ','').replace('.','').replace('-','')).toString()
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER RANKS

function BRAWLER_RANKS(i) {
    return DISCORDJS_CLIENT.emojis.cache.find(e => e.name === "LS_Rank_" + Player_Brawlers_JSON[i].rank).toString()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER RESET

function reset(i) {
	BRAWLER_INFO = Player_Brawlers_JSON[i];
	var BRAWLER_RESET = "   0";
	if (BRAWLER_INFO.trophies <= 500)
		if(BRAWLER_INFO.trophies < 10) {
			BRAWLER_RESET = "   " + BRAWLER_INFO.trophies;
		} else if(BRAWLER_INFO.trophies < 100) {
			BRAWLER_RESET = "  " + BRAWLER_INFO.trophies;
		} else if(BRAWLER_INFO.trophies < 1000) {
			BRAWLER_RESET = " " + BRAWLER_INFO.trophies;
		} else {
			BRAWLER_RESET = "" + BRAWLER_INFO.trophies;
		}
	else if (BRAWLER_INFO.trophies >= 501 && BRAWLER_INFO.trophies <= 524) 
		BRAWLER_RESET = " 500";
	else if (BRAWLER_INFO.trophies >= 525 && BRAWLER_INFO.trophies <= 549)
		BRAWLER_RESET = " 524";
	else if (BRAWLER_INFO.trophies >= 550 && BRAWLER_INFO.trophies <= 574)
		BRAWLER_RESET = " 549";
	else if (BRAWLER_INFO.trophies >= 575 && BRAWLER_INFO.trophies <= 599)
		BRAWLER_RESET = " 574";
	else if (BRAWLER_INFO.trophies >= 600 && BRAWLER_INFO.trophies <= 624) 
		BRAWLER_RESET = " 699";
	else if (BRAWLER_INFO.trophies >= 625 && BRAWLER_INFO.trophies <= 649)
		BRAWLER_RESET = " 624";
	else if (BRAWLER_INFO.trophies >= 650 && BRAWLER_INFO.trophies <= 674) 
		BRAWLER_RESET = " 649";
	else if (BRAWLER_INFO.trophies >= 675 && BRAWLER_INFO.trophies <= 699) 
		BRAWLER_RESET = " 674";
	else if (BRAWLER_INFO.trophies >= 700 && BRAWLER_INFO.trophies <= 724) 
		BRAWLER_RESET = " 699";
	else if (BRAWLER_INFO.trophies >= 725 && BRAWLER_INFO.trophies <= 749) 
		BRAWLER_RESET = " 724";
	else if (BRAWLER_INFO.trophies >= 750 && BRAWLER_INFO.trophies <= 774)
		BRAWLER_RESET = " 749";
	else if (BRAWLER_INFO.trophies >= 775 && BRAWLER_INFO.trophies <= 799) 
		BRAWLER_RESET = " 774";
	else if (BRAWLER_INFO.trophies >= 800 && BRAWLER_INFO.trophies <= 824)
		BRAWLER_RESET = " 799";
	else if (BRAWLER_INFO.trophies >= 825 && BRAWLER_INFO.trophies <= 849)
		BRAWLER_RESET = " 824";
	else if (BRAWLER_INFO.trophies >= 850 && BRAWLER_INFO.trophies <= 874)
		BRAWLER_RESET = " 190";
	else if (BRAWLER_INFO.trophies >= 875 && BRAWLER_INFO.trophies <= 899)
		BRAWLER_RESET = " 874";
	else if (BRAWLER_INFO.trophies >= 900 && BRAWLER_INFO.trophies <= 924) 
		BRAWLER_RESET = " 885";
	else if (BRAWLER_INFO.trophies >= 925 && BRAWLER_INFO.trophies <= 949)
		BRAWLER_RESET = " 900";
	else if (BRAWLER_INFO.trophies >= 950 && BRAWLER_INFO.trophies <= 974)
		BRAWLER_RESET = " 920";
	else if (BRAWLER_INFO.trophies >= 975 && BRAWLER_INFO.trophies <= 999)
		BRAWLER_RESET = " 940";
	else if (BRAWLER_INFO.trophies >= 1000 && BRAWLER_INFO.trophies <= 1049) 
		BRAWLER_RESET = " 960";
	else if (BRAWLER_INFO.trophies >= 1050 && BRAWLER_INFO.trophies <= 1099) 	
		BRAWLER_RESET = " 980";
	else if (BRAWLER_INFO.trophies >= 1100 && BRAWLER_INFO.trophies <= 1149)
		BRAWLER_RESET = "1000";
	else if (BRAWLER_INFO.trophies >= 1150 && BRAWLER_INFO.trophies <= 1199) 
		BRAWLER_RESET = "1020";
	else if (BRAWLER_INFO.trophies >= 1200 && BRAWLER_INFO.trophies <= 1249)
		BRAWLER_RESET = "1040";
	else if (BRAWLER_INFO.trophies >= 1250 && BRAWLER_INFO.trophies <= 1299)
		BRAWLER_RESET = "1060";
	else if (BRAWLER_INFO.trophies >= 1300 && BRAWLER_INFO.trophies <= 1349)
		BRAWLER_RESET = "1080";
	else if (BRAWLER_INFO.trophies >= 1350 && BRAWLER_INFO.trophies <= 1399)
		BRAWLER_RESET = "1100";
	else if (BRAWLER_INFO.trophies >= 1400 && BRAWLER_INFO.trophies <= 1449)
		BRAWLER_RESET = "1120";
	else if (BRAWLER_INFO.trophies >= 1450 && BRAWLER_INFO.trophies <= 1499)
		BRAWLER_RESET = "1140";
	else if (BRAWLER_INFO.trophies > 1500 )
		BRAWLER_RESET = "1150";
	return BRAWLER_RESET;
}

function StarPower(ID){
	try{
	const EMOTE = DISCORDJS_CLIENT.emojis.cache.find(emoji => emoji.name == 'LS_' + `${ID}`).toString()
	return(EMOTE)
	}catch(ERROR){
	return('<:LS_StarPowers:826549981208510474>')
	}
}

function Gadget(ID){
	try{
	const EMOTE = DISCORDJS_CLIENT.emojis.cache.find(emoji => emoji.name == 'LS_' + `${ID}`).toString()
	return(EMOTE)
	}catch(ERROR){
	return('<:LS_Gadgets:826549981158309928>')
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER STARPOWERS AND GADGETS
/*
function STARPOWERS_GADGETS(i) {
	var STARPOWERS_GADGETS_ICONS = "";
	if(Player_Brawlers_JSON[i].starPowers.length == 0)
	{
		if(Player_Brawlers_JSON[i].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = "<:eS:825502297865715813> <:eS:825502297865715813> <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[i].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = "<:eS:825502297865715813> <:eS:825502297865715813> <:gadget:771356785721475072> <:LS_EmptyGadget:884093949881487380>";
		else
			STARPOWERS_GADGETS_ICONS = "<:eS:825502297865715813> <:eS:825502297865715813> <:gadget:771356785721475072> <:gadget:771356785721475072>";
	}
	else if(Player_Brawlers_JSON[i].starPowers.length == 1)
	{
		if(Player_Brawlers_JSON[i].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:eS:825502297865715813> <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[i].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:eS:825502297865715813> <:gadget:771356785721475072> <:LS_EmptyGadget:884093949881487380>";
		else
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:eS:825502297865715813> <:gadget:771356785721475072> <:gadget:771356785721475072>";	
	}	
	else
	{
		if(Player_Brawlers_JSON[i].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:power:771356831431262228> <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[i].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:power:771356831431262228> <:gadget:771356785721475072> <:LS_EmptyGadget:884093949881487380>";
		else
			STARPOWERS_GADGETS_ICONS = "<:power:771356831431262228> <:power:771356831431262228> <:gadget:771356785721475072> <:gadget:771356785721475072>";	
	}
	return STARPOWERS_GADGETS_ICONS;
}
*/

function STARPOWERS_GADGETS(j) {
	var STARPOWERS_GADGETS_ICONS = "";
	if(Player_Brawlers_JSON[j].starPowers.length == 0)
	{
		if(Player_Brawlers_JSON[j].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = "<:LS_EmptyStarPower:884093882533560320> <:LS_EmptyStarPower:884093882533560320> <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = "<:LS_EmptyStarPower:884093882533560320> <:LS_EmptyStarPower:884093882533560320> " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 2)
			STARPOWERS_GADGETS_ICONS = "<:LS_EmptyStarPower:884093882533560320> <:LS_EmptyStarPower:884093882533560320> " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " " + Gadget(Player_Brawlers_JSON[j].gadgets[1].id);
	}
	else if(Player_Brawlers_JSON[j].starPowers.length == 1)
	{
		if(Player_Brawlers_JSON[j].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " <:LS_EmptyStarPower:884093882533560320> <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " <:LS_EmptyStarPower:884093882533560320> " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 2)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " <:LS_EmptyStarPower:884093882533560320> " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " " + Gadget(Player_Brawlers_JSON[j].gadgets[1].id);
	}	
	else if(Player_Brawlers_JSON[j].starPowers.length == 2)
	{
		if(Player_Brawlers_JSON[j].gadgets.length == 0)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " " + StarPower(Player_Brawlers_JSON[j].starPowers[1].id) + " <:LS_EmptyGadget:884093949881487380> <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 1)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " " + StarPower(Player_Brawlers_JSON[j].starPowers[1].id) + " " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " <:LS_EmptyGadget:884093949881487380>";
		else if(Player_Brawlers_JSON[j].gadgets.length == 2)
			STARPOWERS_GADGETS_ICONS = StarPower(Player_Brawlers_JSON[j].starPowers[0].id) + " " + StarPower(Player_Brawlers_JSON[j].starPowers[1].id) + " " + Gadget(Player_Brawlers_JSON[j].gadgets[0].id) + " " + Gadget(Player_Brawlers_JSON[j].gadgets[1].id);
	}
	return STARPOWERS_GADGETS_ICONS;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//POWER 10 BRAWLERS

var p10 = 0;
Player_Brawlers_JSON.forEach(b => {
if (b.starPowers.length == 0) {
	p10 += 0;
}
else if(b.starPowers.length == 1) {
	p10 += 1;
}
else if(b.starPowers.length == 2) {
	p10 += 1;
}})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BRAWLER TROPHY RANGES

var currBrawl = Player.sortBrawlersByTrophies().reverse();
var currBh = currBrawl[0].trophies;
var currBl = currBrawl[currBrawl.length-1].trophies;

var overallHighest = currBrawl[0].highestTrophies;
var overallLowest = currBrawl[0].highestTrophies;
for(var i = 1; i < currBrawl.length; i++)
{
	if(currBrawl[i].highestTrophies >= overallHighest)
		overallHighest = currBrawl[i].highestTrophies;

	if(currBrawl[i].highestTrophies <= overallLowest)
		overallLowest = currBrawl[i].highestTrophies;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//AVERAGE BRAWLER TROPHIES

var totalHighest = 0;
var brawlerCount = 0;
var highestAvg = 0;
Player.sortBrawlersByTrophies(CmdTag).reverse().forEach(b => {
	totalHighest += b.highestTrophies;
	brawlerCount++;
})
highestAvg = Math.round(totalHighest/brawlerCount);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let PAGE_LENGTH;
if(48 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 60)
PAGE_LENGTH = 5;
else if(36 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 48)
PAGE_LENGTH = 4;
else if(24 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 36)
PAGE_LENGTH = 3;
else if(12 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 24)
PAGE_LENGTH = 2;
else if(0 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 12)
PAGE_LENGTH = 1;


const BRAWLER_EMBED_1 = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.icon + '.png', 'https://brawlify.com/stats/profile/' + Player.tag.replace("#",""))
.addFields(
	{name: 'Power 10 Brawlers', value: p10 + '/' + Player.brawlerCount + ' <:LS_Power10:886404027489853441>', inline: true},
	{name: 'Brawler Trophy Range', value: currBl + " <:LS_Arrow1:886313023881478155> " + currBh + ' (' + overallLowest + ' <:LS_Arrow2:886313075366580246> ' + overallHighest + ')', inline: true},
	{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount) + ' (' + highestAvg + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setFooter('Page 1 of ' + PAGE_LENGTH + ' | Use reactions to navigate')

const BRAWLER_EMBED_2 = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.icon + '.png', 'https://brawlify.com/stats/profile/' + Player.tag.replace("#",""))
.addFields(
	{name: 'Power 10 Brawlers', value: p10 + '/' + Player.brawlerCount + ' <:LS_Power10:886404027489853441>', inline: true},
	{name: 'Brawler Trophy Range', value: currBl + " <:LS_Arrow1:886313023881478155> " + currBh + ' (' + overallLowest + ' <:LS_Arrow2:886313075366580246> ' + overallHighest + ')', inline: true},
	{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount) + ' (' + highestAvg + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setFooter('Page 2 of ' + PAGE_LENGTH + ' | Use reactions to navigate')

const BRAWLER_EMBED_3 = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.icon + '.png', 'https://brawlify.com/stats/profile/' + Player.tag.replace("#",""))
.addFields(
	{name: 'Power 10 Brawlers', value: p10 + '/' + Player.brawlerCount + ' <:LS_Power10:886404027489853441>', inline: true},
	{name: 'Brawler Trophy Range', value: currBl + " <:LS_Arrow1:886313023881478155> " + currBh + ' (' + overallLowest + ' <:LS_Arrow2:886313075366580246> ' + overallHighest + ')', inline: true},
	{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount) + ' (' + highestAvg + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setFooter('Page 3 of ' + PAGE_LENGTH + ' | Use reactions to navigate')

const BRAWLER_EMBED_4 = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.icon + '.png', 'https://brawlify.com/stats/profile/' + Player.tag.replace("#",""))
.addFields(
	{name: 'Power 10 Brawlers', value: p10 + '/' + Player.brawlerCount + ' <:LS_Power10:886404027489853441>', inline: true},
	{name: 'Brawler Trophy Range', value: currBl + " <:LS_Arrow1:886313023881478155> " + currBh + ' (' + overallLowest + ' <:LS_Arrow2:886313075366580246> ' + overallHighest + ')', inline: true},
	{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount) + ' (' + highestAvg + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setFooter('Page 4 of ' + PAGE_LENGTH + ' | Use reactions to navigate')

const BRAWLER_EMBED_5 = new DISCORDJS.MessageEmbed()
.setColor(Player.getColor(Player.nameColor))
.setAuthor(Player.name + ' | ' + Player.tag, 'https://cdn.brawlify.com/profile/' + Player.icon + '.png', 'https://brawlify.com/stats/profile/' + Player.tag.replace("#",""))
.addFields(
	{name: 'Power 10 Brawlers', value: p10 + '/' + Player.brawlerCount + ' <:LS_Power10:886404027489853441>', inline: true},
	{name: 'Brawler Trophy Range', value: currBl + " <:LS_Arrow1:886313023881478155> " + currBh + ' (' + overallLowest + ' <:LS_Arrow2:886313075366580246> ' + overallHighest + ')', inline: true},
	{name: 'Average Brawler Trophy', value: Math.round(Player.trophies/Player.brawlerCount) + ' (' + highestAvg + ') <:LS_AverageBrawlerTrophies:826549980780298280>', inline: true})
.setFooter('Page 5 of ' + PAGE_LENGTH + ' | Use reactions to navigate')


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MAKING THE EMBEDS

if(Player_Brawlers_JSON.length <= 12)//Only 1 Embed
{
	for(var i = 0; i < Player_Brawlers_JSON.length; i++)
	{
		BRAWLER_EMBED_1.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
}
else if(Player_Brawlers_JSON.length <= 24)//Only 2 Embed 
{
	//EMBED 1 
	for(var i = 0; i < 12; i++)
	{
		BRAWLER_EMBED_1.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 2
	for(var i = 12; i < Player_Brawlers_JSON.length; i++)
	{
		BRAWLER_EMBED_2.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
} 
else if(Player_Brawlers_JSON.length <= 36) //Only 3 Embed
{
	//EMBED 1 
	for(var i = 0; i < 12; i++)
	{
		BRAWLER_EMBED_1.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 2
	for(var i = 12; i < 24; i++)
	{
		BRAWLER_EMBED_2.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 3
	for(var i = 24; i < Player_Brawlers_JSON.length; i++)
	{
		BRAWLER_EMBED_3.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
} 
else if(Player_Brawlers_JSON.length <= 48) //Only 4 Embed
{
	//EMBED 1 
	for(var i = 0; i < 12; i++)
	{
		BRAWLER_EMBED_1.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 2
	for(var i = 12; i < 24; i++)
	{
		BRAWLER_EMBED_2.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 3
	for(var i = 24; i < 36; i++)
	{
		BRAWLER_EMBED_3.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 4
	for(var i = 36; i < Player_Brawlers_JSON.length; i++)
	{
		BRAWLER_EMBED_4.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	}
}
else if(Player_Brawlers_JSON.length <= 60) //Only 5 Embed
{
	//EMBED 1 
	for(var i = 0; i < 12; i++)
	{
		BRAWLER_EMBED_1.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 2
	for(var i = 12; i < 24; i++)
	{
		BRAWLER_EMBED_2.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 3
	for(var i = 24; i < 36; i++)
	{
		BRAWLER_EMBED_3.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	} 
	//EMBED 4
	for(var i = 36; i < 48; i++)
	{
		BRAWLER_EMBED_4.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	}
	//EMBED 5
	for(var i = 48; i < Player_Brawlers_JSON.length; i++)
	{
		BRAWLER_EMBED_5.addField(BRAWLER_PINS(i) + " " + Player_Brawlers_JSON[i].name, POWER_LEVEL(i) + " : " + STARPOWERS_GADGETS(i) + "\n" + BRAWLER_RANKS(i) + " \`" + Trophies(i) + "\` | \`" + HighestTrophies(i) + "\` <:LS_AverageBrawlerTrophies:826549980780298280>\n<:LS_ResetTrophies:826549981108371476> \`" + reset(i) + "\` | \`" + STARPOINTS(i) + "\` <:LS_StarPoints:826549981020160100>", true)
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MAKING THE EMBEDS

if(48 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 60){
	await SLASH_COMMAND_INTERACTION.reply({embeds: [BRAWLER_EMBED_1]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_2]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_3]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_4]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_5]})

}else if(36 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 48){
	await SLASH_COMMAND_INTERACTION.reply({embeds: [BRAWLER_EMBED_1]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_2]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_3]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_4]})

}else if(24 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 36){
	await SLASH_COMMAND_INTERACTION.reply({embeds: [BRAWLER_EMBED_1]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_2]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_3]})

}else if(12 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 24){
	await SLASH_COMMAND_INTERACTION.reply({embeds: [BRAWLER_EMBED_1]})
	await SLASH_COMMAND_INTERACTION.channel.send({embeds: [BRAWLER_EMBED_2]})

}else if(0 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 12){
	await SLASH_COMMAND_INTERACTION.reply({embeds: [BRAWLER_EMBED_1]})
}

/*
new Reaction_Menu.menu({
    channel: SLASH_COMMAND_INTERACTION.channelId,
    userID: SLASH_COMMAND_INTERACTION.user.id,
    pages: BRAWLER_PAGES	
})
if(48 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 60){
 EMBEDS = [BRAWLER_EMBED_1, BRAWLER_EMBED_2, BRAWLER_EMBED_3, BRAWLER_EMBED_4, BRAWLER_EMBED_5]
}else if(36 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 48){
 EMBEDS = [BRAWLER_EMBED_1, BRAWLER_EMBED_2, BRAWLER_EMBED_3, BRAWLER_EMBED_4]
}else if(24 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 36){
 EMBEDS = [BRAWLER_EMBED_1, BRAWLER_EMBED_2, BRAWLER_EMBED_3]
}else if(12 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 24){
 EMBEDS = [BRAWLER_EMBED_1, BRAWLER_EMBED_2]
}else if(0 < Player_Brawlers_JSON.length && Player_Brawlers_JSON.length <= 12){
 EMBEDS = [BRAWLER_EMBED_1]
}

pagination({
author: SLASH_COMMAND_INTERACTION.user,
channel: SLASH_COMMAND_INTERACTION.channel, 
embeds: EMBEDS,
time:  30 * 1000
})
*/

}
}catch(ERROR){
    
if(ERROR.code == 404){
DIBSTER_ERROR_Reason = "Resource was not found.";
USER_ERROR_Reason = "Player tag given is invalid, check the tag to make sure it is indeed a valid player tag.";
const ERROR_EMBED = new DISCORDJS.MessageEmbed()
.setColor(process.env.ERROR_COLOR)
.setTitle(`ERROR: Invalid Player Tag`)
.setDescription(`${process.env.ERROR_EMOTE} ${USER_ERROR_Reason}`)
.setTimestamp()
.setFooter(`Error at`, `${process.env.LOGO}`)

const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
.setColor(process.env.ERROR_COLOR)
.setTitle(`ERROR: ${ERROR.code}`)
.setDescription(`${process.env.ERROR_EMOTE} ${DIBSTER_ERROR_Reason}`)
.addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
.addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
.addField('Slash Command Property:', `\`\`\`${SLASH_COMMAND_INTERACTION.options}\`\`\``, false)
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
.addField('Slash Command Property:', `\`\`\`${SLASH_COMMAND_INTERACTION}\`\`\``, false)
.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
.setTimestamp()
.setFooter('Error at', `${process.env.LOGO}`)

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

}else{
console.log(ERROR)
var DIBSTER_ERROR_Reason = "";
	if    (ERROR.code == 400) {
	DIBSTER_ERROR_Reason = "Client provided incorrect parameters for the request.";
} else if (ERROR.code == 403) {
	DIBSTER_ERROR_Reason = "Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.";
} else if (ERROR.code == 429) {
	DIBSTER_ERROR_Reason = "Request was throttled, because amount of requests was above the threshold defined for the used API token.";
} else if (ERROR.code == 500) {
	DIBSTER_ERROR_Reason = "Unknown error happened when handling the request.";
} else {
	DIBSTER_ERROR_Reason = "I encounted a unexpected error. Please check the console for the error. Please contact DIBSTER#9419 or DIBSTER#2317 if this error persists.";
}

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
.addField('Slash Command Property:', `\`\`\`${SLASH_COMMAND_INTERACTION}\`\`\``, false)
.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
.setTimestamp()
.setFooter('Error at', `${process.env.LOGO}`)

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.
await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

    }                                                                                   //End of ERROR Handling if statements.
    }                                                                                   //End of Catch.
	},                                                                                  //End of Execute.
};                                                                                      //End of module.exports.    