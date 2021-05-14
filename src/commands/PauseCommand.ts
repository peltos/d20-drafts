import dotenv from "dotenv";
dotenv.config();

import { Message } from "discord.js";
import Store from "../store/Store";

export default class PauseCommand {
  constructor(message: Message) {
    Store.Stories.map((story) => {
      if (message.channel.id === story.channel.id) {
        story.active = false;
      }
    });
  }
}
