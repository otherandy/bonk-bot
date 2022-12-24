// Bonk bot - A bot for discord that lets you bonk the horny
// The main goal to count the total bonks
// Created by Andy

const dotenv = require("dotenv");
dotenv.config();

const fs = require("node:fs");
const path = require("node:path");

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

const DATABASE_URL = process.env.REDIS_URL;
const db = {};

db.info = new Keyv(DATABASE_URL, { namespace: "info" });
db.bonks = new Keyv(DATABASE_URL, { namespace: "bonks" });
db.admins = new Keyv(DATABASE_URL, { namespace: "admins" });

const error = (err) => console.error("Keyv connection error:", err);

db.info.on("error", error);
db.bonks.on("error", error);
db.admins.on("error", error);

client.once("ready", async () => {
  console.log("Discord ready!");
});

client.on("message", async (message) => {
  const prefix = "?";

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // split the message by whitespace
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

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
    command.execute(message, args, db);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command.");
  }
});

client.login(process.env.DISCORD_TOKEN);
