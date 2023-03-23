const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const {
  getFableById,
  getActiveFableByChannelId,
} = require('../functions/supabase.js');
const { guardCanSendMessages } = require('../functions/guards.js');
const { messageAlreadyActiveFable } = require('../functions/messages.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fable-start')
    .setDescription('Start a fable')
    .addStringOption((option) =>
      option
        .setName('fableid')
        .setDescription('The id of the fable you want to select')
        .setRequired(true)
    ),
  async execute(interaction) {
    guardCanSendMessages(interaction);

    let { channelId } = await getActiveFableByChannelId(interaction.channelId);

    if (channelId) return messageAlreadyActiveFable(interaction);

    const fableid = interaction.options.getString('fableid') ?? undefined;
    response = await getFableById(fableid);

    const { id, name, defaultHp, published, defaultTimeInterval } = response;

    if (response === 'PGRST116' || !published)
      return await interaction.reply({
        content: '**No fable exists or has been published with this fable ID**',
        ephemeral: true,
      });

    // Create the modal
    const modal = new ModalBuilder().setCustomId('startFable').setTitle(name);

    // Add components to modal

    // Create the text input components
    const fableIdInput = new TextInputBuilder()
      .setCustomId('fableId')
      // The label is the prompt the user sees for this input
      .setLabel('Fable Id')
      .setValue(`${id}`)
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Only change this if you know what you are doing');

    // Create the text input components
    const fableHpInput = new TextInputBuilder()
      .setCustomId('fableHp')
      // The label is the prompt the user sees for this input
      .setLabel('HP amount')
      .setValue(`${defaultHp}`)
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('How much HP your character has');

    // Create the text input components
    const fableTimeIntervalInput = new TextInputBuilder()
      .setCustomId('fableTimeInterval')
      // The label is the prompt the user sees for this input
      .setLabel('Time Interval (in minutes) - set 0 for manual')
      .setValue(`${defaultTimeInterval}`)
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('How much time you have to choose');

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstRow = new ActionRowBuilder().addComponents(fableIdInput);
    const secondRow = new ActionRowBuilder().addComponents(fableHpInput);
    const thirdRow = new ActionRowBuilder().addComponents(fableTimeIntervalInput);

    // Add inputs to the modal
    modal.addComponents(firstRow, secondRow, thirdRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
