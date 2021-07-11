const { MessageEmbed: Embed } = require("discord.js");

exports.run = async (message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Sorry, but I don't want to tell you what song your friend is playing without you joining a voice channel."
    );
  let queue = message.client.queue.get(message.guild.id);
  if (!queue) {
    return message.channel.send(
      new Embed().setDescription("Bruh. No song is playing right now").setColor("RED")
    );
  }

  message.channel.send(
    new Embed()
      .setTitle("Now Playing")
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`[${queue.songs[0].title}](${queue.songs[0].url})`)
      .addFields(
        { name: "Requested by", value: queue.songs[0].requester, inline: true },
        { name: "Duration", value: queue.songs[0].duration, inline: true }
      )
      .setColor("YELLOW")
      .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
      .setTimestamp()
  );
};
