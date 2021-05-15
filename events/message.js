const config = require('../informations/config');
const chalk = require('chalk');
const Discord = require('discord.js');
const dayjs = require('dayjs');

module.exports = async (client, message) => {
	const prefixes = ['!', `<@${client.user.id}>`];
	module.exports.prefixes = prefixes;

	if (message.author.bot) return;

	const prefix = prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandArg = args.shift().toLowerCase();
	const command = client.commands.get(commandArg) || client.commands.get(client.aliases.get(commandArg));

	// Verification of permissions.
	if (command && prefix) {
		if (!config.owners.includes(message.author.id)) {
			if (command.config.category === 'owner') {
				await message.channel.send('You are not the creator of the bot.');
				return console.log(
					chalk.greenBright(command.config.name + '.js') +
						chalk.reset(' : ') +
						chalk.yellowBright(message.author.tag) +
						chalk.reset(` tried the command ${chalk.cyanBright(command.config.name)} on server ${chalk.magenta(message.guild.name)}.`)
				);
			}
		} else {
			if (message.guild) {
				console.log(
					`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
						message.author.tag
					)} executed the command ${chalk.cyanBright(command.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`
				);
			} else {
				if (command.config.serverForced) {
					await message.channel.send('The command is only available on a server.');
					return console.log(
						`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
							message.author.tag
						)} tried the command ${chalk.cyanBright(command.config.name)} only available on server but in DM.`
					);
				}
				console.log(
					`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
						message.author.tag
					)} executed the command ${chalk.cyanBright(command.config.name)} privately to the bot.`
				);
			}

			return command.run(client, message, args).catch(async warning => {
				const embed = new Discord.MessageEmbed();
				embed.setDescription('An error occurred with the command : **' + command.config.name + '**.');
				embed.addField('Error :', warning.stack);
				embed.setFooter(client.user.username, client.user.displayAvatarURL());
				embed.setTimestamp();
				embed.setColor('#dd0000');
				await message.channel.send(embed);
				console.log(
					chalk.red(
						`A little mistake was made somewhere in the command ${chalk.cyanBright(command.config.name)}. \nTime : ` +
							dayjs().format('LLLL') +
							'\nError : ' +
							warning.stack
					)
				);
			});
		}

		if (message.guild) {
			console.log(
				`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
					message.author.tag
				)} executed the command ${chalk.cyanBright(command.config.name)} on the guild ${chalk.magenta(message.guild.name)}.`
			);

			if (command.config.category === 'moderation' && !message.member.permissions.has('KICK_MEMBERS', true)) {
				// Non mod.
				await message.channel.send('You are not moderator on the server so you are not allowed to use this command.');
				return console.log(
					chalk.greenBright(command.config.name + '.js') +
						chalk.reset(' : ') +
						chalk.yellowBright(message.author.tag) +
						chalk.reset(
							` does not have moderator permission to make the order ${chalk.cyanBright(command.config.name)} on the guild ${chalk.magenta(
								message.guild.name
							)}.`
						)
				);
			}

			if (command.config.category === 'administration' && !message.member.permissions.has('ADMINISTRATOR', true)) {
				// Non admin.
				await message.channel.send('You are not an administrator on the server so you are not allowed to use this command.');
				return console.log(
					chalk.greenBright(command.config.name + '.js') +
						chalk.reset(' : ') +
						chalk.yellowBright(message.author.tag) +
						chalk.reset(
							` does not have admin permission to make the order ${chalk.cyanBright(command.config.name)} on the guild ${chalk.magenta(
								message.guild.name
							)}.`
						)
				);
			}
		} else {
			if (command.config.serverForced) {
				// For commands only available on server.
				await message.channel.send('The command is only available on a server.');
				return console.log(
					`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
						message.author.tag
					)} tried the command ${chalk.cyanBright(command.config.name)} only available on server but in DM.`
				);
			}
			console.log(
				`${chalk.greenBright(__filename.slice(__dirname.length + 1))} : ${chalk.yellowBright(
					message.author.tag
				)} executed the command ${chalk.cyanBright(command.config.name)} in DM.`
			);
		}

		command.run(client, message, args).catch(async warning => {
			await message.channel.send('An error has occurred with this command, the creator has been warned of this.');
			console.log(
				chalk.red(
					`A little mistake was made somewhere in the command code ${chalk.cyanBright(command.config.name)}. \nTime : ` +
						dayjs().format('LLLL') +
						'\nError : ' +
						warning.stack
				)
			);
		});
	}
};
