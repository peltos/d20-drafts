import dotenv from "dotenv";
dotenv.config();

import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import Store from "../store/Store";
import SendMessageWarningComponent from "../components/SendMessage/SendMessageWarningComponent";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import WriteData from "../data/WriteData";
import {
  ANSI_FG_GREEN,
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_MAGENTA,
  ANSI_FG_YELLOW,
} from "../resources/ANSIEscapeCode";

export default class PauseCommand {
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = (
    process.env.PREFIX_WORD as unknown as string
  ).toLowerCase();

  constructor(channel: TextChannel | DMChannel | GroupDMChannel) {
    Store.Stories.map((story) => {
      if (channel.id === story.channel.id) {
        if(!story.active) {
          new SendMessageWarningComponent(
            story.channel,
            `The story on this channel is already paused. Use the "${this.prefixChar}${this.prefixWord} start [storyID]" command to start a story.`
          );
          return;
        }

        story.active = false;

        new SendMessageWarningComponent(
          story.channel,
          `The story on this channel has been paused`
        );

        new ConsoleTimeComponent(
          `Story `,
          ANSI_FG_GREEN,
          `${story.storyId.toUpperCase()} `,
          ANSI_RESET,
          "has ",
          ANSI_FG_YELLOW,
          `paused `.toUpperCase(),
          ANSI_RESET,
          "on channel ",
          ANSI_FG_MAGENTA,
          `${channel.id} `,
          ANSI_RESET
        );
        new WriteData();
      }
    });
  }
}
