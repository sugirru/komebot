const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { generateEmbeds } = require('../utils/generate-embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Todo manager'),
    async execute(interaction) {
        // GET TODOS DATABASE
        const Todos = interaction.client.todos;

        // Create variable to track current page
        let page = 0;

        // CREATE BUTTONS BELOW EMBED
        const Buttons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prevPage')
                    .setLabel('<')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('refreshEmbed')
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Success),
            );
        const Buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('newTodoButton')
                    .setLabel('New Task')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('toggleTodos')
                    .setLabel('Toggle Task')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('deleteTodos')
                    .setLabel('Delete Task')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('deleteAllTodos')
                    .setLabel('Delete All')
                    .setStyle(ButtonStyle.Danger),
            );

        // START CREATING EMBEDS
        let TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
        let userTodos = eval(JSON.stringify(TodoList));
        let embedArray = generateEmbeds(TodoList, userTodos);

        // SEND MESSAGE
        const message = await interaction.reply({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
        const collector = await message.createMessageComponentCollector();
        setTimeout(() => interaction.deleteReply(), 60000);

        // COLLECTOR FOR BUTTONS COMPONENT IN MESSAGE
        collector.on('collect', async i => {
            if (i.customId === 'newTodoButton') {
                // Create modal to be shown to user
                const modal = new ModalBuilder()
                    .setCustomId('newTodoModal')
                    .setTitle('New Task');

                // Create inputs for the user
                const nameInput = new TextInputBuilder()
                    .setCustomId('todoNameInput')
                    .setLabel('Header')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);
                const descriptionInput = new TextInputBuilder()
                    .setCustomId('todoDescriptionInput')
                    .setLabel('Task')
                    .setStyle(TextInputStyle.Short);

                // Create Action Rows for the inputs
                const firstActionRow = new ActionRowBuilder().addComponents(descriptionInput);
                const secondActionRow = new ActionRowBuilder().addComponents(nameInput);

                // Add all inputs to modal
                modal.addComponents(firstActionRow, secondActionRow);

                // Show the modal to the user
                await i.showModal(modal);
            } else if (i.customId === 'deleteAllTodos') {
                const rowCount = await Todos.destroy({ where: { userid: i.user.id } });
                // Check if there were todo rows to delete and reply with the appropriate message
                if (!rowCount) {
                    await i.reply({ content: 'No tasks to delete!', ephemeral: true });
                    setTimeout(() => i.deleteReply(), 10000);
                } else {
                    await i.reply({ content: 'Deleted all tasks!', ephemeral: true });
                    setTimeout(() => i.deleteReply(), 10000);
                }
            } else if (i.customId === 'prevPage') {
                if (page > 0) {
                    page -= 1;
                    await i.update({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
                } else {
                    await i.update({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
                }
            } else if (i.customId === 'nextPage') {
                if (page < embedArray.length - 1) {
                    page += 1;
                    await i.update({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
                } else {
                    await i.update({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
                }
            } else if (i.customId === 'deleteTodos') {
                // Create modal to be shown to user
                const modal = new ModalBuilder()
                    .setCustomId('deleteTodoModal')
                    .setTitle('Delete Tasks');

                // Create input for the user
                const deleteInput = new TextInputBuilder()
                    .setCustomId('todosToDelete')
                    .setLabel('Comma separated (e.g. "1,4,5")')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const actionRow = new ActionRowBuilder().addComponents(deleteInput);
                modal.addComponents(actionRow);

                // Show the modal to the user
                await i.showModal(modal);
            } else if (i.customId === 'toggleTodos') {
                // Create modal to be shown to user
                const modal = new ModalBuilder()
                    .setCustomId('toggleTodoModal')
                    .setTitle('Toggle Tasks');

                // Create input for the user
                const toggleInput = new TextInputBuilder()
                    .setCustomId('todosToToggle')
                    .setLabel('Comma separated (e.g. "1,4,5")')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const actionRow = new ActionRowBuilder().addComponents(toggleInput);
                modal.addComponents(actionRow);

                // Show the modal to the user
                await i.showModal(modal);
            } else if (i.customId === 'refreshEmbed') {
                TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
                userTodos = eval(JSON.stringify(TodoList));
                embedArray = generateEmbeds(TodoList, userTodos);

                page = 0;

                await i.update({ embeds: [embedArray[page]], components: [Buttons1, Buttons2], ephemeral: true });
            }
        });
    },
};