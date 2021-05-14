import { Message } from "discord.js";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import StoryReactionsModel from "../models/StoryReactionsModel";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StoryModel from "../models/StoryModel";
import Store from "../store/Store";
import WriteData from "../data/WriteData";
import { ANSI_FG_RED, ANSI_RESET } from "../resources/ANSIEscapeCode";
import SendMessageDefaultComponent from "./SendMessageDefaultComponent";

export default class SendMessageStoryComponent {
  constructor(
    story: StoryModel,
    storyContent: StoryPlotPointsModel,
    chanceDice: number | undefined = undefined,
    damageDice: string[] | undefined = undefined,
    damageRolls: number[] | undefined = undefined,
    remainingHp: number | undefined = undefined,
    success = true
  ) {
    const date = this.formatDate(new Date().setMilliseconds(story.delay));

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

    story.channel
      .send(message, file)
      .then((msg) => {
        Store.Stories.map((st) => {
          if (st.channel.id === (msg as Message).channel.id) {
            st.messageId = (msg as Message).id;
          }
        });
       new SendMessageDefaultComponent(story.channel, ...new ConsoleTimeComponent("Message send succesful").messages);
        if (storyContent.reactions) {
          const reactions = storyContent.reactions;
          this.recursiveReaction(
            msg as Message,
            reactions as StoryReactionsModel[]
          );
        }
        new WriteData();
      })
      .catch((err) => {
       new SendMessageDefaultComponent(story.channel, ...new ConsoleTimeComponent(ANSI_FG_RED, err, ANSI_RESET).messages);
        Store.Stories.map((st) => {
          if (st.channel.id === err.channel.id) {
            Store.Stories.splice(Store.Stories.indexOf(st), 1);
            new WriteData();
          }
        });
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
