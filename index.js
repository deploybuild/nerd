const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`${readyClient.user.tag} is online, and ready to go.`);
});

client.commands = new Collection();

// Returns the folder path, and then reads the contents of, the commands folder.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// For every subfolder in the commands folder, read and then handle each command within the subfolder.
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn('The \'data\' and/or \'execute\' properties could not be found.');
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`The command at ${interaction.commandName} does not exist.`);
        return;
    }

    try {
        await command.execute(interaction)
    } catch(error) {
        console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'An error executing this command has occurred.',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'An error executing this command has occurred.',
				flags: MessageFlags.Ephemeral,
			});
		}
    }
});

client.login(token);