module.exports.run = async (client, message, args) => {
	return message.channel.send('The bot is working !');
}
module.exports.config = {
	category: "tests",
	name: __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases: ['t'],
	serverForced: false
}

module.exports.help = {
	description: "Test command.",
	utilisations: `test`,
	exemples: ``
}
