const { MessageEmbed: Embed } = require("discord.js");
//not my code :D
exports.run = async (message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send("You should join a voice channel before using this command!");
  const queue = message.client.queue.get(message.guild.id);

  if (queue && channel !== message.guild.me.voice.channel) {
    return channel.send(
      new Embed()
        .setDescription(
          "Hey, you should be on the same voice channel as me to do that. You want the universe to explode?"
        )
        .setColor("ORANGE")
    );
  }
  if (!queue) return message.reply("There is nothing in queue!");

  let status;
  let songs = 11;
  for (let i = 1; i < queue.songs.length; i += 10) {
    const current = queue.songs.slice(i++, songs);
    let j = i - 1;
    songs += 10;
    status = current
      .map((track) => `**${++j}.** ${track.title} | ${track.duration} | [${track.requester}]`)
      .join("\n");
  }

  let embed = new Embed()
    .setTitle("Queue")
    .setThumbnail(queue.songs[0].thumbnail)
    .setDescription(
      `**Current Song \n [${queue.songs[0].title}](${queue.songs[0].url}) | [${queue.songs[0].requester}]**`
    )
    .setColor("#00ff00")
    .setTimestamp();

  if (queue.songs[1]) {
    embed.description = `**Current Song \n [${queue.songs[0].title}](${queue.songs[0].url}) | [${queue.songs[0].requester}]**\n\n${status}`;
  }

  if (queue.songs.length > 10) embed.setFooter(`${queue.songs.length} songs in queue`);
  message.channel.send(embed);
};
