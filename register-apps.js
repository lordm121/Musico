const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./musico.config.json');
let cid = config.client_id

let token = config.token
const rest = new REST({ version: '9' }).setToken(token);
const command =  {
    name: "add_to_queue",
    type: 3
};

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(cid),
                { body: [command] },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
})();
    /** Just so you know this only registers apps , you can use this to register your slash commands aswell however i would not be providing support for them , tho i might add the builder versions of them*/