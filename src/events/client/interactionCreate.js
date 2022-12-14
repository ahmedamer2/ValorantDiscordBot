module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (err) {
				console.error(err);
				await interaction.editReply({
					content: `Something went wrong while executing this command...`,
					ephemeral: true
				});
			}
		}
	}
};
