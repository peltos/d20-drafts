import dotenv from "dotenv";
dotenv.config();

import { Message, MessageAttachment } from "discord.js";
import fetch from "node-fetch";
import fs from "fs";
import SendMessageDefaultComponent from "./SendMessage/SendMessageDefaultComponent";

export default class AddStoryComponent {
  private dir = "./stories/";
  private prefixChar = process.env.PREFIX_CHAR as unknown as string;
  private prefixWord = (
    process.env.PREFIX_WORD as unknown as string
  ).toLowerCase();

  constructor(message: Message, att: MessageAttachment) {
    fetch(att.url, { method: "Get" })
      .then((res) => res.json())
      .then((json) => {
        let fileExist = true;
        let fileCounter = 1;

        do {
          try {
            fileCounter === 1
              ? fs.readFileSync(`./stories/${json.storyId}.json`)
              : fs.readFileSync(
                  `./stories/${json.storyId}-${fileCounter}.json`
                );
            fileCounter++;
          } catch {
            fileExist = false;
          }
        } while (fileExist);

        if (!fs.existsSync(this.dir)) {
          fs.mkdirSync(this.dir);
        }
        const path =
          fileCounter === 1
            ? `${this.dir}${json.storyId}.json`
            : `${this.dir}${json.storyId}-${fileCounter}.json`;
        json.storyId =
          fileCounter === 1 ? json.storyId : `${json.storyId}-${fileCounter}`;

        fs.writeFileSync(path, JSON.stringify(json, null, 2));
        
        new SendMessageDefaultComponent(
          message.channel, `The story **${json.name}** has been added. To start the story, type the following in chat \`\`\`${this.prefixChar}${this.prefixWord} start ${json.storyId}\`\`\``
        ); // Send info message
      });
  }
}
