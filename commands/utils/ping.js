const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pings the client and returns bot latency.'),
    async execute(interaction) {
        await interaction.reply(`\`${interaction.client.ws.ping}ms\``);
    }
}