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
            );

        // START CREATING EMBEDS
        const TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
        const embedArray = [];
        if (TodoList.length != 0) {
            const userTodos = eval(JSON.stringify(TodoList));
            console.log(userTodos); // DEBUG

            let pageTodos = [];
            let page = 1;
            let pageString = '';
            let todoNumber = 1;
            let todosOnPage = 0;

            // todo is a number in loop
            for (const todo in userTodos) {
                console.log('here one'); // DEBUG
                if (pageTodos.length < 4) {
                    pageTodos.push(userTodos[todo]);
                    todosOnPage += 1;
                } else {

                    for (const pageTodo in pageTodos) {
                        pageString = pageString.concat(todoNumber.toString() + '. '); // Todo Number
                        pageString = pageString.concat(pageTodos[pageTodo].name + '\n\t'); // Todo Name
                        pageString = pageString.concat(pageTodos[pageTodo].description + '\n'); // Todo Description
                        todoNumber += 1;
                    }

                    embedArray.push(new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Todo List')
                        .addFields({
                            name: 'Page ' + page,
                            value: pageString,
                        }));

                    pageString = '';
                    todoNumber = 1;
                    todosOnPage = 0;

                    pageTodos = [];
                    page += 1;

                }


            }
            // Create final embed if there are still todos remaining after previous loop
            if (todosOnPage < 4) {
                for (const pageTodo in pageTodos) {
                    pageString = pageString.concat(todoNumber.toString() + '. '); // Todo Number
                    pageString = pageString.concat(pageTodos[pageTodo].name + '\n\t'); // Todo Name
                    pageString = pageString.concat(pageTodos[pageTodo].description + '\n'); // Todo Description
                    todoNumber += 1;
                }
                embedArray.push(new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Todo List')
                    .addFields({
                        name: 'Page ' + page,
                        value: pageString,
                    }));
            }
        } else {
            console.log('here two'); // DEBUG
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
            }
        });
    },
};