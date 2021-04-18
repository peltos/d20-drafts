import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { Message } from "discord.js";
import ConsoleTimeComponent from "../Console/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_YELLOW,
  ANSI_FG_RED,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../../resources/ANSIEscapeCode";
import Store from "../../store/Store";
import StoryModel from "../../models/StoryModel";
import SendComponent from "../SendComponent";
import StoryPlotPointsModel from "../../models/StoryPlotPointsModel";

export default class StartCommand {
  private storyId = "";
  private currrentStoryPlotPointId = 0;
  private hitpoints = 0;
  private time = parseInt(process.env.TIME as string);
  private readStory = {} as StoryModel;
  private plotPoint = {} as StoryPlotPointsModel;

  constructor(message: Message, args: string[]) {
    new ConsoleTimeComponent(...new Msg().msgStartCommand()); // start command activated

    let checkActiveStoryInChannel = false;
    Store.Stories.map((story) => {
      if (story.channel === message.channel) checkActiveStoryInChannel = true;
    });
    if (checkActiveStoryInChannel) {
      new ConsoleTimeComponent(...new Msg().errorChannelhasStory()); // The channel already has an active story
      return;
    }

    this.initSettings(args); // Set all the settings

    if (this.storyId === "") {
      new ConsoleTimeComponent(...new Msg().errorNoStoryId()); // No Story id in the message
      return;
    }

    this.getStory(message); // get the right story from the folders

    if (!this.readStory.storyId) {
      new ConsoleTimeComponent(...new Msg().errorStoryNotFound(this.storyId)); // Story not found
      return;
    }
    const tempContent = this.plotPoint.content;

    this.plotPoint.content = [
      "----------------------\n",
      `Story: **${this.readStory.name}**\n`,
      `Hitpoints: **${this.readStory.hitpoints}**\n`,
      `Starting Plotpoint: **${this.readStory.currentPlotPointId}**\n`,
      `Time between plot points: **${this.calculateTime(this.readStory.time)}**\n`,
      "----------------------\n",
      this.plotPoint.content,
    ].join("");

    new SendComponent(this.readStory, this.plotPoint); // Send message
    this.plotPoint.content = tempContent;
    new ConsoleTimeComponent(
      ...new Msg().msgStartStory(this.readStory, message)
    ); // Story Started
  }

  private calculateTime(time: number) {
    let timeDuration = time / 1000
    const timeString = []

    // Weeks
    if(timeDuration >= 604800) {
      timeString.push(`${Math.floor(timeDuration / 604800)} week${Math.floor(timeDuration / 604800) > 1 ? 's' : ''} `)
      timeDuration = timeDuration % 86400;
    }

    // Days
    if(timeDuration >= 86400) {
      timeString.push(`${Math.floor(timeDuration / 86400)} day${Math.floor(timeDuration / 86400) > 1 ? 's' : ''} `)
      timeDuration = timeDuration % 86400;
    }

    // Hours
    if(timeDuration >= 3600) {
      timeString.push(`${Math.floor(timeDuration / 3600)} hour${Math.floor(timeDuration / 3600) > 1 ? 's' : ''} `)
      timeDuration = timeDuration % 3600;
    }

    // Minutes
    if(timeDuration >= 60) {
      timeString.push(`${Math.floor(timeDuration / 60)} minute${Math.floor(timeDuration / 60) > 1 ? 's' : ''} `)
      timeDuration = timeDuration % 60;
    }

    // Seconds
    if(Math.floor(timeDuration) > 0) {
      timeString.push(`${Math.floor(timeDuration)} second${timeDuration > 1 ? 's' : ''} `)
    }

    return timeString.join("");
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
          this.time = (parseFloat(settings[1]) * 1000) <= 2147483647 ? parseFloat(settings[1]) * 1000 : 2147483647;
          break;
      }
    });
  }

  private getStory(message: Message) {
    try {
      const folder = fs.readdirSync("./stories/");

      folder.map((storyFolder) => {
        const currentStory = JSON.parse(
          (fs.readFileSync(
            `./stories/${storyFolder}/story.json`
          ) as unknown) as string
        ) as StoryModel;

        if (currentStory.storyId === this.storyId) {
          this.readStory = currentStory;
          this.readStory.hitpoints =
            this.hitpoints === 0 ? this.readStory.hitpoints : this.hitpoints;
          this.readStory.currentPlotPointId = this.readStory.plotPoints.length >= this.currrentStoryPlotPointId ? this.currrentStoryPlotPointId : 0;
          this.readStory.time = this.time;
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
      new ConsoleTimeComponent(...new Msg().errornoDirectory());
    }
    Store.Stories.push(this.readStory);
  }
}

class Msg {
  private prefixChar = (process.env.PREFIX_CHAR as unknown) as string;
  private prefixWord = (process.env.PREFIX_WORD as unknown) as string;

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

  public errorChannelhasStory() {
    return [ANSI_FG_RED, `The channel already has an active story`, ANSI_RESET];
  }

  public errorNoStoryId() {
    return [
      ANSI_FG_RED,
      `No story id detected. Please enter a story id in the command ${this.prefixChar}${this.prefixWord} start [storyId]`,
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
}
