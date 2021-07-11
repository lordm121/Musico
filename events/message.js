const { Message } = require("discord.js");

/**
 * @param {Message} message
 */
module.exports.run = (message) => {
  const { client, content, author } = message;
  if (author.bot) return;

  if (!content.startsWith(client.config.prefix)) return;

  const args = content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  if (!cmd) return;

  try {
    cmd.run(message, args);
  } catch (error) {
    console.error(error);
  }
};
