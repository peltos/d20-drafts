import fs from "fs";
import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_YELLOW, ANSI_FG_RED, ANSI_FG_GREEN, ANSI_FG_MAGENTA } from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import StoryModel from "../models/StoryModel";
import PlotProgressionModel from "../models/PlotProgressionModel";
import MessageSendComponent from "../components/MessageSendComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class StartCommand {
  constructor(message: Message, storyId: string, storyPlotPoint: string) {
    new ConsoleTimeComponent(ANSI_FG_YELLOW, "START ", ANSI_RESET, "command activated");
    const currrentStoryPlotPoint = storyPlotPoint ? parseInt(storyPlotPoint) : 0;
    let selectedPlotPoint = {} as StoryPlotPointsModel;

    let folder: string[];
    let currentStory = {} as StoryModel;

    if (storyId === undefined) {
      new ConsoleTimeComponent(
        ANSI_FG_RED,
        "No story value detected. Please enter a story value in the command !start [value]",
        ANSI_RESET
      );
      return;
    }

    try {
      folder = fs.readdirSync("./stories/");
      try {
        folder.map((file: string) => {
          const story = JSON.parse(
            (fs.readFileSync(`./stories/${file}`) as unknown) as string
          ) as StoryModel;
          if (storyId === story.storyId) {
            currentStory = story;
            return;
          }
        });

        // check if there is anything in the file
        if (!currentStory) {
          new ConsoleTimeComponent(
            ANSI_FG_RED,
            "The story value not been found",
            ANSI_RESET
          );
        }

        currentStory.plotPoints.map((plotPoint) => {
          if(plotPoint.plotPointId === currrentStoryPlotPoint){
            selectedPlotPoint = plotPoint;
          }
        })

        const currentReactionCount = {
          storyId: currentStory.storyId,
          plotPointId: selectedPlotPoint.plotPointId,
          storyEnded: false,
          hitpoints: currentStory.hitpoints
        } as PlotProgressionModel;

        Store.PlotProgression.push(currentReactionCount);
        Store.Stories.push(currentStory);
      } catch (err) {
        new ConsoleTimeComponent(ANSI_FG_RED, "No files detected", ANSI_RESET);
      }
    } catch (err) {
      new ConsoleTimeComponent(ANSI_FG_RED, "No directory detected", ANSI_RESET);
    }

    if (currentStory) {
      new MessageSendComponent(message.channel, selectedPlotPoint);
      new ConsoleTimeComponent(
        `Story `,
        ANSI_FG_GREEN,
        `${currentStory.storyId.toUpperCase()} `,
        ANSI_RESET,
        "has ",
        ANSI_FG_GREEN,
        `started `.toUpperCase(),
        ANSI_RESET,
        "on channel ",
        ANSI_FG_MAGENTA,
        `${message.channel.id} `,
        ANSI_RESET,
      );
    }

    return;
  }
}
