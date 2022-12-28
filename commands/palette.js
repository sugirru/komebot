const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createPaletteImage } = require('../utils/generate-palette.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('palette')
        .setDescription('Display a random color palette'),
    async execute(interaction) {
        const attachedFile = new AttachmentBuilder('./images/out.png');
        const hexValues = require('../images/hexValues.json');

        // Create embed to send
        const paletteEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Five Color Palette')
            .addFields(
                { name: 'Hex Values', value: hexValues.hex[0] + '\t' + hexValues.hex[1] + '\t' + hexValues.hex[2] + '\t' + hexValues.hex[3] + '\t' + hexValues.hex[4] + '\t', inline: true },
            )
            .setImage('attachment://out.png');

        await interaction.reply({ embeds: [paletteEmbed], files: [attachedFile] });

        // Create new output image
        createPaletteImage();
    },
};