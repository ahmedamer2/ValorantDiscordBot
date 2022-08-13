const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ValorantApi = require("unofficial-valorant-api");
const Vapi = new ValorantApi(process.env.VAPI_KEY);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("getvalprofile")
		.setDescription("gets basic information about your account")
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
			response = await Vapi.getAccount({
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

		const embed = new EmbedBuilder()
			.setTitle(`Details for ${account.name}#${account.tag}`)
			.setDescription(`Valorant stats for ${account.name}#${account.tag}`)
			.setColor(0x18e1ee)
			.setImage(account.card.wide)
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
					name: `region`,
					value: account.region + "",
					inline: false
				},
				{
					name: `Level`,
					value: account.account_level + "",
					inline: false
				},
				{
					name: `puuid`,
					value: account.puuid + "",
					inline: false
				}
			]);

		await interaction.editReply({
			embeds: [embed]
		});
	}
};
