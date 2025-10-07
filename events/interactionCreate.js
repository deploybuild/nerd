const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
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
    },
};