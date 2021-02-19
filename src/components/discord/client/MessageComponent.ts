import { Client } from "discord.js";
import StoryModel from "../../../models/StoryModel";
import CONFIG from "../../../../config";
import StartCommand from "../../../commands/StartCommand";

const MessageComponent = async (client: Client, Stories: StoryModel[]) => {
  // When A message is sent
  client.on("message", async (message) => {
    // Check if a command is used (by not a bot)
    if (message.author.bot) return;
    if (!message.content.startsWith(CONFIG.prefix)) return;

    // Prepare the command
    const commandBody = message.content.slice(CONFIG.prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift()?.toLowerCase();

    // Start the Story
    if (command === "start") {
      Stories = await StartCommand(message, Stories);
    }
  });

  return Stories;
};

export default MessageComponent;
