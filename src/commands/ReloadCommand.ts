import dotenv from "dotenv";
dotenv.config();

import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import Store from "../store/Store";
import SendMessageStoryComponent from "../components/SendMessage/SendMessageStoryComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StatsCommand from "./StatsCommand";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import { ANSI_FG_GREEN, ANSI_RESET, ANSI_FG_RED, ANSI_FG_MAGENTA } from "../resources/ANSIEscapeCode";
import SendMessageWarningComponent from "../components/SendMessage/SendMessageWarningComponent";

export default class ReloadCommand {
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = (
    process.env.PREFIX_WORD as unknown as string
  ).toLowerCase();

  constructor(channel: TextChannel | DMChannel | GroupDMChannel) {
    let storyDetected = false;

    Store.Stories.map((story) => {
      if (channel.id === story.channel.id) {
        storyDetected = true;

        story.channel = channel; // story.channel is not reconized with a restart of the bot. Remake it with message.channel

        if (story.active) {
          new SendMessageWarningComponent(
            channel,
            `There is already an active story on this channel.`
          );
        }

        let currentPlotPoint = {} as StoryPlotPointsModel;
        story.plotPoints.map((pp) => {
          if (pp.plotPointId === story.currentPlotPointId) {
            currentPlotPoint = pp;
          }
        });

        story.active = true; // set it active
        story.startTime = new Date().getTime(); // set a new start time

        new StatsCommand(channel);

        new ConsoleTimeComponent(
          `Story `,
          ANSI_FG_GREEN,
          `${story.storyId.toUpperCase()} `,
          ANSI_RESET,
          "has ",
          ANSI_FG_GREEN,
          `reloaded `.toUpperCase(),
          ANSI_RESET,
          "on channel ",
          ANSI_FG_MAGENTA,
          `${channel.id} `,
          ANSI_RESET
        );

        new SendMessageStoryComponent(story, currentPlotPoint); // Send message
      }
    });

    if(!storyDetected) {
      new SendMessageWarningComponent(
        channel,
        `There is no story on this channel. Use the "${this.prefixChar}${this.prefixWord} start [storyID]" command to start a story.`
      );
    }
  }
}
