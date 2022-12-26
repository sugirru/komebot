const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Use todo list')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new todo'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List existing todos')),
    async execute(interaction) {
        const Todos = interaction.client.todos;

        if (interaction.options._subcommand === 'add') {
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
            await interaction.showModal(modal);
        } else if (interaction.options._subcommand === 'list') {
            const todosList = await Todos.findAll({ where: { userid: interaction.user.id } });
            console.log(JSON.stringify(todosList, null, 2)); // DEBUG
            await interaction.reply('list'); // PLACEHOLDER
            setTimeout(() => interaction.deleteReply(), 5000);
        }
    },
};