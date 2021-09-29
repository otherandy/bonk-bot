const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bonk",
  description: "Bonk!",
  async execute(message, args, db) {
    const total = (parseInt(await db.info.get("total")) || 0) + 1;
    await db.info.set("total", total);

    const embed = new MessageEmbed()
      .setAuthor("", message.author.defaultAvatarURL)
      .setImage(process.env.IMAGE_LINK)
      .setFooter(`Total: ${total} bonk${total > 1 ? "s" : ""}.`)
      .setColor("GREEN");

    if (message.mentions.users.size) {
      const user = message.mentions.users.first();
      const personal = (parseInt(await db.bonks.get(user.id)) || 0) + 1;
      await db.bonks.set(user.id, personal);

      const guildUser = message.guild.members.fetch(user.id);
      embed.setTitle(`${guildUser.nickname || user.username} has been bonked!`);
      embed.setDescription(
        `They have been bonked ${personal} time${personal == 1 ? "" : "s"}.`
      );
    }

    message.channel.send(embed);
  },
};
