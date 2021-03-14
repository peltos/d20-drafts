import { Client, MessageReaction, User } from "discord.js";
import ConsoleTimeComponent from "../ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_BLUE,
  ANSI_FG_MAGENTA,
} from "../../resources/ANSIEscapeCode";
import Store from "../../store/Store";
import ReactionsCountReactions from "../../models/PlotPointCountReactionsModel";
import SendMessageComponent from "./SendMessageComponent";
import StoryContentModel from "../../models/StoryContentModel";

export default class MessageReactionComponent {
  constructor(client: Client) {
    client.on("messageReactionRemove", (reaction, user) => {
      this.MessageReaction(reaction, user, "REMOVE");
    });

    client.on("messageReactionAdd", (reaction, user) => {
      this.MessageReaction(reaction, user, "ADD");
    });
  }
  // When a Reaction has been given. This is not the same as a Reply
  public MessageReaction = (
    reaction: MessageReaction,
    user: User,
    type: string
  ): unknown => {
    if (user.bot) return [];

    const reactId = reaction.emoji.name;
    const messageId = (reaction.message.id as unknown) as number;
    const count = reaction.count;

    // send to console
    new ConsoleTimeComponent(
      ANSI_FG_BLUE,
      `Discord Client MessageReaction ${type} `,
      ANSI_RESET,
      "event with ",
      `${reactId}  `,
      "on ",
      ANSI_FG_MAGENTA,
      messageId.toString(),
      ANSI_RESET
    );

    this.setReactionCount(reaction, reactId, count);

    const highestCurrentVote = this.highestCurrentVote(reaction);
    console.log(highestCurrentVote);
    const currentPlotPointResult = this.currentPlotPointResult(highestCurrentVote);
    console.log(currentPlotPointResult);
    const nextStoryContent = this.nextStoryContent(reaction, currentPlotPointResult);
    console.log(nextStoryContent);
  };

  public setReactionCount = (
    reaction: MessageReaction,
    reactId: string,
    count: number
  ): void => {
    let PlotPointCounter = 0;
    Store.PlotPointCount.map((plotPointCount) => {
      if (plotPointCount.messageId === reaction.message.id) {
        // check if there are already some reactions given
        if (Store.PlotPointCount[PlotPointCounter].reactions === undefined) {
          Store.PlotPointCount[
            PlotPointCounter
          ].reactions = [] as ReactionsCountReactions[];

          Store.PlotPointCount[PlotPointCounter].reactions.push({
            emoji: reactId,
            count: count,
          });
        } else {
          let emojiExist = false;
          let PlotPointReactionCounter = 0;

          // check the amount of reactions already given
          Store.PlotPointCount[PlotPointCounter].reactions.map((react) => {
            // if this type of reaction already exist, increment the counter
            if (reactId === react.emoji) {
              Store.PlotPointCount[PlotPointCounter].reactions[
                PlotPointReactionCounter
              ].count = count;
              emojiExist = true;
            }
            PlotPointReactionCounter++;
          });

          // if the current type of reaction is unknown, add it to the list
          if (!emojiExist)
            Store.PlotPointCount[PlotPointCounter].reactions.push({
              emoji: reactId,
              count: count,
            });
        }
      }
      PlotPointCounter++;
    });
  };

  public highestCurrentVote = (reaction: MessageReaction): Record<string, unknown> => {
    let highestVoteEmoji = "";
    let storyId = "";
    let plotPointId = 0;

    Store.PlotPointCount.map((plotPointCount) => {

      if (plotPointCount.messageId === reaction.message.id) {
        storyId = plotPointCount.storyId;
        plotPointId = plotPointCount.plotPointId;

        let highestVote = 0;
        plotPointCount.reactions.map((reaction) => {

          if (highestVoteEmoji === "") {
            highestVoteEmoji = reaction.emoji;
            highestVote = reaction.count;
          } else {
            if (highestVote < reaction.count) {
              highestVoteEmoji = reaction.emoji;
              highestVote = reaction.count;
            }
            if (highestVote === reaction.count) {
              highestVoteEmoji = this.randomChoice([highestVoteEmoji, reaction.emoji]);
            }
          }
        });
      }
    });
    return { highestVoteEmoji, storyId, plotPointId };
  };

  public currentPlotPointResult = (
    highestCurrentVote: Record<string, unknown>
  ): Record<string, unknown> => {
    const storyId = highestCurrentVote.storyId;
    let rollAtLeast: number | null = null;
    let rollFailId: number | null = null;
    let rollSuccessId = 0;

    Store.Stories.map((story) => {
      if (story.storyId === storyId) {
        story.content.map((content) => {
          if (content.plotPointId === highestCurrentVote.plotPointId) {
            content.reactions.map((reaction) => {
              if (reaction.emoji === highestCurrentVote.highestVoteEmoji) {
                rollAtLeast = reaction.next.rollAtLeast;
                rollFailId = reaction.next.rollFailId;
                rollSuccessId = reaction.next.rollSuccessId;
              }
            });
          }
        });
      }
    });
    return { rollAtLeast, storyId, rollFailId, rollSuccessId };
  };

  public nextStoryContent = (
    reaction: MessageReaction,
    currentPlotPointResult: Record<string, unknown>
  ): StoryContentModel => {
    let nextStoryContent = {} as StoryContentModel;
    let dice: number | undefined = undefined;
    let nextStoryId: number;

    Store.Stories.map((story) => {
      if (story.storyId === currentPlotPointResult.storyId) {
        if(currentPlotPointResult.rollAtLeast !== null) {
          dice = this.getRandomInt(20);
          if(dice >= (currentPlotPointResult.rollAtLeast as number)) {
            nextStoryId = currentPlotPointResult.rollSuccessId as number
          } else {
            nextStoryId = currentPlotPointResult.rollFailId as number
          }
        } else {
          nextStoryId = currentPlotPointResult.rollSuccessId as number
        }
        story.content.map((content) => {
          if (content.plotPointId === nextStoryId) {
            nextStoryContent = content;

            Store.PlotPointCount.map((plotPointCount) => {
              if (plotPointCount.messageId === reaction.message.id) {
                plotPointCount.plotPointId = currentPlotPointResult.rollSuccessId as number;
                plotPointCount.reactions = [];
              }
            });
          }
        });
      }
    });
    new SendMessageComponent(reaction.message.channel, nextStoryContent, dice);

    return nextStoryContent;
  };

  public randomChoice = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  public getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
}
