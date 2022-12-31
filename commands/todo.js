const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Todo manager'),
    async execute(interaction) {
        // GET TODOS DATABASE
        const Todos = interaction.client.todos;

        // CREATE BUTTONS BELOW EMBED
        const Buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('newTodoButton')
                    .setLabel('New Todo')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('deleteAllTodos')
                    .setLabel('Delete All')
                    .setStyle(ButtonStyle.Danger),
            );

        // START CREATING EMBEDS
        const TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
        const embedArray = [];
        if (TodoList.length != 0) {
            const userTodos = eval(JSON.stringify(TodoList));

            let pageTodos = [];
            let todoNumber = 1;
            let todosOnPage = 0;

            // todo is a number in loop
            for (const todo in userTodos) {
                if (pageTodos.length < 4) {
                    pageTodos.push(userTodos[todo]);
                    todosOnPage += 1;
                } else {

                    embedArray.push(new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Todo List')
                        .addFields(
                            { name: (todoNumber + 0).toString() + '. ' + pageTodos[0].name, value: pageTodos[0].description },
                            { name: (todoNumber + 1).toString() + '. ' + pageTodos[1].name, value: pageTodos[1].description },
                            { name: (todoNumber + 2).toString() + '. ' + pageTodos[2].name, value: pageTodos[2].description },
                            { name: (todoNumber + 3).toString() + '. ' + pageTodos[3].name, value: pageTodos[3].description },
                        ));
                    todoNumber += 4;
                    todosOnPage = 0;
                    pageTodos = [];

                }


            }
            // Create final embed if there are still todos remaining after previous loop
            if (todosOnPage === 1) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Todo List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0].name, value: pageTodos[0].description },
                    ));
            } else if (todosOnPage === 2) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Todo List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0].name, value: pageTodos[0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[1].name, value: pageTodos[1].description },
                    ));
            } else if (todosOnPage === 3) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Todo List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0].name, value: pageTodos[0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[1].name, value: pageTodos[1].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[2].name, value: pageTodos[2].description },
                    ));
            } else if (todosOnPage === 4) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Todo List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0].name, value: pageTodos[0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[1].name, value: pageTodos[1].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[2].name, value: pageTodos[2].description },
                        { name: (todoNumber + 3).toString() + '. ' + pageTodos[3].name, value: pageTodos[3].description },
                    ));
            }
        } else {
            embedArray.push(new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Todo List')
                .addFields({
                    name: 'EMPTY',
                    value: 'No tasks yet!',
                }));
        }

        // SEND MESSAGE
        const message = await interaction.reply({ embeds: [embedArray[0]], components: [Buttons], ephemeral: true });
        const collector = await message.createMessageComponentCollector();
        setTimeout(() => interaction.deleteReply(), 10000);

        // COLLECTOR FOR BUTTONS COMPONENT IN MESSAGE
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
            }
        });
    },
};