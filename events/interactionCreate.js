const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'newTodoModal') {
                const Todos = interaction.client.todos;

                const todoName = interaction.fields.getTextInputValue('todoNameInput');
                const todoDescription = interaction.fields.getTextInputValue('todoDescriptionInput');

                try {
                    await Todos.create({
                        userid: interaction.user.id,
                        name: todoName,
                        description: todoDescription,
                        completed: false,
                    });
                } catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        await interaction.reply({ content: 'That todo already exists.', ephemeral: true });
                        setTimeout(() => interaction.deleteReply(), 5000);
                    } else {
                        await interaction.reply({ content: 'Something went wrong with adding a todo.', ephemeral: true });
                        setTimeout(() => interaction.deleteReply(), 5000);
                    }
                }
                await interaction.reply({ content: 'Succesfully added todo!', ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 5000);
            } else if (interaction.customId === 'deleteTodoModal') {
                const Todos = interaction.client.todos;

                const todosToDelete = interaction.fields.getTextInputValue('todosToDelete');
                const deleteList = todosToDelete.split(',');

                const TodoList = await Todos.findAll({ where: { userid: interaction.user.id } });
                const userTodos = eval(JSON.stringify(TodoList));

                try {
                    for (let i = 0; i < deleteList.length; i++) {
                        await Todos.destroy({ where: { description: userTodos[deleteList[i] - 1].description } });
                    }
                } catch (error) {
                    console.log(error);
                    await interaction.reply({ content: 'Something went wrong!', ephemeral: true });
                    setTimeout(() => interaction.deleteReply(), 5000);
                }

                await interaction.reply({ content: 'Succesful deletion!', ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 5000);
            }
            // } else {
            //     await interaction.reply('Something went wrong when adding the todo.');
            //     setTimeout(() => interaction.deleteReply(), 5000);
            // }
        }
    },
};