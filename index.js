const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const { Player, AudioFilters } = require("discord-player");
const wait = require("util").promisify(setTimeout);
const db = require("quick.db");

const config = require("./config.json");

const player = new Player(client);

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
  }),
 lcc.send("Evolution")
);
client.once("ready", () => {
  console.log("I'm ready !");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const lc = db.get(`logschannel_${interaction.guild.id}`);
  let lcc = interaction.guild.channels.cache.get(lc) // gets the level channel


  if (interaction.commandName == "play") {
    await interaction.deferReply();
    
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
      },
    });

    // verify vc connection
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.editReply({
        content: "Could not join your voice channel!",
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
        content: `❌ | Track **${query}** not found!`,
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
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.destroy();
      return interaction.reply(`:white_check_mark: | - Music stopped !`);
    }
  } else if (interaction.commandName == "ping") {
    interaction.reply(` - Pong!`);
  } else if (interaction.commandName == "volume") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );
    let volume = interaction.options.getInteger("volume");
    if (queue) {
      await queue.setVolume(volume);
      return interaction.reply(
        `:white_check_mark: | - Volume set to ${volume} !`
      );
    }
  } else if (interaction.commandName == "shuffle") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.shuffle();
      return interaction.reply(`:white_check_mark: | - Queue shuffled !`);
    }
  } else if (interaction.commandName == "queue") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      let queueEmbed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`🎶 | Queue`)
        .setDescription(
          `Now Playing - ${queue.tracks[0]}` +
          ` ${queue.tracks
            .map((song, index) => `**${index + 1}** - **${song.title}**`)
            .join("\n")}`
        )
        .addField('Progress Bar', queue.createProgressBar({ queue: true }))
        .setFooter(
          `© Musico 2021| Made By Whirl#0021`
        );
      return interaction.reply({ embeds: [queueEmbed] });
    }
  } else if (interaction.commandName == "skip") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      await queue.skip();
      return interaction.reply(`:white_check_mark: | - Song skipped !`);
    }
  } else if (interaction.commandName == "filter") {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);
    const filter = interaction.options.getString("filter");
    if (filter == "8d") {
      queue.setFilters({ "8D": true });
      await interaction.reply(`:white_check_mark: | - 8D filter enabled !`);
    }
    if (filter == "karok") {
      queue.setFilters({ karoke: true });
      await interaction.reply(`:white_check_mark: | - Karoke filter enabled !`);
    }
    if (filter == "rev") {
      queue.setFilters({ reverse: true });
      await interaction.reply(
        `:white_check_mark: | - Reverse filter enabled !`
      );
    }
    if (filter == "ear") {
      queue.setFilters({ earrape: true });
      await interaction.reply(
        `:white_check_mark: | - Earrape filter enabled !`
      );
    }
    if (filter == "chor") {
      queue.setFilters({ chorus: true });
      await interaction.reply(`:white_check_mark: | - Chorus filter enabled !`);
    }
    if (filter == "mon") {
      queue.setFilters({ mono: true });
      await interaction.reply(`:white_check_mark: | - Mono filter enabled !`);
    }
  }
  else if (interaction.commandName == 'help') {
    const help = new MessageEmbed()
      .setColor(`RANDOM`)
      .setTitle(`📖 | Help`)
      .setDescription("**Here are all my commands**\n" + `play , pause , stop , skip , filter , set ,volume , queue , resume , nowplaying , savesong , ping , eval , invite `)
    interaction.reply({ embeds: [help] });
  }
  else if (interaction.commandName == 'nowplaying') {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      

      const embed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle('🎶 | Now Playing')
        .setDescription(queue.nowPlaying().title)
        .setThumbnail(queue.nowPlaying().thumbnail)
        .addFields(
          { name: 'Uploader', value: queue.nowPlaying().author, inline: true },
          { name: 'Duration', value: queue.nowPlaying().duration + "s", inline: true },
          { name: 'Requested By', value: queue.nowPlaying().requestedBy.username, inline: true },
          { name: 'Views', value: queue.nowPlaying().views.toString(), inline: true },
          { name: 'Progress Bar', value: queue.createProgressBar({ timecodes: true }) },

      
        )

        .setFooter("© 2021 Musico | Made by Whirl#0021");
      interaction.reply({ embeds: [embed] });
      
    }
  }
  else if (interaction.commandName == 'clearqueue') {
    if (!interaction.member.voice.channel)
      return interaction.channel.send(
        `:x: | - You're not in a voice channel !`
      );

    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
      interaction.guild.me.voice.channel.id
    )
      return interaction.channel.send(
        `:x: | - You are not in the same voice channel !`
      );

    const queue = player.getQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply(
        `:x: | - There is no music playing  in this guild !`
      );

    if (queue) {
      queue.clear();
      return interaction.reply(`:white_check_mark: | - Queue cleared !`);
    }
  }
  /*
  Handling and logging events 
  
  */
  else if (interaction.commandName == 'set') {
    if (interaction.options.getSubcommand() === 'logs_channel') {
      const channel = interaction.options.getChannel('channel');
      if (channel.type !== 'GUILD_TEXT') {
        return interaction.reply("The chosen channel must be a text channel ")
      }
      if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) { return interaction.reply("You don't have the permission to manage the guild") }
      try {
        await db.set(`logschannel_${interaction.guild.id}`, channel.id)
        interaction.reply(`:white_check_mark: | - Logs channel set to ${channel.name}`);
      }
      catch { interaction.reply(`:x: | - An error occured !`) }
    }
  }

});

client.login(config.token);
