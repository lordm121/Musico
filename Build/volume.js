const data = new SlashCommandBuilder()
	.setName('volume')
    .setDescription('Set the volume')
    .addIntegerOption(option => option.setName('volume').setDescription('The volume between 1-100'))