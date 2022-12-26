const Sequelize = require('sequelize');

// Define connection information for Sequelize
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

// Create model for database
const Todos = sequelize.define('todos', {
    userid: Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: Sequelize.TEXT,
    completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    deadline: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    reminders: {
        type: Sequelize.DATE,
        allowNull: true,
    },
});

Todos.sync({ force: true });