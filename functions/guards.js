const { PermissionsBitField } = require('discord.js');

async function guardCanSendMessages(interaction) {
  if(!interaction.memberPermissions.has(PermissionsBitField.Flags.SendMessages)) 
  return await interaction.reply({
    content: "You do not have the right permissions",
    ephemeral: true,
  });
}


module.exports = {
  guardCanSendMessages
};
