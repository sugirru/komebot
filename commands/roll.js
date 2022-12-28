const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a random number within range specified (default 6)')
        .addIntegerOption(option =>
            option
                .setName('range')
                .setDescription('Random number will be within 1 to specified range')
                .setMinValue(1)),
    async execute(interaction) {
        const min = 1;
        const max = interaction.options.getInteger('range') ?? 6;

        const rolledNumber = Math.floor(Math.random() * (max - min + 1) + min);

        await interaction.reply('**' + rolledNumber + '**');
    },
};