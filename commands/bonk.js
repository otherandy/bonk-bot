const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bonk",
  description: "Bonk!",
  async execute(message, args, keyv) {
    // TODO: throw error if keyv is down
    const count = parseInt(await keyv.get("total")) + 1;
    if (count == NaN) count = 1;
    await keyv.set("total", count);

    const embed = new MessageEmbed()
      .setDescription(
        "                              ☆　　☆　　  ☆\n\
      ∧,,∧　　　＼　 │　 ／\n\
   (；`・ω・）　　　BONK！！\n\
   /　　 ｏ━━ヽニニフ──☆\n\
  しー- Ｊ　　ヾ( ﾟдﾟ)ﾉ゛"
      )
      .setFooter(
        `There ha${count == 1 ? "s" : "ve"} been ${count} bonk${
          count > 1 ? "s" : ""
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
