module.exports.run = (client) => {
  console.log("Musico is ready to go! Pog");
  client.user.setPresence({ activity: { name: `${client.config.prefix}help` }, status: "dnd" });
};
