import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import { ANSI_FG_GREEN, ANSI_FG_MAGENTA, ANSI_FG_RED, ANSI_RESET } from "../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import SendMessageDefaultComponent from "../components/SendMessageDefaultComponent";

export default class TestCommand {
  constructor(message: Message) {
    new SendMessageDefaultComponent(message.channel, ...new ConsoleTimeComponent(
      `Story `,
      ANSI_FG_GREEN,
      `Story ID `,
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
    
  }
}
