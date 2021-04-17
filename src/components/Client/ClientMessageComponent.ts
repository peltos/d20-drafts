import { Client } from "discord.js";
import ResponseUserComponent from "../Response/ResponseUserComponent";
import ResponseBotComponent from "../Response/ResponseBotComponent";
import StoryPlotPointsModel from "../../models/StoryPlotPointsModel";

export default class ClientMessageComponent {
  public plotpoint = {} as StoryPlotPointsModel;

  constructor(client: Client) {
    // When A message is sent
    client.on("message", async (message) => {
      if (message.author.bot) {
        new ResponseBotComponent(message); // For the discord bot. This makes the messages repeat
      } else {
        new ResponseUserComponent(message); // For the user. This receives the commands
      }
    });
  }
}