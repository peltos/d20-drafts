import { Message } from "discord.js";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_CYAN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import SendMessageStoryComponent from "./SendMessageStoryComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StoryReactionsModel from "../models/StoryReactionsModel";
import StoryModel from "../models/StoryModel";

export default class ResultComponent {
  public highestVoteEmoji = "";
  public currentPlotPoint = {} as StoryPlotPointsModel;
  public story = {} as StoryModel;

  constructor(
    message: Message,
    story: StoryModel,
    plotPoint: StoryPlotPointsModel
  ) {
    this.story = story;
    this.currentPlotPoint = plotPoint;

    this.checkHighestVote(message); // Check the highest vote
    const currentPlotPointResult = this.currentPlotPointResult(); 
    
    if (!this.story.storyEnded) {
      new ConsoleTimeComponent(
        ANSI_FG_CYAN,
        `Plot Point `,
        ANSI_RESET,
        ANSI_FG_MAGENTA,
        `${this.story.currentPlotPointId} `,
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

      this.nextStoryPlotPoint(currentPlotPointResult);
    }
  }

  public checkHighestVote = (message: Message): void => {
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

  public currentPlotPointResult = (): StoryReactionsModel => {
    let currentReactions = {} as StoryReactionsModel;

    if (!this.currentPlotPoint.reactions) {
      this.story.storyEnded = true;
      return {} as StoryReactionsModel;
    }
    (this.currentPlotPoint.reactions as StoryReactionsModel[]).map(
      (reaction) => {
        if (reaction.emoji === this.highestVoteEmoji) {
          currentReactions = reaction;
        }
      }
    );

    return currentReactions;
  };

  public nextStoryPlotPoint = (
    currentPlotPointResult: StoryReactionsModel
  ): StoryPlotPointsModel => {
    let nextStoryPlotPoint = {} as StoryPlotPointsModel;
    let chanceDice: number | undefined = undefined;
    let damageDice: string[] | undefined = undefined;
    let damageRolls: number[] | undefined = undefined;
    let success = true;

    if(!currentPlotPointResult.next) return nextStoryPlotPoint

    if ( // check if there is a dice roll to be made
      currentPlotPointResult.next.rollAtLeast !== null &&
      currentPlotPointResult.next.rollFailId !== null
    ) {
      chanceDice = this.getRandomInt(20); // random roll 

      if (chanceDice >= (currentPlotPointResult.next.rollAtLeast as number)) {
        this.story.currentPlotPointId = currentPlotPointResult.next.rollSuccessId as number; // Success story after dice
      } else {
        if ( // check if there is a dice roll to be made
          currentPlotPointResult.next.deathId !== null &&
          currentPlotPointResult.next.rollDamage !== null
        ) {
          damageDice = (currentPlotPointResult.next.rollDamage as string).split("d");
          damageRolls = [];

          for (let i = 0; i < parseInt(damageDice[0]); i++) {
            damageRolls.push(this.getRandomInt(parseInt(damageDice[1])));
          }

          const totalDamge = (damageRolls as number[]).reduce( // reduce HitPoints
            (a, b) => a + b,
            0
          );

          this.story.hitpoints -= totalDamge;
        }
        success = false;
        
        if (this.story.hitpoints <= 0) {
          this.story.currentPlotPointId = currentPlotPointResult.next.deathId as number; // Death story
        } else {
          this.story.currentPlotPointId = currentPlotPointResult.next.rollFailId as number; // Fail story
        }
      }
    } else {
      this.story.currentPlotPointId = currentPlotPointResult.next.rollSuccessId as number; // Success story with no dice
    }

    this.story.plotPoints.map((pp) => {
      if (pp.plotPointId === this.story.currentPlotPointId) {
        nextStoryPlotPoint = pp
        if(!pp.reactions) {
          this.story.storyEnded = true;
        }
      }
    });
    

    new SendMessageStoryComponent(
      this.story,
      nextStoryPlotPoint,
      chanceDice,
      damageDice,
      damageRolls,
      this.story.hitpoints,
      success
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
