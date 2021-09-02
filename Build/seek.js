const data = new SlashCommandBuilder()
	.setName('seek')
    .setDescription('Seek to the specific time in track')
    .addIntegerOption(option => option.setName('time').setDescription('The time to skip to'))