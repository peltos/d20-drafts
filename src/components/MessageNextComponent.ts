import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_CYAN, ANSI_FG_MAGENTA } from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import MessageSendComponent from "./MessageSendComponent";
import StoryContentModel from "../models/StoryContentModel";

export default class MessageNextComponent {
  public highestVoteEmoji = "";
  public plotPointId = 0;

  constructor(message: Message, plotPointId: number) {
    this.plotPointId = plotPointId;
    let currentHighestCount: number | undefined = undefined;
    message.reactions.map((reaction) => {
      if (reaction.me) { // check if it's a valid reaction
        if (currentHighestCount === undefined) {
          this.highestVoteEmoji = reaction.emoji.name;
          currentHighestCount = reaction.count;
        } else {
          if (currentHighestCount < reaction.count) {
            this.highestVoteEmoji = reaction.emoji.name;
            currentHighestCount = reaction.count;
          }
          if (currentHighestCount === reaction.count) {
            this.highestVoteEmoji = this.randomChoice([
              this.highestVoteEmoji,
              reaction.emoji.name,
            ]);
          }
        }
      }
    });

    this.nextStoryContent(message.channel, this.currentPlotPointResult());

    new ConsoleTimeComponent(
      ANSI_FG_CYAN,
      `Plot Point `,
      ANSI_RESET,
      ANSI_FG_MAGENTA,
      `${plotPointId} `,
      ANSI_RESET,
      "of ",
      ANSI_FG_MAGENTA,
      `${message.id} `,
      ANSI_RESET,
      "has chosen ",
      `${this.highestVoteEmoji} `
    );
  }
  public valueOf = (): void => {
    return;
  };

  public currentPlotPointResult = (): Record<string, unknown> => {
    let rollAtLeast: number | null = null;
    let rollFailId: number | null = null;
    let rollSuccessId = 0;

    Store.Stories.map((story) =>
      story.plotPoints.map((plotPoint) => {
        if (plotPoint.plotPointId === this.plotPointId) {
          plotPoint.reactions.map((reaction) => {
            if (reaction.emoji === this.highestVoteEmoji) {
              rollAtLeast = reaction.next.rollAtLeast;
              rollFailId = reaction.next.rollFailId;
              rollSuccessId = reaction.next.rollSuccessId;
            }
          });
        }
      })
    );
    return { rollAtLeast, rollFailId, rollSuccessId };
  };

  public nextStoryContent = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    currentPlotPointResult: Record<string, unknown>
  ): StoryContentModel => {
    let nextStoryContent = {} as StoryContentModel;
    let dice: number | undefined = undefined;
    let nextStoryId: number;

    Store.Stories.map((story) => {
      if (currentPlotPointResult.rollAtLeast !== null) {
        dice = this.getRandomInt(20);
        if (dice >= (currentPlotPointResult.rollAtLeast as number)) {
          nextStoryId = currentPlotPointResult.rollSuccessId as number;
        } else {
          nextStoryId = currentPlotPointResult.rollFailId as number;
        }
      } else {
        nextStoryId = currentPlotPointResult.rollSuccessId as number;
      }
      story.plotPoints.map((plotPoint) => {
        if (plotPoint.plotPointId === nextStoryId) {
          nextStoryContent = plotPoint;
          this.plotPointId = currentPlotPointResult.rollSuccessId as number;
        }
      });
    });
    new MessageSendComponent(channel, nextStoryContent, dice);

    return nextStoryContent;
  };

  public randomChoice = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  public getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  };
}
