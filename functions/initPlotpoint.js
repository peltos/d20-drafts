const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require('discord.js');
const { getPlotpointById, getReactionById } = require('./supabase.js');

async function initPlotpoint(interaction, start_plotpoint) {
  const {
    content,
    imageUrl,
    reaction1,
    reaction2,
    reaction3,
    reaction4,
    reaction5,
  } = await getPlotpointById(start_plotpoint);

  let reactionButtonRows = new ActionRowBuilder();

  if (reaction1) {
    const { id, label, button } = await getReactionById(reaction1);
    reactionButtonRows.addComponents(
      addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
    );
  }

  if (reaction2) {
    const { id, label, button } = await getReactionById(reaction2);
    reactionButtonRows.addComponents(
      addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
    );
  }

  if (reaction3) {
    const { id, label, button } = await getReactionById(reaction3);
    reactionButtonRows.addComponents(
      addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
    );
  }

  if (reaction4) {
    const { id, label, button } = await getReactionById(reaction4);
    reactionButtonRows.addComponents(
      addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
    );
  }

  if (reaction5) {
    const { id, label, button } = await getReactionById(reaction5);
    reactionButtonRows.addComponents(
      addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
    );
  }

  if (reactionButtonRows.components.length === 0) {
    reactionButtonRows.addComponents(
      addReactionComponents(
        `end_fable`,
        'Finish the fable',
        ButtonStyle.Success
      )
    );
  }

  if (imageUrl) {
    const attachment = new AttachmentBuilder(imageUrl, {
      name: 'plotpoint.jpg',
    });
    await interaction.reply({
      content: content,
      components: [reactionButtonRows],
      files: [attachment],
    });
  } else {
    await interaction.reply({
      content: content,
      components: [reactionButtonRows],
    });
  }
}

function addReactionComponents(customId, label, style) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style);
}

module.exports = { initPlotpoint };
