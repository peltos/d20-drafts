import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/Console/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import WriteData from "../data/WriteData";

export default class StopCommand {

  constructor(message: Message) {
    Store.Timeouts.map((timeout) => {
      if (message.channel.id === timeout.channel.id) {
        clearTimeout(timeout.setTimeout);

        let counter = 0;
        Store.Stories.map((story) => {
          if (message.channel.id === story.channel.id) {
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
            new WriteData()
          }
          counter++;
        });
      }
    });
  }
}
