const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// Returns the folder path, and then reads the contents of, the commands folder.
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

// For every subfolder in the commands folder, validate each command in the subfolder and add them to the commands collection.
for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
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

// Loops through the event folder checking for event files, if a valid event file is found, start listening for the event.
const eventFolderPath = path.join(__dirname, 'events');
const eventsFolder = fs.readdirSync(eventFolderPath).filter((file) => file.endsWith('.js'));

for (file of eventsFolder) {
    const filePath = path.join(eventFolderPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);