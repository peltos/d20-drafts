import { Message } from "discord.js";
import ConsoleTimeComponent from "./Console/ConsoleTimeComponent";
import StoryReactionsModel from "../models/StoryReactionsModel";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StoryModel from "../models/StoryModel";

export default class SendComponent {
  constructor(
    story: StoryModel,
    storyContent: StoryPlotPointsModel,
    chanceDice: number | undefined = undefined,
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined = undefined,
    remainingHp: number | undefined = undefined,
    success = true
  ) {
    const date = this.formatDate(new Date().setMilliseconds(story.time));

    // current message
    const message = [
      this.diceRolled(
        chanceDice,
        damageDice,
        damageRolls,
        remainingHp,
        success
      ),
      storyContent.content,
      "\n\n",
      `The next story: **${date}**`,
    ].join("");

    //send message + image if the imageFile in example.json is not empty. If the imageFile
    //is empty, send an undefined opepration. Current image from internet.
    const file =
      storyContent.imageFile !== null
        ? { files: [storyContent.imageFile] }
        : undefined;

    story.channel.send(message, file).then((msg) => {
      new ConsoleTimeComponent("Message send succesful");
      if (storyContent.reactions) {
        const reactions = storyContent.reactions;
        this.recursiveReaction(
          msg as Message,
          reactions as StoryReactionsModel[]
        );
      }
    });
  }

  private recursiveReaction(
    msg: Message,
    reactions: StoryReactionsModel[],
    count = 0
  ) {
    const currentReaction = reactions[count];
    if (currentReaction !== undefined) {
      msg.react((currentReaction as StoryReactionsModel).emoji).then(() => {
        count++;
        if (reactions.length !== 0)
          this.recursiveReaction(msg, reactions, count);
      });
    }
  }

  private formatDate(timestamp: number) {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const date = d.getDate();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = d.getMonth() as number;
    const monthName = months[monthIndex];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = d.getDay();
    const dayName = days[dayIndex];
    const hours = d.getHours();
    const minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();

    return `${dayName}, ${date} ${monthName} ${year} - ${hours}:${minutes}`;
  }

  private diceRolled = (
    chanceDice: number | undefined,
    damageDice: string[] | undefined,
    damageRolls: number[] | undefined,
    remainingHp: number | undefined,
    success: boolean
  ) => {
    if (chanceDice === undefined) return "";

    const message = [
      "----------------------\n",
      `Dice rolled: **${chanceDice}**\n`,
      !success
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
    let counter = 0;
    let damageMessage = "";

    if (damageRolls !== undefined && damageDice !== undefined) {
      const totalDamage = damageRolls.reduce((a, b) => a + b, 0);
      damageMessage = [
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
    }

    const message = ["  **Failed...**  \n", damageMessage].join("");

    return message;
  };
}
