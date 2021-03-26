import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_CYAN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import MessageSendComponent from "./MessageSendComponent";
import StoryContentModel from "../models/StoryContentModel";
import StoryReactionsModel from "../models/StoryReactionsModel";

export default class MessageNextComponent {
  public highestVoteEmoji = "";
  public plotPointId = 0;
  public storyEnd = false;
  public channel: TextChannel | DMChannel | GroupDMChannel;

  constructor(
    message: Message,
    plotPointId: number,
    channel: TextChannel | DMChannel | GroupDMChannel
  ) {
    this.plotPointId = plotPointId;
    this.channel = channel;
    let currentHighestCount: number | undefined = undefined;
    message.reactions.map((reaction) => {
      if (reaction.me) {
        // check if it's a valid reaction
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

    const currentPlotPointResult = this.currentPlotPointResult();

    if(!this.storyEnd){
      this.nextStoryContent(message.channel, currentPlotPointResult);

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
  }
  public valueOf = (): void => {
    return;
  };

  public currentPlotPointResult = (): Record<string, unknown> => {
    let deathId: number | null = null;
    let rollAtLeast: number | null = null;
    let rollDamage: string | null = null;
    let rollFailId: number | null = null;
    let rollSuccessId = 0;

    Store.Stories.map((story) =>
      story.plotPoints.map((plotPoint) => {
        if (plotPoint.plotPointId === this.plotPointId) {
          if(!plotPoint.reactions) return this.storyEnd = true;
          (plotPoint.reactions as StoryReactionsModel[]).map((reaction) => {
            if (reaction.emoji === this.highestVoteEmoji) {
              deathId = reaction.next.deathId;
              rollAtLeast = reaction.next.rollAtLeast;
              rollDamage = reaction.next.rollDamage;
              rollFailId = reaction.next.rollFailId;
              rollSuccessId = reaction.next.rollSuccessId;
            }
          });
        }
      })
    );

    return { deathId, rollAtLeast, rollFailId, rollDamage, rollSuccessId };
  };

  public nextStoryContent = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    currentPlotPointResult: Record<string, unknown>
  ): StoryContentModel => {
    let nextStoryContent = {} as StoryContentModel;
    let chanceDice: number | undefined = undefined;
    let damageDice: string[] | undefined = undefined;
    let damageRolls: number[] | undefined = undefined;
    let nextStoryId: number;

    Store.Stories.map((story) => {
      let currentPlotPointId = this.plotPointId;

      story.plotPoints.map((plotPoint) => {
        if (plotPoint.plotPointId === this.plotPointId) {
          if (
            currentPlotPointResult.deathId !== null &&
            currentPlotPointResult.rollAtLeast !== null &&
            currentPlotPointResult.rollDamage !== null &&
            currentPlotPointResult.rollFailId !== null
          ) {
            chanceDice = this.getRandomInt(20);
            if (chanceDice >= (currentPlotPointResult.rollAtLeast as number)) {
              nextStoryId = currentPlotPointResult.rollSuccessId as number;
            } else {
              damageDice = (currentPlotPointResult.rollDamage as string).split("d");
              damageRolls = [];

              for (let i = 0; i < parseInt(damageDice[0]); i++) {
                damageRolls.push(this.getRandomInt(parseInt(damageDice[1])));
              }
              story.hitpoints -= damageRolls.reduce((a, b) => a + b, 0);

              if (story.hitpoints <= 0) {
                nextStoryId = currentPlotPointResult.deathId as number;
              } else {
                nextStoryId = currentPlotPointResult.rollFailId as number;
              }
            }
          } else {
            nextStoryId = currentPlotPointResult.rollSuccessId as number;
          }
          story.plotPoints.map((plotPoint) => {
            if (plotPoint.plotPointId === nextStoryId) {
              nextStoryContent = plotPoint;
              currentPlotPointId = nextStoryId;
            }
          });
        }
      });

      this.plotPointId = currentPlotPointId;
    });
    new MessageSendComponent(
      channel,
      nextStoryContent,
      chanceDice,
      damageDice,
      damageRolls
    );

    return nextStoryContent;
  };

  public randomChoice = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  public getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  };
}
