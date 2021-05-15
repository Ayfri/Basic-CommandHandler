const prefixes = require('../informations/config.json');

module.exports.getPrefix = function (message) {
	prefixes.push(message.client.user.toString());
	return prefixes.find(prefix => message.content.startsWith(prefix));
};

module.exports.findCommand = function (client, arg) {
	return client.commands.get(arg) || client.commands.get(client.aliases.get(arg));
};
