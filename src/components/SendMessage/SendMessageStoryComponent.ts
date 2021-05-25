import { Attachment, Message } from "discord.js";
import ConsoleTimeComponent from "./../ConsoleTimeComponent";
import StoryReactionsModel from "../../models/StoryReactionsModel";
import StoryPlotPointsModel from "../../models/StoryPlotPointsModel";
import StoryModel from "../../models/StoryModel";
import Store from "../../store/Store";
import WriteData from "../../data/WriteData";
import { ANSI_FG_RED, ANSI_RESET } from "../../resources/ANSIEscapeCode";
import SendMessageWarningComponent from "./SendMessageWarningComponent";
import RemoveCommand from "../../commands/RemoveCommand";

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

    // check if there is a dice roll needed and collect the info
    const diceRoll = this.diceRolled(
      chanceDice,
      damageDice,
      damageRolls,
      remainingHp,
      success
    );

    // add dice if needed
    if (diceRoll !== "") {
      story.channel.send(diceRoll);
    }

    // add end of the delay to the plotpoint
    const message = [
      storyContent.content,
      this.extraContent(story.storyEnded, date),
    ].join("");

    //send message + image if the imageFile in example.json is not empty. If the imageFile
    //is empty, send an undefined opepration. Current image from internet.

    let file;

    if (storyContent.imageFile?.includes("data:image/jpeg;base64")) {
      file =
        storyContent.imageFile !== null
          ? new Attachment(
              Buffer.from(
                storyContent.imageFile.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
              )
            )
          : undefined;
    } else {
      file =
        storyContent.imageFile !== null
          ? { files: [storyContent.imageFile] }
          : undefined;
    }

    // Send the plotpoint to discord
    story.channel
      .send(message, file)
      .then((msg: Message | Message[]) => {
        Store.Stories.map((st: StoryModel) => {
          if (st.channel.id === (msg as Message).channel.id) {
            st.messageId = (msg as Message).id; // get the ID of the message to search back later
          }
        });
        if (storyContent.reactions) {
          const reactions = storyContent.reactions;
          this.recursiveReaction(
            // Add reactions resursively so that it's always consistent with the order of the reactions
            msg as Message,
            reactions as StoryReactionsModel[]
          );
        }
        new WriteData();
      })
      .catch((err: string) => {
        new SendMessageWarningComponent(
          story.channel,
          ...new ConsoleTimeComponent(ANSI_FG_RED, err, ANSI_RESET).messages
        );
      });
    if (story.storyEnded) {
      Store.Stories.map((st) => {
        if (st.channel.id === story.channel.id) {
          new RemoveCommand(st.channel, false);
        }
      });
    }
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

  private extraContent(storyEnded: boolean, date: string) {
    let message = "";

    if (!storyEnded) {
      message = ["\n\n", `The next plot point: **${date}**`].join("");
    } else {
      message = [
        "\n\n",
        `**This story has reached an end. Start this story again if you want to see other endings.**`,
      ].join("");
    }

    return message;
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
