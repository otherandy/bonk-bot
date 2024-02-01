// Bonk bot - A bot for discord that lets you bonk the horny
// The main goal to count the total bonks
// Created by Andy

const dotenv = require("dotenv");
dotenv.config();

const { Events } = require("discord.js");
const client = require("./client");
const db = require("./db.js");

client.once("ready", async () => {
  console.log("Discord ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
