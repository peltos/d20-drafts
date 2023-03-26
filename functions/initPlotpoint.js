const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require('discord.js');
const { getPlotpointById, getReactionById, updateActiveFableTimeInterval, getActiveFableByChannelId } = require('./supabase.js');
const { getClient } = require('./init.js');

const client = getClient();

async function initPlotpoint(interaction, start_plotpoint, extraContent = '') {
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

  let chosenReaction = [];
  if(reaction1) chosenReaction.push(reaction1);
  if(reaction2) chosenReaction.push(reaction2);
  if(reaction3) chosenReaction.push(reaction3);
  if(reaction4) chosenReaction.push(reaction4);
  if(reaction5) chosenReaction.push(reaction5);

  if(chosenReaction.length > 0) {
    for (const reaction of chosenReaction) {
      const { id, label, button } = await getReactionById(reaction);
      reactionButtonRows.addComponents(
        addReactionComponents(`plotpoint_${id}`, label, ButtonStyle[button])
      );
    };
  } else {
    reactionButtonRows.addComponents(
      addReactionComponents(
        `end_fable`,
        'Finish the fable',
        ButtonStyle.Success
      )
    );
    let { id } = await getActiveFableByChannelId(interaction.channelId);
    updateActiveFableTimeInterval(id,0)
  }

  if(interaction) {
    if (imageUrl) {
      const attachment = new AttachmentBuilder(imageUrl, {
        name: 'plotpoint.jpg',
      });
      await interaction.reply({ //  unknown interation error.
        content: extraContent + content,
        components: [reactionButtonRows],
        files: [attachment],
      });
    } else {
      await interaction.reply({
        content: extraContent + content,
        components: [reactionButtonRows],
      });
    }
  }else {
    if (imageUrl) {
      const attachment = new AttachmentBuilder(imageUrl, {
        name: 'plotpoint.jpg',
      });
      await client.channels.cache.get(interaction.channelId).send({
        content: extraContent + content,
        components: [reactionButtonRows],
        files: [attachment],
      });
    } else {
      await client.channels.cache.get(interaction.channelId).send({
        content: extraContent + content,
        components: [reactionButtonRows],
      });
    }
  }
}

function addReactionComponents(customId, label, style) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style);
}
module.exports = { initPlotpoint };
