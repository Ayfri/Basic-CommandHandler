const Discord = require('discord.js');
const {prefixes} = require('../events/message.js');


module.exports.run = async (client, message, args) => {
	const embed = new Discord.RichEmbed();
	let command;
	if (command = client.commands.find(c => args[0] || c.aliases.includes(args[0]))) {
		embed.setTitle(`Help on command : ${command.name}`);
		embed.setDescription(`<> = Required, [] = Optional\nCategory : **${command.category}**\nAvailable in private messages : **${command.serverForced ? 'no' : 'yes'}**`);
		embed.addField('Description :', command.description);
		embed.addField('Usage :', command.syntax.length > 0 ? command.syntax : command.name);
		embed.addField('Description :', command.description);
		embed.addField('Alias :', `\`${command.aliases.length > 0 ? command.aliases.join('`, `') : 'None'}\``);
		
	} else {
		embed.setTitle('List of the commands :');
		
		let prefix = false;
		for (const thisPrefix of prefixes) {
			if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
		}
		embed.setFooter(`${message.content.slice(prefix.length).trim().split(/ +/g)[0]}help <command> to get more informations`);
		const categories = new Set(client.commands.map(c => c.category));
		
		for (let category of categories) {
			embed.addField(category, client.commands.map(c => `**\`${c.name}\`** : ${c.description}`));
		}
	}
	
	await message.channel.send(embed);
};
module.exports.config = {
	category:     'utils',
	name:         __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases:      ['h'],
	serverForced: false,
};

module.exports.help = {
	description: 'Command to get the list of the command or help on a command.',
	syntax:      `help\nhelp <command>`,
	examples:    `help help`,
};
