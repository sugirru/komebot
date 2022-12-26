const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showtags')
        .setDescription('Show tags in database'),
    async execute(interaction) {
        const Tags = interaction.client.tags;
        // equivalent to: SELECT name FROM tags;
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

        return interaction.reply(`List of tags: ${tagString}`);
    },
};