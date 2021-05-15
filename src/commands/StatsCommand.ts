import dotenv from "dotenv";
dotenv.config();

import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import Store from "../store/Store";
import SendMessageDefaultComponent from "../components/SendMessage/SendMessageDefaultComponent";

export default class StatsCommand {
  constructor(channel: TextChannel | DMChannel | GroupDMChannel) {
    Store.Stories.map((story) => {
      if (channel.id === story.channel.id) {
        new SendMessageDefaultComponent(
          story.channel,
          ...[
            "----------------------",
            `Story: **${story.name}**`,
            `Hitpoints: **${story.hitpoints}**`,
            `Starting Plotpoint: **${story.currentPlotPointId}**`,
            `Status: **${story.active ? "Active" : "Paused"}**`,
            `Time between plot points: **${this.calculateTime(
              story.delay
            )}**`,
            "----------------------",
          ]
        ); // Send info message
      }
    });
  }
  
  private calculateTime(time: number) {
    let timeDuration = time / 1000;
    const timeString = [];

    // Weeks
    if (timeDuration >= 604800) {
      timeString.push(
        `${Math.floor(timeDuration / 604800)} week${
          Math.floor(timeDuration / 604800) > 1 ? "s" : ""
        } `
      );
      timeDuration = timeDuration % 86400;
    }

    // Days
    if (timeDuration >= 86400) {
      timeString.push(
        `${Math.floor(timeDuration / 86400)} day${
          Math.floor(timeDuration / 86400) > 1 ? "s" : ""
        } `
      );
      timeDuration = timeDuration % 86400;
    }

    // Hours
    if (timeDuration >= 3600) {
      timeString.push(
        `${Math.floor(timeDuration / 3600)} hour${
          Math.floor(timeDuration / 3600) > 1 ? "s" : ""
        } `
      );
      timeDuration = timeDuration % 3600;
    }

    // Minutes
    if (timeDuration >= 60) {
      timeString.push(
        `${Math.floor(timeDuration / 60)} minute${
          Math.floor(timeDuration / 60) > 1 ? "s" : ""
        } `
      );
      timeDuration = timeDuration % 60;
    }

    // Seconds
    if (Math.floor(timeDuration) > 0) {
      timeString.push(
        `${Math.floor(timeDuration)} second${timeDuration > 1 ? "s" : ""} `
      );
    }

    return timeString.join("");
  }
}
