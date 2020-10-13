# Basic CommandHandler

This is a simple Command Handler using `module.exports` for a configuration, run function and help module for a help command auto-generated.

## Configuration

To start the bot you have to start with NodeJS the `main.js` file. If you want the bot to be sharded, start with le `index.js` file. There is a configuration file, `informations/config.json`.
In `owners` you have to add your ID (in a String).

## Templates

### Command

```js
module.exports.run = async (client, message, args) => {
	// Code goes here.
}

module.exports.config = {
	category:     "",
	name:         __filename.slice(__dirname.length + 1, __filename.length - 3),
	aliases:      [],
	serverForced: false
}

module.exports.help = {
	description: "",
	syntax:      ``,
	examples:    ``
}
```

The name of the command is the name of the file. All the props in the modules are required.

### Event

```js
module.exports = async (client, event, args) => {
	// Code goes here.
}
```

## Features

There are already managed categories :

- not-ready : Like owner category.
- owner : Owners only (configuration).
- administration : Only users that have the `ADMINISTRATOR` permission.
- moderation : Only users that have the `KICK_MEMBERS` permission.

The `client` object has added methods and props like :

| Field name | Description |
| --- | --- |
| commands | Enmap Object. |
| writeFile( Path, JSObject ) | Safely save your JSObject in a JSON. |

#### This project will not receive updates (unless bugs fixes) because I'm working on a new fresh Command Handler with Classes. This Command Handler is very old, and I have progressed a lot since.
