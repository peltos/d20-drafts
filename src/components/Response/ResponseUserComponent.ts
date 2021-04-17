import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import StartCommand from "../Commands/StartCommand";
import ConsoleTimeComponent from "../Console/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../../resources/ANSIEscapeCode";
import Store from "../../store/Store";

export default class ResponseUserComponent {
  private prefixChar = (process.env.PREFIX_CHAR as unknown) as string;
  private prefixWord = (process.env.PREFIX_WORD as unknown) as string;

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
        this.stopChannel(message);
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

  private stopChannel(message: Message) {
    Store.Timeouts.map((timeout) => {
      if (message.channel === timeout.channel) {
        clearTimeout(timeout.setTimeout);

        let counter = 0;
        Store.Stories.map((story) => {
          if (message.channel === story.channel) {
            // end of the story
            story.channel.send(
              [
                `---------------------------------------------------------------------\n`,
                `The story stopped\n`,
                `---------------------------------------------------------------------`
              ].join("") as string
            );
            new ConsoleTimeComponent(
              `Story `,
              ANSI_FG_GREEN,
              `${story.storyId.toUpperCase()} `,
              ANSI_RESET,
              "has ",
              ANSI_FG_RED,
              `ended `.toUpperCase(),
              ANSI_RESET,
              "on channel ",
              ANSI_FG_MAGENTA,
              `${message.channel.id} `,
              ANSI_RESET
            );

            Store.Stories.splice(counter, 1);
          }
          counter++;
        });
      }
    });
  }
}
