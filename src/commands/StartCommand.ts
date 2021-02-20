import { Message } from "discord.js";
import StoryModel from "../models/StoryModel";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import CONFIG from "../../config";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_GREEN,
} from "../resources/ANSIEscapeCode";

const StartCommand = async (message: Message, Stories: StoryModel[]) => {
  // send to console
  ConsoleTimeComponent(
    ANSI_FG_YELLOW,
    "START ",
    ANSI_RESET,
    "command activated"
  );

  // current message
  const timeTaken = Date.now() - message.createdTimestamp;
  await message
    .reply(`The story starts here! chose the route you want! ${timeTaken}`)
    .then(async (msg) => {
      // send to console
      ConsoleTimeComponent(
        "Message send ",
        ANSI_FG_GREEN,
        "succesful",
        ANSI_RESET
      );

      Stories.push({
        id: (msg as Message).id,
        reactions: [],
      });
      await (msg as Message).react(CONFIG.REACT_ONE);
      await (msg as Message).react(CONFIG.REACT_TWO);
      await (msg as Message).react(CONFIG.REACT_THREE);
      await (msg as Message).react(CONFIG.REACT_FOUR);
    });
  return Stories;
};

export default StartCommand;
