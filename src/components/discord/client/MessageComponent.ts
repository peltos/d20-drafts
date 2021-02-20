import { Client } from "discord.js";
import StoryModel from "../../../models/StoryModel";
import CONFIG from "../../../../config";
import StartCommand from "../../../commands/StartCommand";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_RED, ANSI_FG_BLUE } from "../../../resources/ANSIEscapeCode"

const MessageComponent = async (client: Client, Stories: StoryModel[]) => {
  // When A message is sent
  client.on("message", async (message) => {
    // Check if a command is used (by not a bot)
    if (message.author.bot) return;
    if (!message.content.startsWith(CONFIG.prefix)) return;

    // send to console
    ConsoleTimeComponent(
      ANSI_FG_BLUE,
      "Discord Client Message ",
      ANSI_RESET,
      "event"
    );

    // Prepare the command
    const commandBody = message.content.slice(CONFIG.prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift()?.toLowerCase();

    // Commands
    switch (command) {
      case "start":
        Stories = await StartCommand(message, Stories, args[0]);
        break;
      default:
        ConsoleTimeComponent(
          ANSI_FG_RED,
          "Command ",
          ANSI_RESET,
          `${command?.toUpperCase() as string} `,
          ANSI_FG_RED,
          "not found",
          ANSI_RESET
        );
    }
  });

  return Stories;
};

export default MessageComponent;
