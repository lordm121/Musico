const ytdl = require("ytdl-core-discord");
const { Client } = require("youtubei");
const youtube = new Client();
const { timeFormat } = require("../timeFormat");
const { MessageEmbed: Embed, Message } = require("discord.js");

/**
 * @param {Message} message
 * @param {String} args
 */
exports.run = async (message, args) => {
  const { client, channel, guild, member, author } = message;
  if (!args[0]) return channel.send("You didn't provide a song to play!");
  let voiceChannel = member.voice.channel;
  if (!channel) return channel.send("You need to join a voice channel to play a music!");

  if (!voiceChannel.permissionsFor(client.user).has("CONNECT"))
    return channel.send("I don't have permission to join the voice channel");
  if (!voiceChannel.permissionsFor(client.user).has("SPEAK"))
    return channel.send("I don't have permission to speak in the voice channel");

  const serverQueue = client.queue.get(guild.id);
  let video = await youtube.findOne(args.join(" "), { type: "video" });
  if (!video) return message.reply("No results found ):");

  const url = `https://youtube.com/watch?v=${video.id}`;
  const song = {
    id: video.id,
    title: video.title,
    url: url,
    duration: timeFormat(video.duration),
    thumbnail: video.thumbnails.best,
    upload: video.uploadDate,
    views: video.viewCount,
    requester: author,
    channel: video.channel.name,
    channelurl: video.channel.url,
  };

  if (serverQueue) {
    serverQueue.songs.push(song);
    let embed = new Embed()
      .setTitle("Added to queue!")
      .setColor("#00fff1")
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.title}](${song.url})`)
      .addField("Requested By", song.requester, true)
      .addField("Duration", song.duration, true)
      .addField("Views", song.views, true)
      .setFooter(`Queue Position: ${serverQueue.songs.lastIndexOf(song) + 1}`);
    return channel.send(embed);
  }

  const queueConstruct = {
    textChannel: channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 100,
    playing: true,
  };
  client.queue.set(guild.id, queueConstruct);
  queueConstruct.songs.push(song);

  const play = async (song) => {
    const queue = client.queue.get(guild.id);
    if (!song) {
      client.queue.delete(guild.id);
      channel.send("There are no songs in queue, I'm leaving the voice channel!");
      setTimeout(() => queue.voiceChannel.leave(), 3000);
      return;
    }

    const dispatcher = queue.connection
      .play(
        await ytdl(`https://youtube.com/watch?v=${song.id}`, {
          filter: (format) => ["251"],
          highWaterMark: 1 << 25,
          opusEnconded: true,
        }),
        {
          type: "opus",
        }
      )
      .on("finish", () => {
        queue.songs.shift();
        play(queue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    let noiceEmbed = new Embed()
      .setTitle("Started Playing")
      .setColor("RANDOM")
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.title}](${song.url})`)
      .addField("Requested By", song.requester, true)
      .addField("Duration", song.duration, true)
      .addField("Views", song.views, true);
    queue.textChannel.send(noiceEmbed);
  };

  try {
    const connection = await voiceChannel.join();
    queueConstruct.connection = connection;
    play(queueConstruct.songs[0]);
  } catch (error) {
    console.error(`I could not join the voice channel`);
    client.queue.delete(guild.id);
    await voiceChannel.leave();
    return channel.send(`I could not join the voice channel: ${error}`);
  }
};
