import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import WriteData from "../data/WriteData";
import SendMessageDefaultComponent from "../components/SendMessageDefaultComponent";

export default class RemoveCommand {
  constructor(message: Message) {
    Store.Stories.map((story) => {
      if (message.channel.id === story.channel.id) {
        const index = Store.Stories.indexOf(story);
        if (index > -1) {
          Store.Stories.splice(index, 1);

          message.channel.send(
            [
              `---------------------------------------------------------------------\n`,
              `The story stopped\n`,
              `---------------------------------------------------------------------`,
            ].join("")
          );

          new SendMessageDefaultComponent(message.channel, ...new ConsoleTimeComponent(
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
          ).messages);
          new WriteData();
        }
      }
    });
  }
}
