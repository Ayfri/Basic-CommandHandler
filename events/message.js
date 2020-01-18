const config = require("../informations/config");
const chalk = require("chalk");
const Discord = require("discord.js");
const moment = require("moment");

module.exports = async (client, message) => {
	if(message.author.bot) return;
	const prefixes = ["!",`<@${client.user.id}>`];
	let prefix = false;
	for(const thisPrefix of prefixes) {
		if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	
	if(cmd && prefix != false) {		
		if(!config.owners.includes(message.author.id)) {
			if(cmd.config.category == "owner") {
				message.channel.send("You are not the bot's owner.");
				return console.log(chalk.greenBright(cmd.config.name+".js")+chalk.reset(" : ")+chalk.yellowBright(message.author.tag)+chalk.reset(` has tried the command ${chalk.cyanBright(cmd.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`));
			}
		} else {
			if(message.guild) {
				console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} has tried the command ${chalk.cyanBright(cmd.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`); 
			} else {
				if(cmd.config.serverForced) {
					message.channel.send("The command is only available on a server.");
					return console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} has tried the command ${chalk.cyanBright(cmd.config.name)} only available on server but in private.`);
				}
				console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} executed the command ${chalk.cyanBright(cmd.config.name)} in private.`);
			}

			return cmd.run(client, message, args).catch(warning=>{
				let embed = new Discord.RichEmbed();
				embed.setDescription("An error occurred with the command : **"+cmd.config.name+"**.");
				embed.addField('Errpr :', warning.stack);
				embed.setFooter(client.user.username, client.user.displayAvatarURL);
				embed.setTimestamp();
				embed.setColor("#dd0000");
				message.channel.send(embed);
				console.log(chalk.red(`A small error was made somewhere with the command ${chalk.cyanBright(cmd.config.name)}. \nDate : `+moment().format('LLLL')+
				"\nError : "+warning.stack));
			});
		}
		
		if(message.guild) {
			if(cmd.config.category == "moderation" && !message.member.permissions.has("KICK_MEMBERS", true)) {
				// Non modérateur.
				message.channel.send("You are not a moderator on the guild so you do not have the right to use this command.");
				return console.log(chalk.greenBright(cmd.config.name+".js")+chalk.reset(" : ")+chalk.yellowBright(message.author.tag)+chalk.reset(` does not have KICK_MEMBERS permission to execute the command ${chalk.cyanBright(cmd.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`));
			}

			if(cmd.config.category == "administration" && !message.member.permissions.has("ADMINISTRATOR", true)) {
				message.channel.send("You are not an administrator on the guild so you do not have the right to use this command.");
				return console.log(chalk.greenBright(cmd.config.name+".js")+chalk.reset(" : ")+chalk.yellowBright(message.author.tag)+chalk.reset(` does not have administrator permission to execute the command ${chalk.cyanBright(cmd.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`));
			}
		}
		if(message.guild) console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} executed the command ${chalk.cyanBright(cmd.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`); else {
			if(cmd.config.serverForced) {
				message.channel.send("The command is only available on a guild.");
				return console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} has tried the command ${chalk.cyanBright(cmd.config.name)} only available on server but in private.`);
			}
			console.log(`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(message.author.tag)} executed the command ${chalk.cyanBright(cmd.config.name)} in private.`);
		}

		return(cmd.run(client, message, args)).catch(warning=>{
			message.channel.send("An error has occurred with this command, the creator has been notified of this.");
			console.log(chalk.red(`A small error was made somewhere with the command ${chalk.cyanBright(cmd.config.name)}. \nDate : `+moment().format('LLLL')+
				"\nError : "+warning.stack));
		});
	}
};
