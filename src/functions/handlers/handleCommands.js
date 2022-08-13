const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync("./src/commands");
		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`./src/commands/${folder}`)
				.filter((file) => file.endsWith(".js"));

			const { commands, commandArray } = client;
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				if (folder === "andrewCommands") {
					const commandName = file.split(".")[0];
					commands.set(commandName, command);
				} else {
					commands.set(command.data.name, command);
					commandArray.push(command.data.toJSON());
					console.log(
						`Command: ${command.data.name} has passed through the handler`
					);
				}
			}
		}

		const clientId = "1007784350928089188";
		const guildId = "916822558253412483";
		const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

		try {
			console.log("Started refreshing application (/) commands");

			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: client.commandArray
			});
		} catch (err) {
			console.error(err);
		}
	};
};
