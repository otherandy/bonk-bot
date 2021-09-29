module.exports = {
  name: "reset",
  description: "Resets the total",
  owner: true,
  async execute(message, args, db) {
    const total = args.length ? args[0] : 0;
    await db.info.set("total", parseInt(total));
    message.channel.send(`Set bonks to ${total}!`);
  },
};
