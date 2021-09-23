module.exports = {
  name: "reset",
  description: "Resets the count",
  owner: true,
  async execute(message, args, db) {
    const count = args.length ? args[0] : 0;
    await db.info.set("total", count);
    message.channel.send(`Set bonks to ${count}!`);
  },
};
