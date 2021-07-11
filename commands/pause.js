const { MessageEmbed: Embed } = require("discord.js");

exports.run = async (message) => {
  const channel = message.member.voice.channel;
  if (!channel) return message.channel.send("Join a vc to pause it's music dumbo.");
  let queue = message.client.queue.get(message.guild.id);
  if (queue && channel !== message.guild.me.voice.channel) {
    return channel.send(
      new Embed()
        .setDescription(
          "Hey, you should be on the same voice channel as me to do that. You want the universe to explode?"
        )
        .setColor("ORANGE")
    );
  }

  if (!queue) {
    return message.channel.send(
      new Embed().setDescription("What're you trying to pause?").setColor("ORANGE")
    );
  }

  if (queue.connection.dispatcher.paused) {
    return message.channel.send("The music is already paused!");
  }
  message.react("⏸");
  message.channel.send("Music Paused!").then((msg) => msg.delete({ timeout: 3000 }));
  queue.connection.dispatcher.pause();
};
