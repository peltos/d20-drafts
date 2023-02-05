const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const {
  getPlotpointById,
  getReactionById,
} = require('./supabase.js')

async function initPlotpoint(interaction, start_plotpoint) {
  const { content, reaction1, reaction2, reaction3, reaction4, reaction5 } =
    await getPlotpointById(start_plotpoint);

  let reactionButtonRows = new ActionRowBuilder();

  if (reaction1) {
    const { id, label, button } = await getReactionById(reaction1);
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`plotpoint_${id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[button])
    );
  }

  if (reaction2) {
    const { id, label, button } = await getReactionById(reaction2);
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`plotpoint_${id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[button])
    );
  }

  if (reaction3) {
    const { id, label, button } = await getReactionById(reaction3);
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`plotpoint_${id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[button])
    );
  }

  if (reaction4) {
    const { id, label, button } = await getReactionById(reaction4);
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`plotpoint_${id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[button])
    );
  }

  if (reaction5) {
    const { id, label, button } = await getReactionById(reaction5);
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`plotpoint_${id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[button])
    );
  }

  if (reactionButtonRows.components.length === 0) {
    reactionButtonRows.addComponents(
      new ButtonBuilder()
        .setCustomId(`end_fable`)
        .setLabel("Finish the fable")
        .setStyle(ButtonStyle.Success)
    );
  }

  await interaction.reply({ content: content, components: [reactionButtonRows] });
}

module.exports = { initPlotpoint };