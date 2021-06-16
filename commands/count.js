module.exports = {
  name: "count",
  description: "Prints out the total count",
  owner: true,
  async execute(message, args, keyv) {
    // TODO: throw error if keyv is down
    message.channel.send(`Total bonks: ${await keyv.get("total")}.`);
  },
};
