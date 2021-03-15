const Discord = require("discord.js");
const Keyv = require("keyv");

const client = new Discord.Client();
const keyv = new Keyv(process.env.REDIS_URL);

keyv.on("error", (err) => console.error("Keyv connection error:", err));

client.once("ready", async () => {
  console.log("Ready!");
  await
});

client.on("message", async (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "bonk") {
    const count = (await keyv.get("bonk")) + 1;
    if (count == NaN) count = 1;
    await keyv.set("bonk", count);

    const embed = new Discord.MessageEmbed()
      .setDescription(
        "                              ☆　　☆　　  ☆\n\
      ∧,,∧　　　＼　 │　 ／\n\
   (；`・ω・）　　　BONK！！\n\
   /　　 ｏ━━ヽニニフ──☆\n\
  しー- Ｊ　　ヾ( ﾟдﾟ)ﾉ゛"
      )
      .setFooter(`There has been ${count} bonk${count > 1 ? "s" : ""} so far.`);

    if (message.mentions.users.size) {
      const user = message.mentions.users.first();
      embed.setTitle(`${user.username} has been bonked!`);
    }

    message.channel.send(embed);
  }
});

client.login(process.env.TOKEN);
