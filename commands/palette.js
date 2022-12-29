const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createPaletteImage } = require('../utils/generate-palette.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('palette')
        .setDescription('Display a random color palette')
        .addIntegerOption(option =>
            option
                .setName('number')
                .setDescription('Amount of colors to include (defaults to 5)')
                .setMinValue(1)
                .setMaxValue(5)),
    async execute(interaction) {
        const paletteSize = interaction.options.getInteger('number') ?? 5;
        const image = 'out' + (paletteSize - 1).toString() + '.png';
        const numWords = ['One', 'Two', 'Three', 'Four', 'Five'];
        const num = numWords[paletteSize - 1];


        const attachedFile = new AttachmentBuilder('./images/' + image);
        const hexValues = fs.readFileSync('./images/hexValues.txt', 'utf-8');
        const hexToShow = hexValues.split(',');
        let hexString = '';
        for (let i = 0; i < paletteSize; i++) {
            hexString = hexString.concat(hexToShow[i]);
            hexString = hexString.concat('\t');
        }

        // Create embed to send
        const paletteEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(num + ' Color Palette')
            .addFields(
                { name: 'Hex Values', value: hexString, inline: true },
            )
            .setImage('attachment://' + image);

        await interaction.reply({ embeds: [paletteEmbed], files: [attachedFile] });

        // Create new output image
        createPaletteImage();
    },
};