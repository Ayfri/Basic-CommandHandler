const chalk = require("chalk");

module.exports = async (client) => {
	console.log(chalk.greenBright(`${__filename.slice(__dirname.length + 1)}`)+chalk.reset(` : ${chalk.yellowBright(client.user.tag)} est allumé et présent sur ${chalk.magentaBright(client.guilds.size)} serveurs.`));
}