import fs from "fs";
import { Message } from "discord.js";
import StoryModel from "../models/StoryModel";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_GREEN,
  ANSI_FG_RED,
} from "../resources/ANSIEscapeCode";
import StoryReactionsModel from "../models/StoryReactionsModel";

const StartCommand = (message: Message, Stories: StoryModel[], storyId: string) => {
  ConsoleTimeComponent(ANSI_FG_YELLOW, "START ", ANSI_RESET, "command activated");

  let folder: any;
  let currentStory: any;

  if (storyId === undefined) {
    ConsoleTimeComponent(
      ANSI_FG_RED,
      "No story value detected. Please enter a story value in the command !start [value]",
      ANSI_RESET
    );
    return Stories;
  }

  try {
    folder = fs.readdirSync("./stories/");
    try {
      let storyArray = folder.map((file: any) => {
        let story = JSON.parse(
          (fs.readFileSync("./stories/" + file) as unknown) as string
        );
        if (storyId === story.id) return story;
      });

      if (storyArray[0]) currentStory = storyArray[0];
      if (!currentStory) {
        ConsoleTimeComponent(ANSI_FG_RED, "The story value not been found", ANSI_RESET);
      }
    } catch (err) {
      ConsoleTimeComponent(ANSI_FG_RED, "No files detected", ANSI_RESET);
    }
  } catch (err) {
    ConsoleTimeComponent(ANSI_FG_RED, "No directory detected", ANSI_RESET);
  }

  if(currentStory){
    // current message
    message.channel.send(currentStory.content[0].content).then((msg) => {
      // send to console
      ConsoleTimeComponent("Message send ", ANSI_FG_GREEN, "succesful", ANSI_RESET);

      currentStory.content[0].reactions.forEach(
        async (rection: StoryReactionsModel) => {
          await (msg as Message).react(rection.emoji);
        }
      );
    });
  }

  return currentStory;
};

export default StartCommand;
