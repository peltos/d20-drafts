import fs from "fs";
import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_GREEN,
  ANSI_FG_RED,
} from "../resources/ANSIEscapeCode";
import StoryReactionsModel from "../models/StoryReactionsModel";
import Store from "../store/Store";
import StoryModel from "../models/StoryModel";
import PlotPointCount from "../models/PlotPointCount";
import SendMessageComponent from "../components/discord/SendMessageComponent";

const StartCommand = (message: Message, storyId: string) => {
  ConsoleTimeComponent(ANSI_FG_YELLOW, "START ", ANSI_RESET, "command activated");

  let folder: any;
  let currentStory = {} as StoryModel;

  if (storyId === undefined) {
    ConsoleTimeComponent(
      ANSI_FG_RED,
      "No story value detected. Please enter a story value in the command !start [value]",
      ANSI_RESET
    );
    return;
  }

  try {
    folder = fs.readdirSync("./stories/");
    try {
      folder.map((file: any) => {
        let story = JSON.parse(
          (fs.readFileSync(`./stories/${file}`) as unknown) as string
        ) as StoryModel;
        if (storyId === story.storyId) {
          currentStory = story;
          return;
        }
      });

      // check if there is anything in the file
      if (!currentStory) {
        ConsoleTimeComponent(ANSI_FG_RED, "The story value not been found", ANSI_RESET);
      }

      let currentReactionCount = {
        storyId: currentStory.storyId,
        plotPointId: currentStory.content[0].plotPointId,
      } as PlotPointCount;

      Store.PlotPointCount.push(currentReactionCount);
      Store.Stories.push(currentStory);
    } catch (err) {
      ConsoleTimeComponent(ANSI_FG_RED, "No files detected", ANSI_RESET);
    }
  } catch (err) {
    ConsoleTimeComponent(ANSI_FG_RED, "No directory detected", ANSI_RESET);
  }

  if (currentStory) {
    SendMessageComponent(message.channel, currentStory);
  }

  return;
};

export default StartCommand;
