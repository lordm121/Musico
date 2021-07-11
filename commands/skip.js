const { MessageEmbed: Embed } = require("discord.js");

exports.run = async (message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Did you just add never gonna give you up to your friends listening session? Join the vc to skip !"
    );
  let queue = message.client.queue.get(message.guild.id);
  if (!queue) {
    return message.channel.send("Imao , What do i skip too? There is no song in the queue");
  }

  if (queue && channel !== guild.me.voice.channel) {
    return channel.send(
      new Embed()
        .setDescription(
          "Hey, you should be on the same voice channel as me to do that. You want the universe to explode?"
        )
        .setColor("ORANGE")
    );
  }

  if (queue.songs.length !== 0) {
    message.react("✅");
    queue.connection.dispatcher.end("Skipped the current song ");
  }
};
