const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ValorantApi = require("unofficial-valorant-api");
const Vapi = new ValorantApi(process.env.VAPI_KEY);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("getvalrank")
		.setDescription("gets your acount ranked information")
		.addStringOption((option) => {
			return option
				.setName("name")
				.setDescription("The name of the valorant account")
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName("tag")
				.setDescription("The valorant account tag")
				.setRequired(true);
		}),

	async execute(interaction, client) {
		const name = interaction.options.getString("name");
		const tag = interaction.options.getString("tag");
		await interaction.deferReply();
		let response = null;
		try {
			response = await Vapi.getMMR({
				version: "v2",
				region: "na",
				name: name,
				tag: tag
			});

			if (response.status === 404) {
				await interaction.editReply({
					content: `Unable to find the user ${name}#${tag}`
				});
				return;
			}
			if (response.status === 429) {
				await interaction.editReply({
					content: `Valorant api is being used too often please wait a few seconds`
				});
				return;
			}
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: `The api encountered an error`
			});
			return;
		}

		const account = response.data;
		const encoded = encodeURIComponent(
			`${account.name}#${account.tag}`
		).toString();

		const url = `https://tracker.gg/valorant/profile/riot/${encoded}/overview`;

		const lostGame =
			account.current_data.mmr_change_to_last_game < 0 ? true : false;

		const embed = new EmbedBuilder()
			.setTitle(`Ranked details for ${account.name}#${account.tag}`)
			.setDescription(`Valorant stats for ${account.name}#${account.tag}`)
			.setColor(0x18e1ee)
			.setImage(account.current_data.images.small)
			.setThumbnail(
				lostGame
					? account.current_data.images.triangle_down
					: account.current_data.images.triangle_up
			)
			.setURL(url)
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL()
			})
			.addFields([
				{
					name: `Username`,
					value: account.name + "",
					inline: true
				},
				{
					name: `tag`,
					value: account.tag + "",
					inline: true
				},
				{
					name: `Current Rank`,
					value: account.current_data.currenttierpatched + "",
					inline: false
				},
				{
					name: `Elo`,
					value: account.current_data.elo + "",
					inline: true
				},
				{
					name: `Current Rating`,
					value: account.current_data.ranking_in_tier + "",
					inline: true
				},
				{
					name: lostGame ? `Rating lost last game` : `Rating gained last game`,
					value: account.current_data.mmr_change_to_last_game + "",
					inline: false
				}
			]);

		await interaction.editReply({
			embeds: [embed]
		});
	}
};
