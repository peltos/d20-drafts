// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
const { token } = require('./config.json');
const { Events } = require('discord.js');
const { initPlotpoint } = require('./functions/initPlotpoint.js');
const { getClient } = require('./functions/init.js');
const { consoleStartMessage, consoleEndMessage } = require('./functions/console.js');
const {
  getFableById,

  getPlotpointById,

  getReactionById,

  getAllActiveFables,
  getActiveFableByChannelId,
  insertActiveFable,
  deleteActiveFable,

  upsertUserReaction,
} = require('./functions/supabase.js');const {
  messageFableEnd,
} = require('./functions/messages.js');

const client = getClient()

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
  const { id, currentPlotpoint, hp, fableId } = await getActiveFableByChannelId(
    interaction.channelId
  );
  if (interaction.customId.includes('plotpoint_')) {
    const interactionPlotpoint = interaction.customId.split('_')[1];
    const { label } = await getReactionById(interactionPlotpoint);
    const { reaction1, reaction2, reaction3, reaction4, reaction5 } =
      await getPlotpointById(currentPlotpoint);

    let isCurrentPlotpointButton = false;
    if (reaction1 == interactionPlotpoint) isCurrentPlotpointButton = true;
    if (reaction2 == interactionPlotpoint) isCurrentPlotpointButton = true;
    if (reaction3 == interactionPlotpoint) isCurrentPlotpointButton = true;
    if (reaction4 == interactionPlotpoint) isCurrentPlotpointButton = true;
    if (reaction5 == interactionPlotpoint) isCurrentPlotpointButton = true;

    if (!isCurrentPlotpointButton)
      return await interaction.reply({
        content: `***You are voting with the wrong buttons. Please use the buttons of the most resent message***`,
        ephemeral: true,
      });

    upsertUserReaction({
      userId: interaction.user.id,
      activeFable: id,
      plotpoint: interactionPlotpoint,
    });

    await interaction.reply({
      content: `**---\nYou voted '${label}'. ** \n*your vote will only count once. You can change your vote as long as this plotpoint is active.\n---*`,
      ephemeral: true,
    });
  }

  if (interaction.customId === 'end_fable') {
    const { id } = await getActiveFableByChannelId(interaction.channelId);

    deleteActiveFable(id);

    consoleEndMessage({
      fableId,
      id,
      currentPlotpoint,
      hp: hp,
      msg:
        'The fable \u001b[1;31m' +
        fableId +
        '\u001b[0m has ended on channel \u001b[1;31m<#' +
        interaction.channelId +
        '>\u001b[0m',
    });

    messageFableEnd(interaction, fableId);
  }
});

//when submitted a model
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'startFable') {
    let fableId;
    let fableHp;
    let fableTimeInterval;

    interaction.fields.fields.forEach((field) => {
      if (field.customId === 'fableId') return (fableId = field.value);
      if (field.customId === 'fableHp') return (fableHp = field.value);
      if (field.customId === 'fableTimeInterval') return (fableTimeInterval = field.value);
    });

    const { start_plotpoint } = await getFableById(fableId);
    const { id } = await insertActiveFable({
      fableId,
      currentPlotpoint: start_plotpoint,
      hp: fableHp,
      channelId: interaction.channelId,
      timeInterval: fableTimeInterval
    });

    consoleStartMessage({
      fableId,
      id,
      currentPlotpoint: start_plotpoint,
      hp: fableHp,
      msg:
        'The fable \u001b[1;32m' +
        fableId +
        '\u001b[0m has started on channel \u001b[1;32m<#' +
        interaction.channelId +
        '>\u001b[0m',
    });

    return await initPlotpoint(interaction, start_plotpoint, fableTimeInterval, true);
  }
});


cron.schedule('*/30 * * * * *', async () => {
  const activeFables = await getAllActiveFables()
  activeFables.forEach(({timeInterval, updated_at, channelId }) => {
    if(timeInterval === 0) return;
    if(new Date().getTime() > (new Date(updated_at).getTime() + timeInterval*60000)) {
      client.channels.cache.get(channelId).messages.fetch({limit: 1}).then(message => {
        execute("./commands/fableNext.js", message.first())
      })
      .catch(console.error);
    }
  })
});

async function execute(file, ...args) {
  const f = require(file)
  if (!f) throw new Error("Invalid file")
  return f.execute(...args)
}


// Log in to Discord with your client's token
client.login(token);
