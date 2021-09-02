const data = new SlashCommandBuilder()
	.setName('activity')
    .setDescription('Pogsters')
    .addChannelOption(option => option.setName('channel').setDescription('The VC TO START THE ACTIVITY IN'))
    .addStringOption(option => option.setName('activity').setDescription('The activity '))// you need to add activity options 
    //they should return bet , poker , yt , fish , chess