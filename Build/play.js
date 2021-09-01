const data = new SlashCommandBuilder()
	.setName("play")
	.setDescription("Play a track in a voice channel")
	.addStringOption((option) =>
		option.setName("song").setDescription("The song to play")
	);
