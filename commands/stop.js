const { MessageEmbed: Embed } = require("discord.js");
exports.run = async (message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send("You should join a voice channel before using this command!");
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
  if (!queue)
    return message.channel.send("What should I stop :(? No song is being played in the vc rn");
  message.react("✅");
  queue.songs = [];
  queue.connection.dispatcher.end("I have stopped the music ");
};
