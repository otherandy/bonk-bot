const Discord = require("discord.js");
const Keyv = require("keyv");
const express = require("express");
const path = require("path");

const client = new Discord.Client();
const keyv = new Keyv(process.env.REDIS_URL);
const app = express();

keyv.on("error", (err) => console.error("Keyv connection error:", err));

client.once("ready", async () => {
  console.log("Discord ready!");
});

client.on("message", async (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/);
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
      .setFooter(`There has been ${count} bonk${count > 1 ? "s" : ""} so far.`)
      .setColor(process.env.EMBED_COLOR);

    if (message.mentions.users.size) {
      const user = message.mentions.users.first();
      embed.setTitle(`${user.username} has been bonked!`);
    }

    message.channel.send(embed);
  } else if (
    command === "reset" &&
    message.author.id === process.env.ADMIN_ID
  ) {
    await keyv.set("bonk", 0);
    message.channel.send("Set bonks back to 0!");
  }
});

client.login(process.env.TOKEN);

app.get("/", async (req, res) => {
  const count = await keyv.get("bonk");
  res.send(`There has been ${count} bonk${count > 1 ? "s" : ""} so far.`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Express listening.");
});
