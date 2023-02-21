const { SlashCommandBuilder } = require('@discordjs/builders');                             //Requires the @discordjs/builders Package.
require('dotenv').config();                                                                 //Requires dotenv Package.
const PlayerTags = require('../../Handlers/DB-Models/PlayerTagModel');						//Requires the Player Tag Database.
const fs = require('fs');                                                                   //Requires the fs package.

const SLASH_COMMAND = new SlashCommandBuilder()
SLASH_COMMAND.setName('club')
SLASH_COMMAND.setDescription('Check club stats for any Brawl Stars profile!')
SLASH_COMMAND.addUserOption((option) =>
option.setName('user')
.setDescription('Gets the club stats of another player!')
.setRequired(false));
SLASH_COMMAND.addStringOption((option) =>
option.setName('clubtag')
.setDescription('Gets the stats of a club tag!')
.setRequired(false));
SLASH_COMMAND.addStringOption((option) =>
option.setName('playertag')
.setDescription('Gets the club stats of a player tag!')
.setRequired(false)
);

module.exports = {
data: SLASH_COMMAND.toJSON(),                                                                    

async execute(SLASH_COMMAND_INTERACTION, BRAWLSTARSJS_CLIENT, DISCORDJS_CLIENT, DISCORDJS, Configuration) {
try {

	if(!SLASH_COMMAND_INTERACTION.options._hoistedOptions[0]){
		const PlayerData = await PlayerTags.findOne({
			Discord_ID: SLASH_COMMAND_INTERACTION.user.id
		})
		if(!PlayerData){
			const NoPlayerTagUser = new DISCORDJS.MessageEmbed()
            .setTitle('No Player Tag saved to Profile!')
            .setDescription(`${Configuration.Discord.ERROR_EMOTE} You haven't saved a player tag. To save a player tag, use the slash command \`/save\`.`)
            .setColor(Configuration.Discord.ERROR_COLOR)
            .setTimestamp()
            .setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			await SLASH_COMMAND_INTERACTION.reply({embeds: [NoPlayerTagUser]})
		} else {
			const Player = await BRAWLSTARSJS_CLIENT.getPlayer(PlayerData.Player_Tag)
			if(Player.club == null){
				const NoClubUserEmbed = new DISCORDJS.MessageEmbed()
				.setTitle('User isn\'t in a club!')
				.setDescription(`<:LS_NoClub:881210894275706932> Your not in a club!`)
				.setColor(Configuration.Discord.ERROR_COLOR)
            	.setTimestamp()
				.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			} else {
				const Club = await BRAWLSTARSJS_CLIENT.getClub(Player.club.tag)
				var PlayerRank = "";
				var PlayerRole = "";
			
			const ClubEmbed = new DISCORDJS.MessageEmbed()
			if (Club.getMemberRole(Player.tag) == 'member'){
			
				var PlayerRole = "Member <:LS_Member:825846021501222944>";
			
			} else if (Club.getMemberRole(Player.tag) == 'senior'){
			
				var PlayerRole = "Senior <:LS_Senior:825844322640330832>";
			
			} else if (Club.getMemberRole(Player.tag) == 'vicePresident'){
			
				var PlayerRole = "Vice President <:LS_VicePresident:825844322787393576>";
			
			} else if (Club.getMemberRole(Player.tag) == 'president'){
			
				var PlayerRole = "President <:LS_President:825844323546300446>";
				
			}
			
			var PlayerRank = "#"  + Club.getMemberRank(Player.tag); 
			
			ClubEmbed.addField( Player.name + ' User Stats', "Rank: \`" + PlayerRank + "\`\nRole: **" + PlayerRole + "**", true)
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TYPE
			var Club_Type = "";
			if(Club.type == "open")
				Club_Type = "Open <:LS_Club_Open:874348552158052392>";
			else if(Club.type == "closed")
				Club_Type = "Closed <:LS_Club_Closed:874348775185977414>";
			else
				Club_Type = "Invite Only <:LS_Club_Invite:874348706609131532>";
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TROPHIES
			
			if(!Club.memberCount) 
				Club.memberCount = 0
			//////////////////////////////////////////////////////////////////////////////////////////////
			//PRESIDENT 
			var Club_President = "";
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "president")
					Club_President = "[" + Club.members[i].name + "](https://brawlify.com/stats/profile/" + Club.members[i].tag.replace("#","") + ")";
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//VICE PRESIDENT 
			var Club_VicePresident = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "vicePresident")
				Club_VicePresident++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//SENIORS
			var Club_Seniors = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "senior")
					Club_Seniors++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//MEMBERS
			var Club_Members = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "member")
					Club_Members++;
			}
			//////////////////////////////////////////////////////////////////////////////////////////////
			//DESCRIPTION
			
			if(Club.description == null) 
			Club.description = "NO CLUB DESCRIPTION";
			/////////////////////////////////////////////////////////////////////////////////////////////
			ClubEmbed.setColor('00c1ff')
			ClubEmbed.setAuthor(Club.name + " | " + Club.tag, 'https://cdn.brawlify.com/club/' + Club.badgeId + '.png', 'https://brawlify.com/stats/club/' + Club.tag.replace("#",""))
			ClubEmbed.setDescription('\`\`\`' + Club.description + '\`\`\`')
			ClubEmbed.addFields(
			{name: 'Trophies', value: Club.trophies.toLocaleString() + ' <:LS_Trophies:825844323341041746>', inline: true},
			{name: 'Required Trophies', value: Club.requiredTrophies.toLocaleString() + ' <:LS_RequiredTrophies:825844321399603241>', inline: true},
			{name: 'Type', value: Club_Type, inline: true},
			{name: 'Member Count', value: Club.memberCount + '/100 <:LS_Members:873395609254641757>', inline: true},
			{name: 'President', value: Club_President + ' <:LS_President:825844323546300446>', inline: true},
			{name: 'Vice Presidents', value: Club_VicePresident + ' <:LS_VicePresident:825844322787393576>', inline: true},
			{name: 'Seniors', value: Club_Seniors + ' <:LS_Senior:825844322640330832>', inline: true},
			{name: 'Members', value: Club_Members + ' <:LS_Member:825846021501222944>', inline: true},
			{name: 'Trophy Range', value: Club.members[Club.memberCount-1].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746> <:LS_Arrow1:886313023881478155> " + Club.members[0].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746>", inline: true},
			{name: 'Average Club Trophies', value: Math.round(Club.trophies/Club.memberCount).toLocaleString() + ' <:LS_AverageTrophies:873400933957140560>', inline: true},
			{name: 'Full Member List', value: '[Click Here to View](https://brawlify.com/stats/club/' + Club.tag.replace("#","") + ')', inline: true},
			)
			ClubEmbed.setTimestamp()
			
			await SLASH_COMMAND_INTERACTION.reply({embeds: [ClubEmbed]})
			}
		}

	} else if (SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name == 'user'){
		const PlayerData = await PlayerTags.findOne({
			Discord_ID: SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value
		})
		if(!PlayerData){
			const User = await DISCORDJS_CLIENT.users.cache.get(`${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}`)
            const NoPlayerTagUser = new DISCORDJS.MessageEmbed()
            .setTitle('No Player Tag saved to Profile!')
            .setDescription(`${Configuration.Discord.ERROR_EMOTE} **${User.tag}** hasn't saved a player tag.`)
            .setColor(Configuration.Discord.ERROR_COLOR)
            .setTimestamp()
            .setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			await SLASH_COMMAND_INTERACTION.reply({embeds: [NoPlayerTagUser]})
		} else {
            const Player = await BRAWLSTARSJS_CLIENT.getPlayer(PlayerData.Player_Tag)
			if(Player.club == null){
				const NoClubUserEmbed = new DISCORDJS.MessageEmbed()
				.setTitle('User isn\'t in a club!')
				.setDescription(`<:LS_NoClub:881210894275706932> **${User.tag}** isn't in a club!`)
				.setColor(Configuration.Discord.ERROR_COLOR)
            	.setTimestamp()
				.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			} else {
				const Club = await BRAWLSTARSJS_CLIENT.getClub(Player.club.tag)
				var PlayerRank = "";
				var PlayerRole = "";
			
			const ClubEmbed = new DISCORDJS.MessageEmbed()
			if (Club.getMemberRole(Player.tag) == 'member'){
			
				var PlayerRole = "Member <:LS_Member:825846021501222944>";
			
			} else if (Club.getMemberRole(Player.tag) == 'senior'){
			
				var PlayerRole = "Senior <:LS_Senior:825844322640330832>";
			
			} else if (Club.getMemberRole(Player.tag) == 'vicePresident'){
			
				var PlayerRole = "Vice President <:LS_VicePresident:825844322787393576>";
			
			} else if (Club.getMemberRole(Player.tag) == 'president'){
			
				var PlayerRole = "President <:LS_President:825844323546300446>";
				
			}
			
			var PlayerRank = "#"  + Club.getMemberRank(Player.tag); 
			
			ClubEmbed.addField( Player.name + ' User Stats', "Rank: \`" + PlayerRank + "\`\nRole: **" + PlayerRole + "**", true)
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TYPE
			var Club_Type = "";
			if(Club.type == "open")
				Club_Type = "Open <:LS_Club_Open:874348552158052392>";
			else if(Club.type == "closed")
				Club_Type = "Closed <:LS_Club_Closed:874348775185977414>";
			else
				Club_Type = "Invite Only <:LS_Club_Invite:874348706609131532>";
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TROPHIES
			
			if(!Club.memberCount) 
				Club.memberCount = 0
			//////////////////////////////////////////////////////////////////////////////////////////////
			//PRESIDENT 
			var Club_President = "";
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "president")
					Club_President = "[" + Club.members[i].name + "](https://brawlify.com/stats/profile/" + Club.members[i].tag.replace("#","") + ")";
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//VICE PRESIDENT 
			var Club_VicePresident = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "vicePresident")
				Club_VicePresident++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//SENIORS
			var Club_Seniors = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "senior")
					Club_Seniors++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//MEMBERS
			var Club_Members = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "member")
					Club_Members++;
			}
			//////////////////////////////////////////////////////////////////////////////////////////////
			//DESCRIPTION
			
			if(Club.description == null) 
			Club.description = "NO CLUB DESCRIPTION";
			/////////////////////////////////////////////////////////////////////////////////////////////
			ClubEmbed.setColor('00c1ff')
			ClubEmbed.setAuthor(Club.name + " | " + Club.tag, 'https://cdn.brawlify.com/club/' + Club.badgeId + '.png', 'https://brawlify.com/stats/club/' + Club.tag.replace("#",""))
			ClubEmbed.setDescription('\`\`\`' + Club.description + '\`\`\`')
			ClubEmbed.addFields(
			{name: 'Trophies', value: Club.trophies.toLocaleString() + ' <:LS_Trophies:825844323341041746>', inline: true},
			{name: 'Required Trophies', value: Club.requiredTrophies.toLocaleString() + ' <:LS_RequiredTrophies:825844321399603241>', inline: true},
			{name: 'Type', value: Club_Type, inline: true},
			{name: 'Member Count', value: Club.memberCount + '/100 <:LS_Members:873395609254641757>', inline: true},
			{name: 'President', value: Club_President + ' <:LS_President:825844323546300446>', inline: true},
			{name: 'Vice Presidents', value: Club_VicePresident + ' <:LS_VicePresident:825844322787393576>', inline: true},
			{name: 'Seniors', value: Club_Seniors + ' <:LS_Senior:825844322640330832>', inline: true},
			{name: 'Members', value: Club_Members + ' <:LS_Member:825846021501222944>', inline: true},
			{name: 'Trophy Range', value: Club.members[Club.memberCount-1].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746> <:LS_Arrow1:886313023881478155> " + Club.members[0].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746>", inline: true},
			{name: 'Average Club Trophies', value: Math.round(Club.trophies/Club.memberCount).toLocaleString() + ' <:LS_AverageTrophies:873400933957140560>', inline: true},
			{name: 'Full Member List', value: '[Click Here to View](https://brawlify.com/stats/club/' + Club.tag.replace("#","") + ')', inline: true},
			)
			ClubEmbed.setTimestamp()
			
			await SLASH_COMMAND_INTERACTION.reply({embeds: [ClubEmbed]})
			}
		};

	} else if(SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].name == "playertag") {
		try {
		const Player = await BRAWLSTARSJS_CLIENT.getPlayer(SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value)
			if(Player.club != null){
				const Club = await BRAWLSTARSJS_CLIENT.getClub(Player.club.tag)
				const ClubEmbed = new DISCORDJS.MessageEmbed()
				var PlayerRank = "";
				var PlayerRole = "";
			
			if (Club.getMemberRole(Player.tag) == 'member'){
			
				var PlayerRole = "Member <:LS_Member:825846021501222944>";
			
			} else if (Club.getMemberRole(Player.tag) == 'senior'){
			
				var PlayerRole = "Senior <:LS_Senior:825844322640330832>";
			
			} else if (Club.getMemberRole(Player.tag) == 'vicePresident'){
			
				var PlayerRole = "Vice President <:LS_VicePresident:825844322787393576>";
			
			} else if (Club.getMemberRole(Player.tag) == 'president'){
			
				var PlayerRole = "President <:LS_President:825844323546300446>";
				
			}
			
			var PlayerRank = "#"  + Club.getMemberRank(Player.tag); 
			
			ClubEmbed.addField( Player.name + ' User Stats', "Rank: \`" + PlayerRank + "\`\nRole: **" + PlayerRole + "**", true)
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TYPE
			var Club_Type = "";
			if(Club.type == "open")
				Club_Type = "Open <:LS_Club_Open:874348552158052392>";
			else if(Club.type == "closed")
				Club_Type = "Closed <:LS_Club_Closed:874348775185977414>";
			else
				Club_Type = "Invite Only <:LS_Club_Invite:874348706609131532>";
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TROPHIES
			
			if(!Club.memberCount) 
				Club.memberCount = 0
			//////////////////////////////////////////////////////////////////////////////////////////////
			//PRESIDENT 
			var Club_President = "";
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "president")
					Club_President = "[" + Club.members[i].name + "](https://brawlify.com/stats/profile/" + Club.members[i].tag.replace("#","") + ")";
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//VICE PRESIDENT 
			var Club_VicePresident = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "vicePresident")
				Club_VicePresident++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//SENIORS
			var Club_Seniors = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "senior")
					Club_Seniors++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//MEMBERS
			var Club_Members = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "member")
					Club_Members++;
			}
			//////////////////////////////////////////////////////////////////////////////////////////////
			//DESCRIPTION
			
			if(Club.description == null) 
			Club.description = "NO CLUB DESCRIPTION";
			/////////////////////////////////////////////////////////////////////////////////////////////
			ClubEmbed.setColor('00c1ff')
			ClubEmbed.setAuthor(Club.name + " | " + Club.tag, 'https://cdn.brawlify.com/club/' + Club.badgeId + '.png', 'https://brawlify.com/stats/club/' + Club.tag.replace("#",""))
			ClubEmbed.setDescription('\`\`\`' + Club.description + '\`\`\`')
			ClubEmbed.addFields(
			{name: 'Trophies', value: Club.trophies.toLocaleString() + ' <:LS_Trophies:825844323341041746>', inline: true},
			{name: 'Required Trophies', value: Club.requiredTrophies.toLocaleString() + ' <:LS_RequiredTrophies:825844321399603241>', inline: true},
			{name: 'Type', value: Club_Type, inline: true},
			{name: 'Member Count', value: Club.memberCount + '/100 <:LS_Members:873395609254641757>', inline: true},
			{name: 'President', value: Club_President + ' <:LS_President:825844323546300446>', inline: true},
			{name: 'Vice Presidents', value: Club_VicePresident + ' <:LS_VicePresident:825844322787393576>', inline: true},
			{name: 'Seniors', value: Club_Seniors + ' <:LS_Senior:825844322640330832>', inline: true},
			{name: 'Members', value: Club_Members + ' <:LS_Member:825846021501222944>', inline: true},
			{name: 'Trophy Range', value: Club.members[Club.memberCount-1].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746> <:LS_Arrow1:886313023881478155> " + Club.members[0].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746>", inline: true},
			{name: 'Average Club Trophies', value: Math.round(Club.trophies/Club.memberCount).toLocaleString() + ' <:LS_AverageTrophies:873400933957140560>', inline: true},
			{name: 'Full Member List', value: '[Click Here to View](https://brawlify.com/stats/club/' + Club.tag.replace("#","") + ')', inline: true},
			)
			ClubEmbed.setTimestamp()
			
			await SLASH_COMMAND_INTERACTION.reply({embeds: [ClubEmbed]})
			} else {
				const NoClubUserEmbed = new DISCORDJS.MessageEmbed()
				.setTitle('Player isn\'t in a club!')
				.setDescription(`<:LS_NoClub:881210894275706932> **${Player.tag}** isn't in a club!`)
				.setColor(Configuration.Discord.ERROR_COLOR)
            	.setTimestamp()
				.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			}
		} catch(ERROR){
			if(ERROR.code === 404){
			const InvalidPlayerTagEmbed = new DISCORDJS.MessageEmbed()
			.setTitle('Invalid Player Tag!')
			.setDescription(`${Configuration.ERROR_EMOTE} **${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}** is not a valid player tag!`)
			.setColor(Configuration.DISCORDJS.ERROR_COLOR)
			.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)
			} else {
				return ERROR
			}
		} 

	} else {
        try{
			const Club = await BRAWLSTARSJS_CLIENT.getClub(SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value)
			const ClubEmbed = new DISCORDJS.MessageEmbed()
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TYPE
			var Club_Type = "";
			if(Club.type == "open")
				Club_Type = "Open <:LS_Club_Open:874348552158052392>";
			else if(Club.type == "closed")
				Club_Type = "Closed <:LS_Club_Closed:874348775185977414>";
			else
				Club_Type = "Invite Only <:LS_Club_Invite:874348706609131532>";
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//CLUB TROPHIES
			
			if(!Club.memberCount) 
				Club.memberCount = 0
			//////////////////////////////////////////////////////////////////////////////////////////////
			//PRESIDENT 
			var Club_President = "";
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "president")
					Club_President = "[" + Club.members[i].name + "](https://brawlify.com/stats/profile/" + Club.members[i].tag.replace("#","") + ")";
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//VICE PRESIDENT 
			var Club_VicePresident = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "vicePresident")
				Club_VicePresident++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//SENIORS
			var Club_Seniors = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "senior")
					Club_Seniors++;
			}
			
			//////////////////////////////////////////////////////////////////////////////////////////////
			//MEMBERS
			var Club_Members = 0;
			for(var i = 0; i < Club.members.length; i++)
			{
				if(Club.members[i].role == "member")
					Club_Members++;
			}
			//////////////////////////////////////////////////////////////////////////////////////////////
			//DESCRIPTION
			
			if(Club.description == null) 
			Club.description = "NO CLUB DESCRIPTION";
			/////////////////////////////////////////////////////////////////////////////////////////////
			ClubEmbed.setColor('00c1ff')
			ClubEmbed.setAuthor(Club.name + " | " + Club.tag, 'https://cdn.brawlify.com/club/' + Club.badgeId + '.png', 'https://brawlify.com/stats/club/' + Club.tag.replace("#",""))
			ClubEmbed.setDescription('\`\`\`' + Club.description + '\`\`\`')
			ClubEmbed.addFields(
			{name: 'Trophies', value: Club.trophies.toLocaleString() + ' <:LS_Trophies:825844323341041746>', inline: true},
			{name: 'Required Trophies', value: Club.requiredTrophies.toLocaleString() + ' <:LS_RequiredTrophies:825844321399603241>', inline: true},
			{name: 'Type', value: Club_Type, inline: true},
			{name: 'Member Count', value: Club.memberCount + '/100 <:LS_Members:873395609254641757>', inline: true},
			{name: 'President', value: Club_President + ' <:LS_President:825844323546300446>', inline: true},
			{name: 'Vice Presidents', value: Club_VicePresident + ' <:LS_VicePresident:825844322787393576>', inline: true},
			{name: 'Seniors', value: Club_Seniors + ' <:LS_Senior:825844322640330832>', inline: true},
			{name: 'Members', value: Club_Members + ' <:LS_Member:825846021501222944>', inline: true},
			{name: 'Trophy Range', value: Club.members[Club.memberCount-1].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746> <:LS_Arrow1:886313023881478155> " + Club.members[0].trophies.toLocaleString() + " <:LS_Trophies:825844323341041746>", inline: true},
			{name: 'Average Club Trophies', value: Math.round(Club.trophies/Club.memberCount).toLocaleString() + ' <:LS_AverageTrophies:873400933957140560>', inline: true},
			{name: 'Full Member List', value: '[Click Here to View](https://brawlify.com/stats/club/' + Club.tag.replace("#","") + ')', inline: true},
			)
			ClubEmbed.setTimestamp()
			
			await SLASH_COMMAND_INTERACTION.reply({embeds: [ClubEmbed]})
		} catch(ERROR){
			if(ERROR.code == 404){
			const InvalidClubEmbed = new DISCORDJS.MessageEmbed()
			.setTitle('Invalid Club Tag!')
			.setDescription(`${Configuration.ERROR_EMOTE} **${SLASH_COMMAND_INTERACTION.options._hoistedOptions[0].value}** is not a valid club tag!`)
			.setColor(Configuration.DISCORDJS.ERROR_COLOR)
			.setFooter(Configuration.Discord.CUSTOM_FOOTER, `https://cdn.discordapp.com/avatars/${DISCORDJS_CLIENT.user.id}/${DISCORDJS_CLIENT.user.avatar}.png?size=1024`)

			await SLASH_COMMAND_INTERACTION.reply({embeds: [InvalidClubEmbed]})
			} else if(e.code == 400 || 403 || 429 || 500){
				if    (e.code == 400) {
					var DIBSTER_ERROR_Reason = "Client provided incorrect parameters for the request.";
				} else if (e.code == 403) {
					var DIBSTER_ERROR_Reason = "Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.";
				} else if (e.code == 429) {
					var DIBSTER_ERROR_Reason = "Request was throttled, because amount of requests was above the threshold defined for the used API token.";
				} else if (e.code == 500) {
					var DIBSTER_ERROR_Reason = "Unknown error happened when handling the request.";
				} else {
					var DIBSTER_ERROR_Reason = "Unknown error encountered."
				}
	const USER_ERROR_Reason = "Internal (Discord Bot) Error occurred. Please contact [DIBSTER#2317](https://discordapp.com/users/757296951925538856) or [DIBSTER#9419](https://discordapp.com/users/721509602205630475) regarding this issue this issue.";
	
	const ERROR_EMBED = new DISCORDJS.MessageEmbed()                                    //USER ERROR LOG.
		.setColor(Configuration.Discord.ERROR_COLOR)
		.setTitle(`ERROR: Discord Bot Error`)
		.setDescription(`${Configuration.Discord.ERROR_EMOTE} ${USER_ERROR_Reason}`)
		.setTimestamp()
		.setFooter(`Error at`, `${Configuration.Discord.LOGO}`)
	
	const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
		.setColor(Configuration.Discord.ERROR_COLOR)
		.setTitle(`ERROR: ${ERROR.code}`)
		.setDescription(`${Configuration.Discord.ERROR_EMOTE} ${DIBSTER_ERROR_Reason}`)
		.addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
		.addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
		.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
		.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
		.setTimestamp()
		.setFooter('Error at', `${process.env.LOGO}`)
	
		const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
		const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
		CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.
				
		const ERRORS = fs.readdirSync('./ERRORS')
		const NewNumber = e.length + 1
		
		var getTimeString = function(input, separator) {
			var pad = function(input) {return input < 10 ? "0" + input : input;};
			var date = input ? new Date(input) : new Date();
			return [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), date.getMilliseconds()].join(typeof separator !== 'undefined' ?  separator : ':' );
		}
		let DATE = new Date().toISOString().slice(0, 10)
		
		const DIVIDER_LINE = `------------------------------------------------------------------------------------------------------------------`;
		const CRASH_LOG = "ERROR Below: \n" + DIVIDER_LINE + "\n" + e + " \n" + DIVIDER_LINE + " \nERROR CODE: " + ERROR.code + "\n" + DIVIDER_LINE + " \nERROR Reason: \n" + DIBSTER_ERROR_Reason + "\n" + DIVIDER_LINE + "\nTime of ERROR: " + DATE + " | "  + getTimeString("", ":") + "\n" + DIVIDER_LINE;
		
		fs.writeFile('./ERRORS/ERROR_LOG_' + NewNumber + '.txt', CRASH_LOG, err => {
		})

		await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.
	
			} else if(e.code == 503) {
		DIBSTER_ERROR_Reason = "Service is temprorarily unavailable because of maintenance.";
		USER_ERROR_Reason = "Service is temprorarily unavailable because of maintenance. Brawl Stars is currently in maintainence, therefore, no data from the API is available as of now.";
	
		const ERROR_EMBED = new DISCORDJS.MessageEmbed()                                    //USER ERROR LOG.
			.setColor(process.env.ERROR_COLOR)
			.setTitle(`ERROR: Discord Bot Error`)
			.setDescription(`${process.env.ERROR_EMOTE} ${USER_ERROR_Reason}`)
			.setTimestamp()
			.setFooter(`Error at`, `${process.env.LOGO}`)
	
		const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
			.setColor(Configuration.Discord.ERROR_COLOR)
			.setTitle(`ERROR: ${ERROR.code}`)
			.setDescription(`${process.env.ERROR_EMOTE} ${DIBSTER_ERROR_Reason}`)
			.addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
			.addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
			   .addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
			.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
			.setTimestamp()
			.setFooter('Error at', `${process.env.LOGO}`)
				
		const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
		const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
		CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.
	
		await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.
			} else {
		const USER_ERROR_Reason = "Internal (Discord Bot) Error occurred. Please contact [DIBSTER#2317](https://discordapp.com/users/757296951925538856) or [DIBSTER#9419](https://discordapp.com/users/721509602205630475) regarding this issue this issue.";
	
	const ERROR_EMBED = new DISCORDJS.MessageEmbed()                                    //USER ERROR LOG.
		.setColor(Configuration.Discord.ERROR_COLOR)
		.setTitle(`ERROR: Discord Bot Error`)
		.setDescription(`${Configuration.Discord.ERROR_EMOTE} ${USER_ERROR_Reason}`)
		.setTimestamp()
		.setFooter(`Error at`, `${Configuration.Discord.LOGO}`)
	
	const DIBSTER_EMBED = new DISCORDJS.MessageEmbed()                                  //DIBSTER ERROR LOG.
		.setColor(Configuration.Discord.ERROR_COLOR)
		.setTitle(`ERROR: ${ERROR.code}`)
		.setDescription(`${Configuration.Discord.ERROR_EMOTE} ${DIBSTER_ERROR_Reason}`)
		.addField('ERROR Channel:', `<#${SLASH_COMMAND_INTERACTION.channelId}>`)
		.addField('Slash Command:', `${SLASH_COMMAND_INTERACTION.commandName} | \`\`${SLASH_COMMAND_INTERACTION.commandId}\`\``, false)
		.addField('Guild ID & Channel ID:', `\`\`${SLASH_COMMAND_INTERACTION.guildId}\`\` | \`\`${SLASH_COMMAND_INTERACTION.channelId}\`\``, false)
		.addField('Targeted User:', `**${SLASH_COMMAND_INTERACTION.user.tag}** | \`\`${SLASH_COMMAND_INTERACTION.user.id}\`\``)
		.setTimestamp()
		.setFooter('Error at', `${process.env.LOGO}`)
	
		const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
		const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
		CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.

		const ERRORS = fs.readdirSync('./ERRORS')
		const NewNumber = e.length + 1
		
		var getTimeString = function(input, separator) {
			var pad = function(input) {return input < 10 ? "0" + input : input;};
			var date = input ? new Date(input) : new Date();
			return [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), date.getMilliseconds()].join(typeof separator !== 'undefined' ?  separator : ':' );
		}
		let DATE = new Date().toISOString().slice(0, 10)
		
		const DIVIDER_LINE = `------------------------------------------------------------------------------------------------------------------`;
		const CRASH_LOG = "ERROR Below: \n" + DIVIDER_LINE + "\n" + e + " \n" + DIVIDER_LINE + " \nERROR CODE: " + ERROR.code + "\n" + DIVIDER_LINE + " \nERROR Reason: \n" + DIBSTER_ERROR_Reason + "\n" + DIVIDER_LINE + "\nTime of ERROR: " + DATE + " | "  + getTimeString("", ":") + "\n" + DIVIDER_LINE;
		
		fs.writeFile('./ERRORS/ERROR_LOG_' + NewNumber + '.txt', CRASH_LOG, err => {
		})
	
		await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.
			}
		}
    };

} catch(ERROR) {
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

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
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

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
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

const GUILD = await DISCORDJS_CLIENT.guilds.cache.get('779178299419000872');        //Getting the LS Development Guild.
const CHANNEL = await GUILD.channels.cache.get('898000893008564234');               //Getting the Channel within Guild.
CHANNEL.send({ embeds: [DIBSTER_EMBED]});                                           //Sending the ERROR LOG.
await SLASH_COMMAND_INTERACTION.reply({ embeds: [ERROR_EMBED], ephemeral: true });  //Sending the User ERROR LOG.

	}                                                                           	//End of ERROR Handling if statements.
    }                                                                               //End of Try Catch.
	},                                                                              //End of Execute.
};                                                                                  //End of module.exports.    
