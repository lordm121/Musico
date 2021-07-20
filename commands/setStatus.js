exports.run = async(client , message , args) => {
if(message.author.id === "808332105108553759"){//ur id here
client.user.setActivity(args[0], { type: args[1] });
message.channel.send("Done!").catch(console.error)}

}
