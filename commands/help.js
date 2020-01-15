module.exports.run = async (client, message, args) => {
	return message.channel.send("Le bot fonctionne !");
}
module.exports.config = {
	category: "utile",
	name: __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases: ["h"],
	serverForced: false
}

module.exports.help = {
	description: "Commande d'aide.",
	utilisations: `help`,
	exemples: ``
}