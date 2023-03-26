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
  updateActiveFableHP,
  getActiveFableByChannelId,

  getUserReactionCount,
  deleteUserReactions,
} = require('../functions/supabase.js');
const { initPlotpoint } = require('../functions/initPlotpoint.js');
const { guardCanSendMessages } = require('../functions/guards.js');
const { messageNoActiveFable, messageFableFinish } = require('../functions/messages.js');
const { consoleNextMessage } = require('../functions/console.js');

let gId = 0;
let gCurrentPlotpoint = 0;
let gHp = 0;
let gFableId = 0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fable-next')
    .setDescription('Go to the next plotpoint'),
  async execute(interaction) {
    if(interaction.memberPermissions) guardCanSendMessages(interaction);

    const { id, currentPlotpoint, hp, fableId } =
      await getActiveFableByChannelId(interaction.channelId);
    gId = id;
    gCurrentPlotpoint = currentPlotpoint;
    gHp = hp;
    gFableId = fableId;

    if (!id) return messageNoActiveFable(interaction);

    const { reaction1, reaction2, reaction3, reaction4, reaction5 } =
      await getPlotpointById(currentPlotpoint);

    if (!reaction1) return messageFableFinish(interaction);

    const highestCountPosition = await countReactions(
      reaction1,
      reaction2,
      reaction3,
      reaction4,
      reaction5
    );

    switch (highestCountPosition) {
      case 0:

        await chosenPlotpoint(interaction, reaction1);
        break;
      case 1:
        await chosenPlotpoint(interaction, reaction2);
        break;
      case 2:
        await chosenPlotpoint(interaction, reaction3);
        break;
      case 3:
        await chosenPlotpoint(interaction, reaction4);
        break;
      case 4:
        await chosenPlotpoint(interaction, reaction5);
        break;
    }

    deleteUserReactions(id);
  },
};

async function chosenPlotpoint(interaction, chosenReaction) {
  const {
    success_plotpoint,
    fail_plotpoint,
    death_plotpoint,
    rollAtLeast,
    damage,
    label,
  } = await getReactionById(chosenReaction);

  if (rollAtLeast !== null) {
    const roll = getRandomInt(20) + 1;
    if (roll < rollAtLeast) {
      // roll fail
      if (damage !== null) {
        // calculate damage
        const split = damage.split('');
        const amount = split[0];
        const dice = split[2];
        let totalDamage = 0;
        let totalDamageRolls = "";
        for (var i = 0; i < amount; i++) {
          const damageRoll = getRandomInt(dice) + 1
          if(i === 0) totalDamageRolls = `${damageRoll}`
          else totalDamageRolls += ` + ${damageRoll}`
          totalDamage += damageRoll;
        }
        const currentHealth = gHp - totalDamage;
        if (currentHealth <= 0) {
          // died
          consoleNextMessage({
            fableId: gFableId,
            id: gId,
            currentPlotpoint: gCurrentPlotpoint,
            msg: '\u001b[1;31mYou died \u001b[0m',
            hp: gHp,
            roll,
            plotpoint: death_plotpoint,
            damage: totalDamage,
            damageRolls: totalDamageRolls,
          });
          await initPlotpoint(interaction, death_plotpoint, `--- ***${label}*** --- \n\nRoll: **${roll}** \nDamage rolls: **${totalDamageRolls} (Total: ${totalDamage})**\nRemaining health: **${currentHealth} hp**\n\n`);
          await updateActiveFablePlotpoint(gId, death_plotpoint);
        } else {
          // survived
          consoleNextMessage({
            fableId: gFableId,
            id: gId,
            currentPlotpoint: gCurrentPlotpoint,
            msg: '\u001b[1;32mYou survived \u001b[0m',
            hp: gHp,
            roll,
            plotpoint: fail_plotpoint,
            damage: totalDamage,
            damageRolls: totalDamageRolls,
          });
          await initPlotpoint(interaction, fail_plotpoint, `--- ***${label}*** --- \n\nRoll: **${roll}** \nDamage rolls: **${totalDamageRolls} (Total: ${totalDamage})**\nRemaining health: **${currentHealth} hp**\n\n`);
          await updateActiveFablePlotpoint(gId, fail_plotpoint);
        }
        await updateActiveFableHP(gId, currentHealth)
      } else {
        // instant fail
        consoleNextMessage({
          fableId: gFableId,
          id: gId,
          currentPlotpoint: gCurrentPlotpoint,
          msg: '\u001b[1;31mInstant fail \u001b[0m',
          hp: gHp,
          roll,
          plotpoint: fail_plotpoint
        });
        await initPlotpoint(interaction, fail_plotpoint, `--- ***${label}*** --- \n\nRoll: **${roll}** \nRemaining health: **0 (Instant Death)**\n\n`);
        updateActiveFablePlotpoint(gId, fail_plotpoint);
      }
    } else {
      // roll success
      consoleNextMessage({
        fableId: gFableId,
        id: gId,
        currentPlotpoint: gCurrentPlotpoint,
        msg: '\u001b[1;32mRoll success \u001b[0m',
        hp: gHp,
        roll,
        plotpoint: success_plotpoint
      });
      await initPlotpoint(interaction, success_plotpoint, `--- ***${label}*** --- \n\nRoll: **${roll}** \n\n`);
      updateActiveFablePlotpoint(gId, success_plotpoint);
    }
  } else {
    // default success
    consoleNextMessage({
      fableId: gFableId,
      id: gId,
      currentPlotpoint: gCurrentPlotpoint,
      msg: '\u001b[1;32mDefault success \u001b[0m',
      hp: gHp,
      plotpoint: success_plotpoint
    });
    await initPlotpoint(interaction, success_plotpoint, `--- ***${label}*** --- \n\n`);
    updateActiveFablePlotpoint(gId, success_plotpoint);
  }
}

async function countReactions(
  reaction1,
  reaction2,
  reaction3,
  reaction4,
  reaction5
) {
  let countReactions = [undefined, undefined, undefined, undefined, undefined];

  if (reaction1) countReactions[0] = await getUserReactionCount(gId, reaction1);
  if (reaction2) countReactions[1] = await getUserReactionCount(gId, reaction2);
  if (reaction3) countReactions[2] = await getUserReactionCount(gId, reaction3);
  if (reaction4) countReactions[3] = await getUserReactionCount(gId, reaction4);
  if (reaction5) countReactions[4] = await getUserReactionCount(gId, reaction5);

  countReactions = countReactions.filter(function (element) {
    return element !== undefined;
  });

  // check which reaction is the best. in case of a tie, randomize between the winners
  positionReaction = 0;
  highestCountPosition = 0;
  countReactions.forEach((reaction, index) => {
    if (reaction > highestCountPosition) {
      highestCountPosition = reaction;
      positionReaction = index;
    } else if (reaction === highestCountPosition) {
      const random = getRandomInt(2);
      if (random === 1) {
        highestCountPosition = reaction;
        positionReaction = index;
      }
    }
  });

  return positionReaction;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
