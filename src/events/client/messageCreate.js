// 217066790050594819
const fs = require("fs");
module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message, client) {
		const prefix = "andrew";
		if (message.content.startsWith(prefix)) {
			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const commandName = args.shift();
			let command = null;
			if (!commandName) {
				// default andrew
				command = client.commands.get("andrew");
			} else {
				command = client.commands.get(commandName);
			}
			if (!command) {
				return;
			}
			command.run(client, message, args);
		}
	}
};
