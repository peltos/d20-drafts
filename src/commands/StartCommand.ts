import glob from "glob";
import fs from "fs";
import { Message } from "discord.js";
import StoryModel from "../models/StoryModel";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import CONFIG from "../../config";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_GREEN,
} from "../resources/ANSIEscapeCode";

const StartCommand = (
  message: Message,
  Stories: StoryModel[],
  storyId: string
) => {
  // send to console
  ConsoleTimeComponent(
    ANSI_FG_YELLOW,
    "START ",
    ANSI_RESET,
    "command activated"
  );

  glob("./stories/*.json", (err: any, files: any) => {
    // read JSON files in this folder
    if(err) console.log("cannot read the folder, something goes wrong with glob", err);
    files.map((file: any) => {
      fs.readFile(file, "utf8", (err: any, data: any) => {
        // Read each file
        if(err) console.log("cannot read the file, something goes wrong with the file", err);
        let currentStory = JSON.parse(data);
        if (storyId === currentStory.id) {
          Stories = currentStory;
          FileResult(currentStory);
        }
      });
    });
  });

  const FileResult = (story: any) => {
    console.log(Stories);
  };

  // current message
  message.channel
    .send(`The story starts here! chose the route you want!`)
    .then(async (msg) => {
      // send to console
      ConsoleTimeComponent(
        "Message send ",
        ANSI_FG_GREEN,
        "succesful",
        ANSI_RESET
      );

      await (msg as Message).react(CONFIG.REACT_ONE);
      await (msg as Message).react(CONFIG.REACT_TWO);
      await (msg as Message).react(CONFIG.REACT_THREE);
      await (msg as Message).react(CONFIG.REACT_FOUR);
    });
  return Stories;
};

export default StartCommand;
