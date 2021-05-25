import dotenv from "dotenv";
dotenv.config();

import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import WriteData from "../data/WriteData";
import SendMessageWarningComponent from "../components/SendMessage/SendMessageWarningComponent";

export default class StopCommand {
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = (
    process.env.PREFIX_WORD as unknown as string
  ).toLowerCase();

  constructor(
    channel: TextChannel | DMChannel | GroupDMChannel,
    sendMessage = true,
    args: string[] = []
  ) {
    console.log(args);

    // eslint-disable-next-line prefer-const
    let storyActive = false;

    Store.Stories.map((story) => {
      if (channel.id === story.channel.id) {
        const index = Store.Stories.indexOf(story);
        if (index > -1) {
          storyActive = true;

          if (args.length <= 0) {
            new SendMessageWarningComponent(
              channel,
              `Are you sure you want to stop this story permanently? Enter "${this.prefixChar}${this.prefixWord} stop yes"`
            );
          }

          args.map((arg) => {
            const settings = arg.split(":");
            switch (settings[0]) {
              case "yes":
              case "y":
                Store.Stories.splice(index, 1);

                story.channel = channel; // story.channel is not reconized with a restart of the bot. Reset it with message.channel

                if (sendMessage) {
                  new SendMessageWarningComponent(
                    channel,
                    `The story on this channel has been stopped`
                  );
                }

                new ConsoleTimeComponent(
                  `Story `,
                  ANSI_FG_GREEN,
                  `${story.storyId.toUpperCase()} `,
                  ANSI_RESET,
                  "has been ",
                  ANSI_FG_RED,
                  `stopped `.toUpperCase(),
                  ANSI_RESET,
                  "on channel ",
                  ANSI_FG_MAGENTA,
                  `${channel.id} `,
                  ANSI_RESET
                );
                new WriteData();

                break;
            }
          });
        }
      }
    });

    if (!storyActive) {
      new SendMessageWarningComponent(
        channel,
        `There is no story active on this channel. Use the "${this.prefixChar}${this.prefixWord} start [storyID]" command to start a story.`
      );
    }
  }
}
