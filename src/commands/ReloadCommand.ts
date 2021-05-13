import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
} from "../resources/ANSIEscapeCode";
import Store from "../store/Store";
import SendMessageStoryComponent from "../components/SendMessageStoryComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class ReloadCommand {
  constructor(message: Message) {
    // check if there are active stories
    let activeStory = false;
    Store.Timeouts.map((timeout) => {
      if (message.channel.id === timeout.channel.id) {
        new ConsoleTimeComponent(
          ANSI_FG_RED,
          `The channel already has an active story`,
          ANSI_RESET
        );
        activeStory = true;
      }
    });

    if (!activeStory) {
      Store.Stories.map((story) => {
        if (message.channel.id === story.channel.id) {
          story.channel = message.channel;

          let currentPlotPoint = {} as StoryPlotPointsModel;
          story.plotPoints.map((pp) => {
            if(pp.plotPointId === story.currentPlotPointId){
              currentPlotPoint = pp;
            }
          })

          story.active = true;
          story.timeSend = new Date().getTime();

          new SendMessageStoryComponent(story, currentPlotPoint); // Send message
        }
      });
    }
  }
}
