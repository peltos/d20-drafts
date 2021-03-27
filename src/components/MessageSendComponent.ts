import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import { ANSI_RESET, ANSI_FG_GREEN } from "../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import StoryReactionsModel from "../models/StoryReactionsModel";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class MessageSendComponent {
  constructor(
    channel: TextChannel | DMChannel | GroupDMChannel,
    storyContent: StoryPlotPointsModel,
    chanceDice: number | undefined = undefined,
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined = undefined
  ) {
    // current message
    const message = [
      this.diceRolled(chanceDice, damageDice, damageRolls),
      storyContent.content,
    ].join("");
    
    //send message + image if the fileDestination in example.json is not empty. If the fileDestination
    //is empty, send an undefined opepration. Current image from internet.
    const file = storyContent.fileDestination !== null ? {files: [storyContent.fileDestination]} : undefined;

    channel.send(message, file).then((msg) => {
      new ConsoleTimeComponent("Message send ", ANSI_FG_GREEN, "succesful", ANSI_RESET);
      if (storyContent.reactions) {
        (storyContent.reactions as StoryReactionsModel[]).forEach(async (rection: StoryReactionsModel) => {
          if (rection.emoji !== null) await (msg as Message).react(rection.emoji);
        });
      }
    });
  }
  private diceRolled = (
    chanceDice: number | undefined,
    damageDice: string[] | undefined,
    damageRolls: number[] | undefined
  ) => {
    if (chanceDice === undefined) return "";

    const message = [
      "----------------------\n",
      `Dice rolled: **${chanceDice}**\n`,
      damageDice !== undefined && damageRolls !== undefined  ? this.damageRolls(damageDice, damageRolls) : '  **Success!**  \n',
      "----------------------\n",
    ].join("");

    return message;
  };

  private damageRolls = (
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined
  ) => {
    if (damageRolls === undefined || damageDice === undefined) return "";
    let counter = 0;
    const totalDamage = damageRolls.reduce((a, b) => a + b, 0);

    const message = [
      "  **Failed...**  \n",
      "\n",
      `Damage: **${damageDice[0]}d${damageDice[1]}**\n`,
      damageRolls.map((roll) => {
        const rollMessage = `Roll ${counter + 1}: **${roll}**\n`;
        counter++;
        return rollMessage;
      }),
      `Total damage: **${totalDamage}**\n`,
      "----------------------\n",
      `Total Health left: **${totalDamage}**\n`
    ].join("");

    return message;
  };
}
