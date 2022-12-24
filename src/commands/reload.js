const path = require("path");

module.exports = {
  name: "reload",
  description: "Reloads a command",
  args: true,
  execute(message, args) {
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`
      );
    }

    const commandPath = path.resolve(__dirname, `./${command.name}.js`);

    delete require.cache[require.resolve(commandPath)];

    try {
      const newCommand = require(commandPath);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
