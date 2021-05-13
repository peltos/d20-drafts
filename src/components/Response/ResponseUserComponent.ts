import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import StartCommand from "../Commands/StartCommand";
import StopCommand from "../Commands/StopCommand";
import ReloadCommand from "../Commands/ReloadCommand";
import ConsoleTimeComponent from "../Console/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
} from "../../resources/ANSIEscapeCode";

export default class ResponseUserComponent {
  private prefixChar = (process.env.PREFIX_CHAR as unknown) as string;
  private prefixWord = ((process.env.PREFIX_WORD as unknown) as string).toLowerCase();

  constructor(message: Message) {
    const args = this.initMessage(message);
    if (args.length === 0) return; // nothing happens if the command is wrong

    const command = args.shift()?.toLowerCase();

    // Commands
    switch (command) {
      case "start":
        new StartCommand(message, args);
        break;
      case "stop":
        new StopCommand(message);
        break;
      case "reload":
        new ReloadCommand(message);
        break;
      default:
        new ConsoleTimeComponent(
          ANSI_FG_RED,
          "Command ",
          ANSI_RESET,
          `${command?.toUpperCase() as string} `,
          ANSI_FG_RED,
          "not found",
          ANSI_RESET
        );
    }
  }

  private initMessage(message: Message): string[] {
    if (!message.content.startsWith(this.prefixChar)) return [];
    const args = message.content.slice(this.prefixChar.length).split(" ");
    if (args.shift() !== this.prefixWord) return [];
    return args;
  }
}
