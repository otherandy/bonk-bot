const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bonk",
  description: "Bonk!",
  async execute(message, args, db) {
    const total = parseInt((await db.info.get("total")) || 0) + 1;
    await db.info.set("total", total);

    const embed = new MessageEmbed()
    .setDescription(
      "                              ☆　　☆　　  ☆\n\
    ∧,,∧　　　＼　 │　 ／\n\
 (；`・ω・）　　　BONK！！\n\
 /　　 ｏ━━ヽニニフ──☆\n\
しー- Ｊ　　ヾ( ﾟдﾟ)ﾉ゛"
    )
      .setFooter(
        `There ha${total == 1 ? "s" : "ve"} been ${total} bonk${
          total > 1 ? "s" : ""
        } so far.`
      )
      .setColor("GREEN");

    // TODO: Add individial count
    // if (message.mentions.users.size) {
    //   const user = message.mentions.users.first();
    //   embed.setTitle(`${user.username} has been bonked!`);

    //   await keyv.set(user.id, parseInt(await keyv.get(user.id)) + 1);
    // }

    message.channel.send(embed);
  },
};
