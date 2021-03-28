import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_CYAN, ANSI_FG_MAGENTA } from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import MessageSendComponent from "./MessageSendComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StoryReactionsModel from "../models/StoryReactionsModel";

export default class MessageNextComponent {
  public highestVoteEmoji = "";
  public plotPointId = 0;
  public currentPlotPoint = {} as StoryPlotPointsModel;
  public storyEnd = false;
  public channel: TextChannel | DMChannel | GroupDMChannel;
  public remainingHp = 0;

  constructor(
    message: Message,
    plotPointId: number,
    channel: TextChannel | DMChannel | GroupDMChannel
  ) {
    this.plotPointId = plotPointId;
    this.channel = channel;

    this.checkHighestVoteEmoji(message);
    this.initPlotPoint();
    const currentPlotPointResult = this.currentPlotPointResult();

    if (!this.storyEnd) {
      this.nextStoryPlotPoint(message.channel, currentPlotPointResult);

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
        "of channel ",
        ANSI_FG_MAGENTA,
        `${message.channel.id} `,
        ANSI_RESET,
        "has chosen ",
        `${this.highestVoteEmoji} `
      );
    }
  }

  public valueOf = (): void => {
    return;
  };

  public checkHighestVoteEmoji = (message: Message): void => {
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
  };

  private initPlotPoint = () => {
    Store.Stories.map((story) =>
      story.plotPoints.map((plotPoint) => {
        if (plotPoint.plotPointId === this.plotPointId) {
          this.currentPlotPoint = plotPoint;
        }
      })
    );
  };

  public currentPlotPointResult = (): Record<string, unknown> => {
    let deathId: number | null = null;
    let rollAtLeast: number | null = null;
    let rollDamage: string | null = null;
    let rollFailId: number | null = null;
    let rollSuccessId = 0;

    if (!this.currentPlotPoint.reactions) {
      this.storyEnd = true;
      return {};
    }
    (this.currentPlotPoint.reactions as StoryReactionsModel[]).map((reaction) => {
      if (reaction.emoji === this.highestVoteEmoji) {
        deathId = reaction.next.deathId;
        rollAtLeast = reaction.next.rollAtLeast;
        rollDamage = reaction.next.rollDamage;
        rollFailId = reaction.next.rollFailId;
        rollSuccessId = reaction.next.rollSuccessId;
      }
    });

    return { deathId, rollAtLeast, rollFailId, rollDamage, rollSuccessId };
  };

  public nextStoryPlotPoint = (
    channel: TextChannel | DMChannel | GroupDMChannel,
    currentPlotPointResult: Record<string, unknown>
  ): StoryPlotPointsModel => {
    let nextStoryPlotPoint = {} as StoryPlotPointsModel;
    let chanceDice: number | undefined = undefined;
    let damageDice: string[] | undefined = undefined;
    let damageRolls: number[] | undefined = undefined;
    let nextStoryId: number;

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
        nextStoryId = Store.PlotProgression.map((progression): number => {
          let progressionStoryId = 0;
          if (progression.channel === channel) {
            progression.hitpoints -= (damageRolls as number[]).reduce((a, b) => a + b, 0);
            this.remainingHp = progression.hitpoints;

            if (progression.hitpoints <= 0) {
              progressionStoryId = currentPlotPointResult.deathId as number;
            } else {
              progressionStoryId = currentPlotPointResult.rollFailId as number;
            }
          }
          return progressionStoryId as number;
        })[0];
      }
    } else {
      nextStoryId = currentPlotPointResult.rollSuccessId as number;
    }

    Store.Stories.map((story) => {
      story.plotPoints.map((pp) => {
        if (pp.plotPointId === nextStoryId) {
          nextStoryPlotPoint = {
            content: pp.content,
            fileDestination: pp.fileDestination,
            plotPointId: pp.plotPointId,
            reactions: pp.reactions,
          } as StoryPlotPointsModel;
        }
      });
    });

    this.plotPointId = nextStoryId;

    new MessageSendComponent(
      channel,
      nextStoryPlotPoint,
      chanceDice,
      damageDice,
      damageRolls,
      this.remainingHp
    );

    return nextStoryPlotPoint;
  };

  public randomChoice = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  public getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  };
}
