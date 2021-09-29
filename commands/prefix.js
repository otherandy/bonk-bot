module.exports = {
  name: "prefix",
  description: "Sets a prefix for the bot",
  guildOnly: true,
  args: true,
  owner: true,
  async execute(message, args, db) {
    const prefix = args[0];
    await db.prefixes.set(message.guild.id, prefix);
    message.channel.send(`Succesfully set prefix to \`${prefix}\`.`);
  },
};
