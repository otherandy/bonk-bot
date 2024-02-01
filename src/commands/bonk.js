const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bonk")
    .setDescription("Bonk!")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to bonk.")
    ),
  async execute(interaction, db) {
    let total = (parseInt(await db.info.get("total")) || 0) + 1;

    try {
      await db.info.set("total", total);
    } catch (error) {
      console.error(error);
    }

    const embed = new EmbedBuilder()
      .setColor("GREEN")
      .setAuthor({})
      .setImage(process.env.IMAGE_LINK)
      .setFooter(`Total: ${total} bonk${total > 1 ? "s" : ""}.`);

    if (interaction.options.getUser("user")) {
      const user = interaction.options.getUser("user");
      const personal = (parseInt(await db.bonks.get(user.id)) || 0) + 1;

      try {
        await db.bonks.set(user.id, personal);
      } catch (error) {
        console.error(error);
      }

      const guildUser = await interaction.guild.members.fetch(user.id);
      embed.setTitle(`${guildUser.nickname || user.username} has been bonked!`);
      embed.setDescription(
        `They have been bonked ${personal} time${personal > 1 ? "s" : ""}.`
      );
    } else {
      embed.setTitle("You have been bonked!");
    }

    interaction.reply({ embeds: [embed] });
  },
};
