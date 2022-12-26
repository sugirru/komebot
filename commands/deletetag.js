const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletetag')
        .setDescription('Delete tag from database')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name to be delete')
                .setRequired(true)),
    async execute(interaction) {
        const Tags = interaction.client.tags;
        const tagName = interaction.options.getString('name');

        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply('That tag doesn\'t exist.');

        return interaction.reply('Tag deleted.');
    },
};