const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edittag')
        .setDescription('Edit tag in database')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name to be edited')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('New description')
                .setRequired(true)),
    async execute(interaction) {
        const Tags = interaction.client.tags;
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
        const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

        if (affectedRows > 0) {
            return interaction.reply(`Tag ${tagName} was edited.`);
        }

        return interaction.reply(`Could not find a tag with name ${tagName}.`);
    },
};