

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`\u001b[42m Ready! Logged in as ${c.user.tag} \u001b[0m`);
});

client.commands = new Collection();

function getClient() {
  return client
}

 
module.exports = {
  getClient
};
