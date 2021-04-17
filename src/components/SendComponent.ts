import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import ConsoleTimeComponent from "./Console/ConsoleTimeComponent";
import StoryReactionsModel from "../models/StoryReactionsModel";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class SendComponent {
  constructor(
    channel: TextChannel | DMChannel | GroupDMChannel,
    storyContent: StoryPlotPointsModel,
    chanceDice: number | undefined = undefined,
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined = undefined,
    remainingHp: number | undefined = undefined
  ) {
    // current message
    const message = [
      this.diceRolled(chanceDice, damageDice, damageRolls, remainingHp),
      storyContent.content,
    ].join("");

    //send message + image if the imageFile in example.json is not empty. If the imageFile
    //is empty, send an undefined opepration. Current image from internet.
    const file =
      storyContent.imageFile !== null
        ? { files: [storyContent.imageFile] }
        : undefined;

    channel.send(message, file).then((msg) => {
      new ConsoleTimeComponent("Message send succesful");
      if (storyContent.reactions) {
        const reactions = storyContent.reactions;
        this.recursiveReaction(msg as Message, reactions as StoryReactionsModel[]);
      }
    });
  }

  private recursiveReaction(msg: Message, reactions: StoryReactionsModel[], count = 0) {
    const currentReaction = reactions[count];
    if (currentReaction !== undefined) {
      msg.react((currentReaction as StoryReactionsModel).emoji).then(() => {
        count++;
        if (reactions.length !== 0) this.recursiveReaction(msg, reactions, count);
      });
    }
  }

  private diceRolled = (
    chanceDice: number | undefined,
    damageDice: string[] | undefined,
    damageRolls: number[] | undefined,
    remainingHp: number | undefined
  ) => {
    if (chanceDice === undefined) return "";

    const message = [
      "----------------------\n",
      `Dice rolled: **${chanceDice}**\n`,
      damageDice !== undefined && damageRolls !== undefined
        ? this.damageRolls(damageDice, damageRolls, remainingHp)
        : "  **Success!**  \n",
      "----------------------\n",
    ].join("");

    return message;
  };

  private damageRolls = (
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined,
    remainingHp: number | undefined
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
      `Total Health left: **${remainingHp}**\n`,
    ].join("");

    return message;
  };
}
