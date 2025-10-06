// This script will deploy commands for a specified test guild.

const { REST, Routes } = require('discord.js');
const { clientId, testGuildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

// Refer to index.js for an in-depth explanation of this code. Adds every command to an array for deployment.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn('The \'data\' and/or \'execute\' properties could not be found.');
        }
    }
}

console.log(commands);

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Deploying ${commands.length} application commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(clientId, testGuildId), { body: commands });

        console.log(`Deployed ${commands.length} application commands successfully.`);
    } catch (error) {
        console.error(`Caught: ${error}`);
    }
})();