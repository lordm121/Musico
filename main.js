/*
*@info
 *@license [MIT]
 MIT License

Copyright (c) 2021 Whirl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*@author Whirl

*/

const {
  Client,
  Intents,
  MessageEmbed,
  Permissions: DJSPermissions,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const client = new Client({
  //since we can now directly import the client class in djs v13 i did that
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const chalk = require("chalk");
const { Player, AudioFilters } = require("discord-player");
const wait = require("util").promisify(setTimeout);

const { Lyrics } = require("@discord-player/extractor");
const lyricsFinder = Lyrics.init();

const config = require("./musico.config.json");
if (!config.token) {
  console.log(chalk.red("[ERROR] | No token found in config.json"));
  process.exit(1);
}

const player = new Player(client);
/*
Trim function
*/
const trim = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;
  //AS the play even is when the song actually starts playing and not the command we send this embed
player.on("trackStart", (queue, track) =>
  queue.metadata.channel.send({
    embeds: [
      new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`Now Playing`)
        .setDescription(`**${track.title}**`)
        .setThumbnail(track.thumbnail)
        .addField(`Duration`, `${track.duration}s`, true)
        .addField(`Requested By`, `${track.requestedBy.username}`, true)
        .addField(`Views`, track.views.toString(), true)
        .addField(`URL`, `**[Click Here](${track.url})**`)
        .addField(`ARTIST`, track.author, true)
        .setFooter(`© ${client.user.username} | Made By Whirl#0021`),
    ],
  })
);
client.once("ready", () => {
  console.clear();
  console.log(chalk.yellowBright.bold(`
  ███╗   ███╗██╗   ██╗███████╗██╗ ██████╗ ██████╗                               
  ████╗ ████║██║   ██║██╔════╝██║██╔════╝██╔═══██╗                              
  ██╔████╔██║██║   ██║███████╗██║██║     ██║   ██║                              
  ██║╚██╔╝██║██║   ██║╚════██║██║██║     ██║   ██║                              
  ██║ ╚═╝ ██║╚██████╔╝███████║██║╚██████╗╚██████╔╝                              
  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝ ╚═════╝                               
                                                                                
                      ██████╗ ██╗   ██╗    ██╗    ██╗██╗  ██╗██╗██████╗ ██╗     
                      ██╔══██╗╚██╗ ██╔╝    ██║    ██║██║  ██║██║██╔══██╗██║     
                      ██████╔╝ ╚████╔╝     ██║ █╗ ██║███████║██║██████╔╝██║     
                      ██╔══██╗  ╚██╔╝      ██║███╗██║██╔══██║██║██╔══██╗██║     
                      ██████╔╝   ██║       ╚███╔███╔╝██║  ██║██║██║  ██║███████╗
                      ╚═════╝    ╚═╝        ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
                                                                                
  `));
  
  console.log(chalk.green.bold(`[Musico] | Logged in as ${client.user.tag}!`));
  console.log(chalk.yellow.bold(`[Musico] | Servers! ["${client.guilds.cache.size}"]`));
  console.log(chalk.red.bold(`[Musico] | Users! ["${client.users.cache.size}"]`));
  console.log(chalk.cyan.bold(`[Musico] | Channels! ["${client.channels.cache.size}"]`));
});
//when the queue ends
player.on("queueEnd", (queue) => {
  queue.metadata.channel.send(
    `🚶‍♂️ | I left the voice channel , this might be because i was manually disconnected  or the queue ended or an error occured `
  );
});

client.on("interactionCreate", async (interaction) => {
  

  if (interaction.commandName == "play") {
    await interaction.deferReply();
    if (
      !interaction.guild.me.permissions.has([
        DJSPermissions.FLAGS.CONNECT,
        DJSPermissions.FLAGS.SPEAK,
      ])
    ) {
      return interaction.reply(
        `${config.error_emoji} | I don't have permissions to join a voice channel and play music in this guild please try to re-invite me`
      );
    }
    if (!interaction.member.voice.channelId)
      return await interaction.editReply({
        content: "You are not in a voice channel!",
        empheral: true,
      });
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.editReply({
        content: "You are not in my voice channel!",
        empheral: true,
      });
    const query = interaction.options.getString("song");
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        int: interaction,
      },
    });

    // verify vc connection
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.editReply({
        content: `${config.error_emoji} | Could not join your voice channel!`,
        empheral: true,
      });
    }

    const track = await player
      .search(query, {
        requestedBy: interaction.member,
      })
      .then((x) => x.tracks[1]);
    if (!track)
      return await interaction.editReply({
        content: `${config.error_emoji} | Track **${query}** not found!`,
      });

    queue.play(track);
    const playEmbed = new MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`🎶 | New Song Added to queue`)

      .setThumbnail(track.thumbnail)
      .setDescription(`${track.title}`)

      .setFooter(
        `Requested by ${track.requestedBy.username} | Made By Whirl#0021`
      );

    await interaction.editReply({ embeds: [playEmbed], ephemeral: true });
  }
  if (interaction.commandName == "stop") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.destroy();
      return interaction.reply(`${config.success_emoji}: | - Music stopped !`);
    }
  } else if (interaction.commandName == "ping") {
    interaction.reply(` - Pong!`);
  } else if (interaction.commandName == "volume") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );
    let volume = interaction.options.getInteger("volume");
    if (queue) {
      await queue.setVolume(volume);
      return interaction.reply(
        `${config.success_emoji}: | - Volume set to ${volume} !`
      );
    }
  } else if (interaction.commandName == "shuffle") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.shuffle();
      return interaction.reply(`${config.success_emoji}: | - Queue shuffled !`);
    }
  } else if (interaction.commandName == "queue") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      let queueEmbed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`🎶 | Queue`)
        .setDescription(
          `Now Playing - ${queue.nowPlaying().title}` +
            ` ${queue.tracks
              .map((song, index) => `**${index + 1}** - **${song.title}**`)
              .join("\n")}`
        )
        .addField("Progress Bar", queue.createProgressBar({ queue: true }))
        .setFooter(`© ${config.bot_name} 2021| Made By Whirl#0021`);
      return interaction.reply({ embeds: [queueEmbed] });
    }
  } else if (interaction.commandName == "skip") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.skip();
      return interaction.reply(`${config.success_emoji}: | - Song skipped !`);
    }
  } else if (interaction.commandName == "filter") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);
    const filter = interaction.options.getString("filter");
    if (filter == "8d") {
      queue.setFilters({ "8D": true });
      await interaction.reply(
        `${config.success_emoji}: | - 8D filter enabled !`
      );
    }
    if (filter == "karok") {
      queue.setFilters({ karoke: true });
      await interaction.reply(
        `${config.success_emoji}: | - Karoke filter enabled !`
      );
    }
    if (filter == "rev") {
      queue.setFilters({ reverse: true });
      await interaction.reply(
        `${config.success_emoji}: | - Reverse filter enabled !`
      );
    }
    if (filter == "ear") {
      queue.setFilters({ earrape: true });
      await interaction.reply(
        `${config.success_emoji}: | - Earrape filter enabled !`
      );
    }
    if (filter == "chor") {
      queue.setFilters({ chorus: true });
      await interaction.reply(
        `${config.success_emoji}: | - Chorus filter enabled !`
      );
    }
    if (filter == "mon") {
      queue.setFilters({ mono: true });
      await interaction.reply(
        `${config.success_emoji}: | - Mono filter enabled !`
      );
    }
    if (filter == "bass") {
      queue.setFilters({ bassboost: true });
      await interaction.reply(
        `${config.success_emoji}: | - Bassboost filter enabled !`
      );
    }
  } else if (interaction.commandName == "help") {
    const help = new MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`📖 | Help`)
      .setDescription(
        "**Here are all my commands**\n" +
          "```play```  ```stop```  ```pause```  ```resume```  ```loop``` ```volume```  ```jump```  ```seek```  ```skip```  ```lyrics``` ```shuffle``` ```clearqueue``` ```filter```  ```nowplaying``` ```save``` ```back``` ```help```  ```eval``` ```activity```  ```invite```"
      )
      .setFooter(
        `© ${config.bot_name} 2021| Use **/** before each command | Made By Whirl#0021`
      );
    const kool = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Website")
        .setStyle("LINK")
        .setURL(config.website_url)
        .setEmoji(config.website_emoji_id),
      new MessageButton()
        .setLabel("Invite")
        .setStyle("LINK")
        .setURL(config.invite_link)
        .setEmoji(config.invite_emoji_id),
      new MessageButton()
        .setLabel("Github")
        .setStyle("LINK")
        .setURL(config.github_link)
        .setEmoji(config.github_emoji_id)
    );
    interaction.reply({ embeds: [help], components: [kool] });
  } else if (interaction.commandName == "nowplaying") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      const embed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle("🎶 | Now Playing")
        .setDescription(queue.nowPlaying().title)
        .setThumbnail(queue.nowPlaying().thumbnail)
        .addFields(
          { name: "Uploader", value: queue.nowPlaying().author, inline: true },
          {
            name: "Duration",
            value: queue.nowPlaying().duration + "s",
            inline: true,
          },
          {
            name: "Requested By",
            value: queue.nowPlaying().requestedBy.username,
            inline: true,
          },
          {
            name: "Views",
            value: queue.nowPlaying().views.toString(),
            inline: true,
          },
          {
            name: "Progress Bar",
            value: queue.createProgressBar({ timecodes: true }),
          }
        )

        .setFooter("© 2021 ${config.bot_name} | Made by Whirl#0021");
      interaction.reply({ embeds: [embed] });
    }
  } else if (interaction.commandName == "clearqueue") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      queue.clear();
      return interaction.reply(`${config.success_emoji}: | - Queue cleared !`);
    }
  } else if (interaction.commandName == "save") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      let embed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle("⏳ | Saved Song")
        .setDescription(queue.nowPlaying().title)
        .setThumbnail(queue.nowPlaying().thumbnail)
        .addFields(
          { name: "Uploader", value: queue.nowPlaying().author, inline: true },
          {
            name: "Duration",
            value: queue.nowPlaying().duration + "s",
            inline: true,
          },
          {
            name: "Requested By",
            value: queue.nowPlaying().requestedBy.username,
            inline: true,
          },
          {
            name: "Views",
            value: queue.nowPlaying().views.toString(),
            inline: true,
          },
          {
            name: "URL",
            value: `[Click Here](${queue.nowPlaying().url})`,
            inline: true,
          }
        )

        .setFooter(`© 2021 ${config.bot_name} | Made by Whirl#0021`);
      interaction.user.send({ embeds: [embed] }).catch(interaction.followUp("Could not dm you"))
      await interaction.reply(`${config.success_emoji}: | - Check your Dm's !`);
    }
  } else if (interaction.commandName == "seek") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      let time = interaction.options.getInteger("time") * 100;

      queue.seek(time);
      return interaction.reply(
        `${config.success_emoji}: | - Skipped to ${time} !`
      );
    }
  } else if (interaction.commandName == "pause") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      queue.setPaused({ paused: true });
      return interaction.reply(`${config.success_emoji}: | - Paused !`);
    }
  } else if (interaction.commandName == "resume") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      queue.setPaused(false);
      return interaction.reply(
        `${config.success_emoji}: | - Resumed the music!`
      );
    }
  } else if (interaction.commandName == "jump") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      let skit = interaction.options.getInteger("amount");
      queue.jump(skit).catch(() => {
        interaction.followUp("${config.error_emoji} | Not a valid position");
      });
      await interaction.reply(`Jumped to track number ${skit} of queue`);
    }
  } else if (interaction.commandName == "lyrics") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      interaction.deferReply();
      let song = queue.nowPlaying();
      let lyrics = await lyricsFinder.search(song.title);
      let x = trim(lyrics.lyrics, 1024).toString();
      let lyricsEmbed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`Lyrics for ${song.title}`)
        .setDescription(x ? x : "${config.error_emoji} | No lyrics found")
        .setFooter(`© ${config.bot_name} 2021 | Made By Whirl#0021`);
      await interaction.editReply({ embeds: [lyricsEmbed] });
    }
  } else if (interaction.commandName == "loop") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      let loop = interaction.options.getString("mode");
      await queue.setRepeatMode(loop);
      await interaction.reply(`${config.success_emoji}: | Set the loop mode`);
    }
  } else if (interaction.commandName == "back") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `${config.error_emoji} | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `${config.error_emoji} | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return interaction.reply(
        `${config.error_emoji} | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.back();
      await interaction.reply(
        `${config.success_emoji} | Playing the previous track `
      );
    }
  } else if (interaction.commandName == "activity") {
    const channel = interaction.options.getChannel("channel");
    const string = interaction.options.getString("activity");
    if (channel.type !== "GUILD_VOICE") {
      return interaction
        .reply("The chosen channel must be a voice channel ")
        .catch(console.error);
    }
    if (string == "yt") {
      client.discordTogether
        .createTogetherCode(channel.id, "youtube")
        .then(async (invite) => {
          return interaction.reply(
            `[**Click here to join YouTube Together**](${invite.code} "Join YouTube Together")`
          );
        });
    } else if (string == "poker") {
      client.discordTogether
        .createTogetherCode(channel.id, "poker")
        .then(async (invite) => {
          return interaction.reply(
            `[**Click here to join Poker Night**](${invite.code} "Join Poker Night")`
          );
        });
    } else if (string == "fish") {
      client.discordTogether
        .createTogetherCode(channel.id, "fishing")
        .then(async (invite) => {
          return interaction.reply(
            `[**Click here to join Fishington.io**](${invite.code} "Join fishington.io")`
          );
        });
    } else if (string == "bet") {
      client.discordTogether
        .createTogetherCode(channel.id, "betrayal")
        .then(async (invite) => {
          return interaction.reply(
            `[**Click here to join Betrayal.io**](${invite.code} "Join betrayal.io")`
          );
        });
    } else if (string == "chess") {
      client.discordTogether
        .createTogetherCode(channel.id, "chess")
        .then(async (invite) => {
          return interaction.reply(
            `[**Click here to join Chess**](${invite.code} "Join A game of Chess")`
          );
        });
    }
  } else if (interaction.commandName == "invite") {
    const lol = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite Me")
        .setStyle("LINK")
        .setURL(config.invite_link)
        .setEmoji(config.invite_emoji_id)
    );
    await interaction.reply({
      content: "Click Below To Invite me",
      components: [lol],
      ephemeral: true,
    });
  }
  else if (interaction.isContextMenu()) {
    interaction.deferReply();
    if (!interaction.member.voice.channel)
    return interaction.channel.editReply(
      `${config.error_emoji} | - You're not in a voice channel !`
    );

  if (
    interaction.guild.me.voice.channel &&
    interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
  )
    return interaction.channel.editReply(
      `${config.error_emoji} | - You are not in the same voice channel !`
    );

  const queue = player.getQueue(interaction.guild.id);

  if (!queue || !queue.playing)
    return interaction.editReply(
      `${config.error_emoji} | - There is no music playing  in this guild !`
    );

  if (queue) {
    let query = interaction.options.getMessage("message")
    const track = await player
    .search(query, {
      requestedBy: interaction.member,
    })
    .then((x) => x.tracks[1]);
  if (!track)
    return await interaction.editReply({
      content: `${config.error_emoji} | Track **${query}** not found!`,
    });

  queue.play(track);
  const playEmbed = new MessageEmbed()
    .setColor(`RANDOM`)
    .setTitle(`🎶 | New Song Added to queue`)

    .setThumbnail(track.thumbnail)
    .setDescription(`${track.title}`)

    .setFooter(
      `Requested by ${track.requestedBy.username} | Made By Whirl#0021`
    );

  await interaction.editReply({ embeds: [playEmbed], ephemeral: true });
  }
  }
  
});
client.on("guild_create", (guild) => {
  const channel = guild.channels.cache.find((c) => c.name.includes("general"));
  if (channel) {
    channel.send(config.guild_join_message);
  }
});
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content.includes(`<@876761541481992212>`) || message.content.includes(`<@!876761541481992212>`)) {
    message.reply(`I am slash commands only based! If you don't see them try inviting me again from https://musico.whirl.codes/invite`)
  }

})
client.login(config.token);
