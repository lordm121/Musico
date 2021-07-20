const { MessageEmbed: Embed } = require("discord.js");

exports.run = async (message) => {
  message.channel.send(
    new Embed()
      .setAuthor("Help Command", message.client.user.avatarURL())
      .setThumbnail(message.guild.iconURL())
      .addFields(
        {
          name: "Music",
          value: "`play`, `nowplaying`, `lyrics`, `pause`, `volume`, `resume`, `skip`, `stop` ,`jumble`",
        },
        { name: "Other", value: " `ping`" },
        { name: "Developer", value: "`eval`, `setStatus`" }
        
      )
      .setColor("#4d4dff")
      .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }) )
      .setTimestamp()
  );
};
