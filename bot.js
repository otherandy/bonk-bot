if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const fs = require("fs");
const path = require("path");

const Discord = require("discord.js");
const Keyv = require("keyv");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "./commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.resolve(__dirname, `./commands/${file}`));
  client.commands.set(command.name, command);
}

const bonks = new Keyv(process.env.REDIS_URL);

bonks.on("error", (err) => console.error("Keyv connection error:", err));

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
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (command.owner && message.author.id !== process.env.OWNER_ID) {
    return message.reply("you don't have permission to do that.");
  }

  try {
    command.execute(message, args, bonks);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command.");
  }
});

client.login(process.env.TOKEN);

if (process.env.NODE_ENV === "production") {
  const express = require("express");
  const app = express();
  const port = 3000;
  const wakeUpDyno = require(path.resolve(__dirname, "wokeDyno.js"));

  app.get("/", async (req, res) => {
    const count = await bonks.get("total");
    res.send(
      `There ha${count == 1 ? "s" : "ve"} been ${count} bonk${
        count > 1 ? "s" : ""
      } so far.`
    );
  });

  app.listen(port, () => {
    console.log("Express listening.");
    wakeUpDyno(process.env.DYNO_URL);
  });
}
