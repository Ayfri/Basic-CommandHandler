const Discord = require('discord.js');
const {findCommand} = require('../utils/utils.js');
const {prefixes} = require('../events/message.js');

module.exports.run = async (client, message, args) => {
	const embed = new Discord.MessageEmbed();
	const command = findCommand(client, args[0]);
	if (command) {
		embed.setTitle(`Help on command : ${command.name}`);
		embed.setDescription(
			`<> = Required, [] = Optional\nCategory : **${command.category}**\nAvailable in private messages : **${command.serverForced ? 'no' : 'yes'}**`
		);
		embed.addField('Description :', command.description);
		embed.addField('Usage :', command.syntax.length > 0 ? command.syntax : command.name);
		embed.addField('Description :', command.description);
		embed.addField('Aliases :', `\`${command.aliases.length > 0 ? command.aliases.join('`, `') : 'None'}\``);
	} else {
		embed.setTitle('List of the commands :');

		const prefix = prefixes.find(prefix => message.content.startsWith(prefix)) ?? null;
		embed.setFooter(`${message.content.slice(prefix.length).trim().split(/ +/g)[0]}help <command> to get more informations`);
		const categories = new Set(client.commands.map(c => c.category));

		for (let category of categories) {
			embed.addField(
				category,
				client.commands.map(c => `**\`${c.name}\`** : ${c.description}`)
			);
		}
	}

	await message.channel.send(embed);
};
module.exports.config = {
	category: 'utils.js',
	name: __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases: ['h'],
	serverForced: false,
};

module.exports.help = {
	description: 'Command to get the list of the command or help on a command.',
	syntax: `help\nhelp <command>`,
	examples: `help help`,
};
