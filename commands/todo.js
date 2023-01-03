const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Todo manager'),
    async execute(interaction) {
        // GET TODOS DATABASE
        const Todos = interaction.client.todos;
        // EMOJIS FOR COMPLETION STATUS OF TASKS
        const taskDone = ['🟥', '🟩'];

        // Create variable to track current page
        let page = 0;

        // CREATE BUTTONS BELOW EMBED
        const Buttons = new ActionRowBuilder()
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
                    .setCustomId('newTodoButton')
                    .setLabel('New Task')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('deleteAllTodos')
                    .setLabel('Delete All')
                    .setStyle(ButtonStyle.Danger),
            );

        // START CREATING EMBEDS
        const TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
        const userTodos = eval(JSON.stringify(TodoList));
        const embedArray = [];
        if (TodoList.length != 0) {

            let pageTodos = [];
            let todoNumber = 1;
            let todosOnPage = 0;

            // todo is a number in loop
            for (const todo in userTodos) {
                if (pageTodos.length < 5) {
                    let taskStatus;
                    if (userTodos[todo].completed) {
                        taskStatus = taskDone[1];
                    } else {
                        taskStatus = taskDone[0];
                    }
                    pageTodos.push([userTodos[todo], taskStatus]);
                    todosOnPage += 1;
                } else {

                    embedArray.push(new EmbedBuilder()
                        .setColor(0xDFEBF2)
                        .setTitle('Task List')
                        .addFields(
                            { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                            { name: (todoNumber + 1).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                            { name: (todoNumber + 2).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                            { name: (todoNumber + 3).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                            { name: (todoNumber + 4).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[4][0].name, value: pageTodos[3][0].description },
                        ));
                    todoNumber += 5;
                    todosOnPage = 0;
                    pageTodos = [];

                }


            }
            // Create final embed if there are still todos remaining after previous loop
            if (todosOnPage === 1) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                    ));
            } else if (todosOnPage === 2) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                    ));
            } else if (todosOnPage === 3) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                    ));
            } else if (todosOnPage === 4) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                        { name: (todoNumber + 3).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                    ));
            } else if (todosOnPage === 5) {
                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                        { name: (todoNumber + 3).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                        { name: (todoNumber + 4).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[4][0].name, value: pageTodos[4][0].description },
                    ));
            }
        } else {
            embedArray.push(new EmbedBuilder()
                .setColor(0xDFEBF2)
                .setTitle('Task List')
                .addFields({
                    name: 'EMPTY',
                    value: 'No tasks yet!',
                }));
        }

        // SEND MESSAGE
        const message = await interaction.reply({ embeds: [embedArray[page]], components: [Buttons], ephemeral: true });
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
                    await i.update({ embeds: [embedArray[page]], components: [Buttons], ephemeral: true });
                } else {
                    await i.update({ embeds: [embedArray[page]], components: [Buttons], ephemeral: true });
                }
            } else if (i.customId === 'nextPage') {
                if (page < embedArray.length) {
                    page += 1;
                    await i.update({ embeds: [embedArray[page]], components: [Buttons], ephemeral: true });
                } else {
                    await i.update({ embeds: [embedArray[page]], components: [Buttons], ephemeral: true });
                }
            }
        });
    },
};