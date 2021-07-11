const { MessageEmbed: Embed } = require("discord.js");
exports.run = async (message, args) => {
  const { client, guild, channel, member } = message;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel)
    return channel.send(
      new Embed()
        .setDescription("You should join a voice channel before using this command!")
        .setColor("RED")
    );

  const queue = client.queue.get(guild.id);

  if (queue && voiceChannel !== guild.me.voice.channel) {
    return channel.send(
      new Embed()
        .setDescription(
          "Hey, you should be on the same voice channel as me to do that. You want the universe to explode?"
        )
        .setColor("ORANGE")
    );
  }

  if (!queue) {
    return channel.send(
      new Embed()
        .setDescription("Do you think you are funny? There is nothing to change the volume!")
        .setColor("RED")
    );
  }

  if (!args[0])
    return channel.send(
      new Embed()
        .setDescription(`The current volume is set to: \`${queue.volume}%\``)
        .setColor("RANDOM")
    );

  const amount = parseInt(args[0]);
  if (isNaN(amount)) {
    return message.reply(
      new Embed().setDescription("That doesn't seem to be a number.").setColor("RED")
    );
  } else if (amount < 1 || amount > 100) {
    return channel.send(
      new Embed()
        .setDescription("Provide a value for volume between **1 - 100**")
        .setColor("ORANGE")
    );
  }

  queue.volume = amount;
  queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
  channel.send(
    new Embed().setDescription(`Volume is set to: \`${queue.volume}%\``).setColor("GREEN")
  );
};
