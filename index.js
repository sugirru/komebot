// Require modules for the command handler
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// Require Sequelize
const Sequelize = require('sequelize');
const { token } = require('./config.json');
// Other helper functions
const { createPaletteImage } = require('./utils/generate-palette.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// Define connection information for Sequelize
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// Create model for sequelize database
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


client.commands = new Collection();
client.todos = Todos;

// Command Handler
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Generate image for palette command
createPaletteImage();

// Log in to Discord with your client's token
client.login(token);

// module.exports = { Tags };