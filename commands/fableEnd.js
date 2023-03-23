const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const {
  getActiveFableByChannelId,
  deleteActiveFable,
} = require('../functions/supabase.js');
const { guardCanSendMessages } = require('../functions/guards.js');
const {
  messageNoActiveFable,
  messageFableEnd,
} = require('../functions/messages.js');
const { consoleEndMessage } = require('../functions/console.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fable-end')
    .setDescription('End a fable'),
  async execute(interaction) {
    guardCanSendMessages(interaction);

    let { id, fableId, hp, currentPlotpoint, channelId } = await getActiveFableByChannelId(
      interaction.channelId
    );
    if (!channelId) return messageNoActiveFable(interaction);

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
        channelId +
        '>\u001b[0m',
    });

    messageFableEnd(interaction, fableId);
  },
};
