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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fable-end')
    .setDescription('End a fable'),
  async execute(interaction) {
    guardCanSendMessages(interaction);

    let { id, fableId, channelId } = await getActiveFableByChannelId(
      interaction.channelId
    );
    if (!channelId) return messageNoActiveFable(interaction);

    deleteActiveFable(id);
    messageFableEnd(interaction, fableId);
  },
};
