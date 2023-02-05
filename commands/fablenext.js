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
    .setName('fablenext')
    .setDescription('Go to the next plotpoint'),
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

    const { content, reaction1, reaction2, reaction3, reaction4, reaction5 } =
      await getPlotpointById(currentPlotpoint);

    if (!reaction1) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`end_fable`)
          .setLabel('Finish the fable')
          .setStyle(ButtonStyle.Success)
      );

      await interaction.reply({
        content: `It seems the fable within this channel has come to an end. Please click on the button below so this channel can run another one.`,
        ephemeral: true,
        components: [row],
      });
    }
    
    let countReactions = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];

    if (reaction1)
      countReactions[0] = await getUserReactionCount(id, reaction1);

    if (reaction2)
      countReactions[1] = await getUserReactionCount(id, reaction2);

    if (reaction3)
      countReactions[2] = await getUserReactionCount(id, reaction3);

    if (reaction4)
      countReactions[3] = await getUserReactionCount(id, reaction4);

    if (reaction5)
      countReactions[4] = await getUserReactionCount(id, reaction5);

    countReactions = countReactions.filter(function (element) {
      return element !== undefined;
    });
    const highestCountPosition = countReactions.indexOf(
      Math.max(...countReactions)
    );
    switch (highestCountPosition) {
      case 0:
        await chosenPlotpoint(id, interaction, reaction1);
        break;
      case 1:
        await chosenPlotpoint(id, interaction, reaction2);
        break;
      case 2:
        await chosenPlotpoint(id, interaction, reaction3);
        break;
      case 3:
        await chosenPlotpoint(id, interaction, reaction4);
        break;
      case 4:
        await chosenPlotpoint(id, interaction, reaction5);
        break;
    }

    deleteUserReactions(id);
  },
};

async function chosenPlotpoint(id, interaction, chosenReaction) {
  const { success_plotpoint } = await getReactionById(chosenReaction);
  await initPlotpoint(interaction, success_plotpoint);
  updateActiveFablePlotpoint(id, success_plotpoint);
}
