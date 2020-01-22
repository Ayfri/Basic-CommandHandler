const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
	const embed = new Discord.RichEmbed();
	if (command = client.commands.find(c => args[0] || c.aliases.includes(args[0]))) {
		embed.setTitle(`Help on command : ${command.name}`);
		embed.setDescription(`<> = Required, [] = Optional\nCategory : **${command.category}**\nAvailable in private messages : **${command.serverForced ? 'no' : 'yes'}**`);
		embed.addField('Description :', command.description);
		embed.addField('Usage :', command.usages.length > 0 ? command.usages : command.name);
		embed.addField('Description :', command.description);
		embed.addField('Alias :', `\`${command.aliases.length > 0 ? command.aliases.join("`, `") : 'None'}\``);
		
	} else {
		embed.setTitle('List of the commands :');
		embed.setFooter(`${message.content.slice(prefix.length).trim().split(/ +/g)[0]}help <command> to get more informations`);
		const categories = new Set(commands.map(c => c.category));
		
		for (let category of categories) {
			embed.addField(category, commands.map(c => `**\`${c.name}\`** : ${c.description}`);
		}
	}
	message.channel.send(embed);
};
module.exports.config = {
	category    : 'utils',
	name        : __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases     : ['h'],
	serverForced: false
};

module.exports.help = {
	description : 'Command to get the list of the command or help on a command.',
	usages: `help\nhelp <command>`,
	examples    : `help help`
};