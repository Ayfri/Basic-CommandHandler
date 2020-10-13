const config = require('../informations/config');
const chalk = require('chalk');
const Discord = require('discord.js');
const moment = require('moment');



module.exports = async (client, message) => {
	const prefixes = ['!', `<@${client.user.id}>`];
	module.exports.prefixes =  prefixes;
	
	moment.locale('en');
	if (message.author.bot) return;
	
	let prefix = false;
	for (const thisPrefix of prefixes) {
		if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	
	// Vérification des droits.
	if (cmd && prefix !== false) {
		if (!config.owners.includes(message.author.id)) {
			if (cmd.config.category === 'owner') {
				message.channel.send('Vous n\'êtes pas le créateur du bot.');
				return console.log(chalk.greenBright(cmd.config.name + '.js') +
				                   chalk.reset(' : ') +
				                   chalk.yellowBright(message.author.tag) +
				                   chalk.reset(` a essayé la commande ${chalk.cyanBright(cmd.config.name)} sur le serveur ${chalk.magenta(message.guild.name)}.`));
			}
		} else {
			if (message.guild) {
				console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
				                                                  1))} : ${chalk.yellowBright(message.author.tag)} a fait la commande ${chalk.cyanBright(cmd.config.name)} sur le serveur ${chalk.magenta(message.guild.name)}.`);
			} else {
				if (cmd.config.serverForced) {
					message.channel.send('La commande est uniquement disponible sur un serveur.');
					return console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
					                                                         1))} : ${chalk.yellowBright(message.author.tag)} a essayé la commande ${chalk.cyanBright(cmd.config.name)} uniquement disponible sur serveur mais en privé.`);
				}
				console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
				                                                  1))} : ${chalk.yellowBright(message.author.tag)} a fait la commande ${chalk.cyanBright(cmd.config.name)} en privé au bot.`);
			}
			// En cas d'erreur avec une commande et que l'auteur du message est le créateur.
			return cmd.run(client, message, args).catch(warning => {
				let embed = new Discord.RichEmbed();
				embed.setDescription('Une erreur a eu lieu avec la commande : **' + cmd.config.name + '**.');
				embed.addField('Erreur :', warning.stack);
				embed.setFooter(client.user.username, client.user.displayAvatarURL);
				embed.setTimestamp();
				embed.setColor('#dd0000');
				message.channel.send(embed);
				console.log(chalk.red(`Une petite erreur a été faite quelque part avec la commande ${chalk.cyanBright(cmd.config.name)}. \nHeure : ` +
				                      moment().format('LLLL') +
				                      '\nErreur : ' +
				                      warning.stack));
			});
		}
		
		if (message.guild) {
			if (cmd.config.category === 'modération' && !message.member.permissions.has('KICK_MEMBERS', true)) {
				// Non modérateur.
				message.channel.send('Vous n\'êtes pas modérateur sur le serveur donc vous n\'avez pas le droit d\'utiliser cette commande.');
				return console.log(chalk.greenBright(cmd.config.name + '.js') +
				                   chalk.reset(' : ') +
				                   chalk.yellowBright(message.author.tag) +
				                   chalk.reset(` n'a pas la permission de modérateur pour faire la commande ${chalk.cyanBright(cmd.config.name)} sur le serveur ${chalk.magenta(message.guild.name)}.`));
			}
			
			if (cmd.config.category === 'administration' && !message.member.permissions.has('ADMINISTRATOR', true)) {
				// Non administrateur.
				message.channel.send('Vous n\'êtes pas adminsitrateur sur le serveur donc vous n\'avez pas le droit d\'utiliser cette commande.');
				return console.log(chalk.greenBright(cmd.config.name + '.js') +
				                   chalk.reset(' : ') +
				                   chalk.yellowBright(message.author.tag) +
				                   chalk.reset(` n'a pas la permission d'administrateur pour faire la commande ${chalk.cyanBright(cmd.config.name)} sur le serveur ${chalk.magenta(message.guild.name)}.`));
			}
		}
		if (message.guild) console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
		                                                                     1))} : ${chalk.yellowBright(message.author.tag)} a fait la commande ${chalk.cyanBright(cmd.config.name)} sur le serveur ${chalk.magenta(message.guild.name)}.`); else {
			if (cmd.config.serverForced) {
				// Pour les commandes uniquement disponibles sur serveur.
				message.channel.send('La commande est uniquement disponible sur un serveur.');
				return console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
				                                                         1))} : ${chalk.yellowBright(message.author.tag)} a essayé la commande ${chalk.cyanBright(cmd.config.name)} uniquement disponible sur serveur mais en privé.`);
			}
			console.log(`${chalk.greenBright(__filename.slice(__dirname.length +
			                                                  1))} : ${chalk.yellowBright(message.author.tag)} a fait la commande ${chalk.cyanBright(cmd.config.name)} en privé au bot.`);
		}
		
		return (cmd.run(client, message, args)).catch(warning => {
			message.channel.send('Une erreur a eu lieu avec cette commande, le créateur a été avertit de ceci.');
			console.log(chalk.red(`Une petite erreur a été faite quelque part avec la commande ${chalk.cyanBright(cmd.config.name)}. \nHeure : ` +
			                      moment().format('LLLL') +
			                      '\nErreur : ' +
			                      warning.stack));
		});
	}
};
