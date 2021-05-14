import { Client } from "discord.js";
import ResponseUserComponent from "./ResponseUserComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class ClientMessageComponent {
  public plotpoint = {} as StoryPlotPointsModel;

  constructor(client: Client) {
    // When A message is sent
    client.on("message", async (message) => {
      if (!message.author.bot) {
        new ResponseUserComponent(message); // For the user. This receives the commands
      }
    });
  }
}