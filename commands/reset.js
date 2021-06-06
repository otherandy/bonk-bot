module.exports = {
  name: "reset",
  description: "Resets the count",
  owner: true,
  async execute(message, args, keyv) {
    const count = args.length ? args[0] : 0;
    await keyv.set("total", count);
    message.channel.send(`Set bonks to ${count}!`);
  },
};
