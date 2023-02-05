const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require('discord.js');
const {
  getPlotpointById,

  getReactionById,

  updateActiveFablePlotpoint,
  getActiveFableByChannelId,

  getUserReactionCount,
  deleteUserReactions,
} = require('../functions/supabase.js');
const { initPlotpoint } = require('../functions/initPlotpoint.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fablerepeat')
    .setDescription('Repeat the current plotpoint. Can be used if the bot was offline.'),
  async execute(interaction) {
    const { id, currentPlotpoint } = await getActiveFableByChannelId(
      interaction.channelId
    );

    if (!id) {
      return await interaction.reply({
        content:
          'There are no active fables in this channel. To start a fable you can type the `/fablestart` command with the fableid of your selected fable.',
      });
    }

    await initPlotpoint(interaction, currentPlotpoint);
  },
};