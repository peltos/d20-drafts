const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function messageNoActiveFable(interaction) {
  await interaction.reply({
    content:  '***There are no active fables in this channel*** \nTo start a fable you can type the `/fablestart` command with the fableid of your selected fable.',
    ephemeral: true,
  });
}

async function messageAlreadyActiveFable(interaction, name) {
  await interaction.reply({
    content: "**There is already an active fable in this channel.** \nIf there seems to be a problem with the bot, please contact the developers",
    ephemeral: true,
  });
}

async function messageFableEnd(interaction, name) {
  await interaction.reply({
    content: '***Fable `' + name + '` has ended***',
  });
}

async function messageFableFinish(interaction) {
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

module.exports = {
  messageNoActiveFable,
  messageAlreadyActiveFable,
  messageFableEnd,
  messageFableFinish,
};
