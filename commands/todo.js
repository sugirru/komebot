const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Todo manager')
        .addSubcommand(subcommand =>
            subcommand
                .setName('options')
                .setDescription('See possible actions'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List existing todos')),
    async execute(interaction) {
        // const Todos = interaction.client.todos;

        if (interaction.options._subcommand === 'options') {
            const Buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('newTodoButton')
                        .setLabel('New Todo')
                        .setStyle(ButtonStyle.Primary),
                );

            const message = await interaction.reply({ components: [Buttons], ephemeral: true });
            const collector = await message.createMessageComponentCollector();
            setTimeout(() => interaction.deleteReply(), 10000);

            collector.on('collect', async i => {
                if (i.customId === 'newTodoButton') {
                    // Create modal to be shown to user
                    const modal = new ModalBuilder()
                        .setCustomId('newTodoModal')
                        .setTitle('New Todo');

                    // Create inputs for the user
                    const nameInput = new TextInputBuilder()
                        .setCustomId('todoNameInput')
                        .setLabel('Todo Name')
                        .setStyle(TextInputStyle.Short);
                    const descriptionInput = new TextInputBuilder()
                        .setCustomId('todoDescriptionInput')
                        .setLabel('Todo Description (Optional)')
                        .setStyle(TextInputStyle.Short);

                    // Create Action Rows for the inputs
                    const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
                    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);

                    // Add all inputs to modal
                    modal.addComponents(firstActionRow, secondActionRow);

                    // Show the modal to the user
                    await i.showModal(modal);

                    // // 5 minute timeout for command
                    // // Workaround as there is currently no way to determine if user cancelled modal
                    // setTimeout(() => interaction.deleteReply(), 10000);
                }
            });
        } else if (interaction.options._subcommand === 'list') {
            const Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Todos')
                .addFields({ name: 'field', value: 'test' });

            const Row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('button')
                        .setLabel('Button')
                        .setStyle(ButtonStyle.Primary),
                );

            // await interaction.reply({ embeds: [Embed], components: [Row], ephemeral: true });
            const message = await interaction.reply({ embeds: [Embed], components: [Row], ephemeral: true });
            const collector = await message.createMessageComponentCollector();
            setTimeout(() => interaction.deleteReply(), 10000);

            collector.on('collect', async i => {
                if (i.customId === 'button') {
                    await i.update('pressed button');
                }
            });
        }

    },
};