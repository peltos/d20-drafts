import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import StoryModel from "../models/StoryModel";
import SendMessageStoryComponent from "../components/SendMessage/SendMessageStoryComponent";
import SendMessageWarningComponent from "../components/SendMessage/SendMessageWarningComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";
import StatsCommand from "./StatsCommand";

export default class StartCommand {
  private storyId = "";
  private currrentStoryPlotPointId = 0;
  private hitpoints = 0;
  private time = parseInt(process.env.TIME as string);
  private readStory = {} as StoryModel;
  private plotPoint = {} as StoryPlotPointsModel;

  constructor(message: Message, args: string[]) {
    // check if there are active stories
    let activeStory = false;
    Store.Stories.map((story) => {
      if (story.channel) {
        if (message.channel.id === story.channel.id) {
          new SendMessageWarningComponent(
            message.channel,
            ...new ConsoleTimeComponent(...new Msg().alreadyActiveStory())
              .messages
          );
          activeStory = true;
        }
      }
    });

    if (activeStory) return;

    this.initSettings(args); // Set all the settings

    if (this.storyId === "") {
      new SendMessageWarningComponent(
        message.channel,
        ...new ConsoleTimeComponent(...new Msg().errorNoStoryId()).messages
      ); // No Story id in the message
      return;
    }

    this.getStory(message); // get the right story from the folders

    if (!this.readStory.storyId) {
      if (this.storyId === undefined) {
        new SendMessageWarningComponent(
          message.channel,
          ...new ConsoleTimeComponent(
            ...new Msg().errorStoryNotInserted()
          ).messages
        ); // No ID inserted in the command
        return;
      }

      new SendMessageWarningComponent(
        message.channel,
        ...new ConsoleTimeComponent(
          ...new Msg().errorStoryNotFound(this.storyId)
        ).messages
      ); // Story if not found
      return;
    }

    new StatsCommand(message.channel);

    new SendMessageStoryComponent(this.readStory, this.plotPoint); // Send message

    new ConsoleTimeComponent(
      ...new Msg().msgStartStory(this.readStory, message)
    ); // Story Started
  }

  private initSettings(args: string[]) {
    this.storyId = args.shift() as string;

    args.map((arg) => {
      const settings = arg.split(":");
      switch (settings[0]) {
        case "plotpoint":
          this.currrentStoryPlotPointId = parseInt(settings[1]);
          break;

        case "hp":
          this.hitpoints = parseInt(settings[1]);
          break;

        case "time":
          this.time =
            parseFloat(settings[1]) * 60000 <= 2147483647
              ? parseFloat(settings[1]) * 60000
              : 2147483647;
          break;
      }
    });
  }

  private getStory(message: Message) {
    try {
      const folder = fs.readdirSync("./stories/");

      folder.map((storyFile) => {
        const currentStory = JSON.parse(
          fs.readFileSync(
            `./stories/${storyFile}`
          ) as unknown as string
        ) as StoryModel;

        if (currentStory.storyId === this.storyId) {
          this.readStory = currentStory;
          this.readStory.hitpoints =
            this.hitpoints === 0 ? this.readStory.hitpoints : this.hitpoints;
          this.readStory.currentPlotPointId =
            this.readStory.plotPoints.length >= this.currrentStoryPlotPointId
              ? this.currrentStoryPlotPointId
              : 0;
          this.readStory.delay = this.time;
          this.readStory.startTime = new Date().getTime();
          this.readStory.active = true;
          this.readStory.storyEnded = false;
          this.readStory.channel = message.channel;

          this.readStory.plotPoints.map((pp) => {
            if (pp.plotPointId === this.readStory.currentPlotPointId) {
              this.plotPoint = pp;
            }
          });
          
        }
      });
    } catch {
      new SendMessageWarningComponent(
        message.channel,
        ...new ConsoleTimeComponent(...new Msg().errornoDirectory()).messages
      );
    }
    Store.Stories.push(this.readStory);
  }
}

class Msg {
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = process.env.PREFIX_WORD as unknown as string;

  public msgStartCommand() {
    return [ANSI_FG_YELLOW, "START ", ANSI_RESET, "command activated"];
  }

  public msgStartStory(readStory: StoryModel, message: Message) {
    return [
      `Story `,
      ANSI_FG_GREEN,
      `${readStory.storyId.toUpperCase()} `,
      ANSI_RESET,
      "has ",
      ANSI_FG_GREEN,
      `STARTED `,
      ANSI_RESET,
      "on channel ",
      ANSI_FG_MAGENTA,
      `${message.channel.id} `,
      ANSI_RESET,
    ];
  }

  public errorNoStoryId() {
    return [
      ANSI_FG_RED,
      `No story id detected. Please enter a story id in the command "${this.prefixChar}${this.prefixWord} start [storyId]"`,
      ANSI_RESET,
    ];
  }

  public errorStoryNotInserted() {
    return [
      ANSI_FG_RED,
      `No story ID was inserted. Please enter a story id in the command "${this.prefixChar}${this.prefixWord} start [storyId]"`,
      ANSI_RESET,
    ];
  }

  public errorStoryNotFound(storyId: string) {
    return [
      ANSI_FG_RED,
      `Story `,
      ANSI_RESET,
      `${storyId.toUpperCase()} `,
      ANSI_FG_RED,
      "not found. Check if the files are in the right folder ",
      ANSI_RESET,
    ];
  }

  public errornoDirectory() {
    return [ANSI_FG_RED, "No directory detected", ANSI_RESET];
  }

  public alreadyActiveStory() {
    return [
      ANSI_FG_RED,
      `The channel already has an active story or a story thats been paused. If it's paused, please enter "${this.prefixChar}${this.prefixWord} reload"`,
      ANSI_RESET,
    ];
  }
}
