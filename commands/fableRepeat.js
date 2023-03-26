const { SlashCommandBuilder } = require('discord.js');
const { getActiveFableByChannelId } = require('../functions/supabase.js');
const { initPlotpoint } = require('../functions/initPlotpoint.js');
const { guardCanSendMessages } = require('../functions/guards.js');
const { messageNoActiveFable } = require('../functions/messages.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fable-repeat')
    .setDescription(
      'Repeat the current plotpoint. Can be used if the bot was offline.'
    ),
  async execute(interaction) {
    guardCanSendMessages(interaction);

    const { id, currentPlotpoint } = await getActiveFableByChannelId(
      interaction.channelId
    );

    if (!id) return messageNoActiveFable(interaction);

    await initPlotpoint(interaction, currentPlotpoint);
  },
};
