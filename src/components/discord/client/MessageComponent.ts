import { Client } from "discord.js";
import StoryModel from "../../../models/StoryModel";
import CONFIG from "../../../../config";
import StartCommand from "../../../commands/StartCommand";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";

const MessageComponent = async (client: Client, Stories: StoryModel[]) => {
  // When A message is sent
  client.on("message", async (message) => {
    // Check if a command is used (by not a bot)
    if (message.author.bot) return;
    if (!message.content.startsWith(CONFIG.prefix)) return;

    // send to console
    ConsoleTimeComponent(
      "\x1b[34m",
      "Discord Client Message ",
      "\x1b[0m",
      "event"
    );

    // Prepare the command
    const commandBody = message.content.slice(CONFIG.prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift()?.toLowerCase();

    // Commands
    switch (command) {
      case "start":
        Stories = await StartCommand(message, Stories);
        break;
      default:
        ConsoleTimeComponent(
          "\x1b[31m",
          "Command ",
          "\x1b[0m",
          `${command?.toUpperCase() as string} `,
          "\x1b[31m",
          "not found",
          "\x1b[0m"
        );
    }
  });

  return Stories;
};

export default MessageComponent;
