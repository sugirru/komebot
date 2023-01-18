const { EmbedBuilder } = require('discord.js');

function generateEmbeds(TodoList, userTodos) {
    // EMOJIS FOR COMPLETION STATUS OF TASKS
    const taskDone = ['🟥', '🟩'];
    const embedArray = [];

    if (TodoList.length != 0) {

        let pageTodos = [];
        let todoNumber = 1;
        let todosOnPage = 0;

        // todo is a number in loop
        for (const todo in userTodos) {
            if (pageTodos.length < 5) {
                if (userTodos[todo].completed) {
                    pageTodos.push([userTodos[todo], taskDone[1]]);
                } else {
                    pageTodos.push([userTodos[todo], taskDone[0]]);
                }
                todosOnPage += 1;
            } else {

                embedArray.push(new EmbedBuilder()
                    .setColor(0xDFEBF2)
                    .setTitle('Task List')
                    .addFields(
                        { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                        { name: (todoNumber + 1).toString() + '. ' + pageTodos[1][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                        { name: (todoNumber + 2).toString() + '. ' + pageTodos[2][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                        { name: (todoNumber + 3).toString() + '. ' + pageTodos[3][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                        { name: (todoNumber + 4).toString() + '. ' + pageTodos[4][1] + ' ' + pageTodos[4][0].name, value: pageTodos[4][0].description },
                    ));

                todoNumber += 5;
                todosOnPage = 0;
                pageTodos = [];

                if (userTodos[todo].completed) {
                    pageTodos.push([userTodos[todo], taskDone[1]]);
                } else {
                    pageTodos.push([userTodos[todo], taskDone[0]]);
                }
                todosOnPage += 1;
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
                    { name: (todoNumber + 1).toString() + '. ' + pageTodos[1][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                ));
        } else if (todosOnPage === 3) {
            embedArray.push(new EmbedBuilder()
                .setColor(0xDFEBF2)
                .setTitle('Task List')
                .addFields(
                    { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                    { name: (todoNumber + 1).toString() + '. ' + pageTodos[1][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                    { name: (todoNumber + 2).toString() + '. ' + pageTodos[2][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                ));
        } else if (todosOnPage === 4) {
            embedArray.push(new EmbedBuilder()
                .setColor(0xDFEBF2)
                .setTitle('Task List')
                .addFields(
                    { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                    { name: (todoNumber + 1).toString() + '. ' + pageTodos[1][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                    { name: (todoNumber + 2).toString() + '. ' + pageTodos[2][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                    { name: (todoNumber + 3).toString() + '. ' + pageTodos[3][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                ));
        } else if (todosOnPage === 5) {
            embedArray.push(new EmbedBuilder()
                .setColor(0xDFEBF2)
                .setTitle('Task List')
                .addFields(
                    { name: (todoNumber + 0).toString() + '. ' + pageTodos[0][1] + ' ' + pageTodos[0][0].name, value: pageTodos[0][0].description },
                    { name: (todoNumber + 1).toString() + '. ' + pageTodos[1][1] + ' ' + pageTodos[1][0].name, value: pageTodos[1][0].description },
                    { name: (todoNumber + 2).toString() + '. ' + pageTodos[2][1] + ' ' + pageTodos[2][0].name, value: pageTodos[2][0].description },
                    { name: (todoNumber + 3).toString() + '. ' + pageTodos[3][1] + ' ' + pageTodos[3][0].name, value: pageTodos[3][0].description },
                    { name: (todoNumber + 4).toString() + '. ' + pageTodos[4][1] + ' ' + pageTodos[4][0].name, value: pageTodos[4][0].description },
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

    return embedArray;
}

module.exports = { generateEmbeds };