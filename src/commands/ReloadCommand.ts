import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import Store from "../store/Store";
import SendMessageStoryComponent from "../components/SendMessageStoryComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class ReloadCommand {
  constructor(message: Message) {
    Store.Stories.map((story) => {
      if (message.channel.id === story.channel.id) {
        story.channel = message.channel; // story.channel is not reconized with a restart of the bot. Remake it with message.channel

        let currentPlotPoint = {} as StoryPlotPointsModel;
        story.plotPoints.map((pp) => {
          if (pp.plotPointId === story.currentPlotPointId) {
            currentPlotPoint = pp;
          }
        });

        story.active = true; // set it active
        story.startTime = new Date().getTime(); // set a new start time

        new SendMessageStoryComponent(story, currentPlotPoint); // Send message
      }
    });
  }
}
