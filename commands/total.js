module.exports = {
  name: "total",
  description: "Prints out the total count",
  async execute(message, args, db) {
    message.channel.send(`Total bonks: ${await db.info.get("total")}.`);
  },
};
