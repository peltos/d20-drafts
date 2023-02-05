// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { initPlotpoint } = require('./functions/initPlotpoint.js');
const {
  getFableById,

  getPlotpointById,

  getReactionById,

  getActiveFableByChannelId,
  insertActiveFable,
  deleteActiveFable,

  upsertUserReaction,
} = require('./functions/supabase.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// when command inputted
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// when clicked on a button
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.includes('plotpoint_')) {
    const { id, currentPlotpoint } = await getActiveFableByChannelId(
      interaction.channelId
    );
    const interactionPlotpoint = interaction.customId.split('_')[1];
    const { label } = await getReactionById(interactionPlotpoint);
    const { reaction1, reaction2, reaction3, reaction4, reaction5 } =
      await getPlotpointById(currentPlotpoint);
      
    let isCurrentPlotpointButton = false
    if(reaction1 == interactionPlotpoint) isCurrentPlotpointButton = true
    if(reaction2 == interactionPlotpoint) isCurrentPlotpointButton = true
    if(reaction3 == interactionPlotpoint) isCurrentPlotpointButton = true
    if(reaction4 == interactionPlotpoint) isCurrentPlotpointButton = true
    if(reaction5 == interactionPlotpoint) isCurrentPlotpointButton = true

    if(!isCurrentPlotpointButton) return await interaction.reply({
      content: `***You are voting with the wrong buttons. Please use the buttons of the most resent message***`,
      ephemeral: true,
    });

    upsertUserReaction({userId: interaction.user.id, activeFable: id, plotpoint: interactionPlotpoint})

    await interaction.reply({
      content: `***You voted '${label}'. ***`,
      ephemeral: true,
    });
  }

  if (interaction.customId === 'end_fable') {
    const { id } = await getActiveFableByChannelId(interaction.channelId);

    deleteActiveFable(id);

    await interaction.reply({
      content: `***Fable ended***`,
    });
  }
});

//when submitted a model
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'startFable') {
    let fableId;
    let fableHp;

    interaction.fields.fields.forEach((field) => {
      if (field.customId === 'fableId') return (fableId = field.value);
      if (field.customId === 'fableHp') return (fableHp = field.value);
    });

    const { start_plotpoint } = await getFableById(fableId);
    insertActiveFable({
      fableId,
      currentPlotpoint: start_plotpoint,
      hp: fableHp,
      channelId: interaction.channelId,
    });

    return await initPlotpoint(interaction, start_plotpoint);
  }
});

// Log in to Discord with your client's token
client.login(token);
