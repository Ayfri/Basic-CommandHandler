# basicCommandHandler

This is is a simple command Handler using `module.exports` for config, run function and help module for an help command auto-generated.

## Configuration

There is a config file, `informations/config.json`.
In `owners` you have to add your ID (in a String).

## Templates

### Command

```js
module.exports.run = async (client, message, args) => {}module.exports.config = {    category: "",    name: __filename.slice(__dirname.length + 1, __filename.length - 3),    aliases: [],    serverForced: false}module.exports.help = {    description: "",    utilisations: ``,    exemples: ``}
```

You can also use `category: __dirname.split('/')[__dirname.split('/').length - 1],` for the category to automatically use the dir name.
The name of the command is the name of the file.
All of the props in the modules are required.

### Event

```js
module.exports = async (client, event arguments) => {}
```

## Helps

There are already managed categories :

-   not-ready : Like owner category.
-   owner : Owners only (config).
-   administration : Only users that have the `ADMINISTRATOR` permission.
-   moderation : Only users that have the `KICK_MEMBERS` permission.

The `client` object has added methods and props like :

| Field name | Description |
| --- | --- |
| commands | Enmap Object. |
| events | Enmap Object. |
| writeFile( Path, JSObject ) | Safelly save your JSObject in a JSON. |

#### This project will not received updates (unless bugs fixes) because I'm working on a new Fresh Command Handler with Classes. This Command Handler is very old and I have progressed a lot since.
