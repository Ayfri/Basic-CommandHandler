const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const client = new Discord.Client();

const configBOT = require('./informations/config');

client.login(configBOT.token);
client.writeFile = (path, object) => {
	if (Object.entries(object).length ===
	    0) throw new Error('The object you want to register has a problem and is empty. \nFor safety reasons an error was created and the file was therefore not saved.');
	fs.writeFile(path, JSON.stringify(object, null, 4), err => {
		if (err) return console.error(chalk.red('An error occurred while saving a file :\n\n' + err.stack));
	});
};

let numberFiles = 0,
	events,
	commands;

// Loading JSONS files.
fs.readdir('./informations/', (err, files) => {
	console.log(chalk.red.bold('\n\nStarting bot.\n\n'));
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith('.json')) return;
		console.log(chalk.white(`External file : `) + chalk.redBright(`${file}`));
	});
	numberFiles += files.length - 2;
});

// Loading events.
fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	console.log(`\nEvents : (` + chalk.magenta.bold(`${files.length}`) + ')');
	events = files.length;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];

		console.log(chalk.white(`Loading the event : `) + chalk.redBright(`${eventName}`));
	});

	numberFiles += files.length;
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Loading commands.
fs.readdir('./commands/', (err, files) => {

	if (err) return console.error(err);
	console.log(`\nCommands : (` + chalk.magenta.bold(`${files.length}`) + ')');
	commands = files.length;
	if (files.length <= 0) return console.log(chalk.red('== ERROR ==\n\n File: index.js \n No commands files were found.'));
	files.forEach(file => {

		if (!file.endsWith('js')) return;
		let props = require(`./commands/${file}`);
		let commandName = props.config.name;
		client.commands.set(commandName, props);
		props.config.aliases.forEach(alias => {
			client.aliases.set(alias, props.config.name);
		});


		let aliases = props.config.aliases.map(e => e.toString()).join(', ');
		console.log(chalk.white(`Loading the command : `) + chalk.redBright(`${commandName}`));
		console.log(chalk.white(`Alises : `) + chalk.cyan(`${aliases}\n`));
	});

	numberFiles += files.length;
	console.log(chalk.white(`Total loading of `) +
	            chalk.magenta.bold(`${numberFiles}`) +
	            chalk.white(` files including ${chalk.magenta.bold(commands)} commands and ${chalk.magenta.bold(events)} events.`));
});
