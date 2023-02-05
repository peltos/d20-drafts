const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { getFableById, getActiveFableByChannelId } = require( "../functions/supabase.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fablestart')
    .setDescription('Start a fable')
    .addStringOption((option) =>
      option
        .setName('fableid')
        .setDescription('The id of the fable you want to select')
        .setRequired(true)
    ),
  async execute(interaction) {

    let {channelId} = await getActiveFableByChannelId(interaction.channelId)

    if (channelId)
      return await interaction.reply({
        content: "**There is already an active fable in this channel.** \nIf there seems to be a problem with the bot, please contact the developers",
        ephemeral: true,
      });

    const fableid = interaction.options.getString('fableid') ?? undefined;
    response = await getFableById(fableid);

    if (response === 'PGRST116')
      return await interaction.reply({
        content: '**No fable exists with this fable ID**',
        ephemeral: true,
      });

    const { id, name, defaultHp } = response;

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

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstRow = new ActionRowBuilder().addComponents(fableIdInput);
    const secondRow = new ActionRowBuilder().addComponents(fableHpInput);

    // Add inputs to the modal
    modal.addComponents(firstRow, secondRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
