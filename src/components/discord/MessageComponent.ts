import { Client } from "discord.js";
import Store from "../../store/Store";
import CONFIG from "../../../config";
import StartCommand from "../../commands/StartCommand";
import ConsoleTimeComponent from "../ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_RED, ANSI_FG_BLUE } from "../../resources/ANSIEscapeCode";

export default class MessageComponent {
  constructor(client: Client) {
    // When A message is sent
    client.on("message", async (message) => {
      if (message.author.bot) {
        // Listen for the bot
        Store.PlotPointCount[Store.PlotPointCount.length - 1].messageId = message.id;
      } else {
        // Listen for commands

        // Check if a command is used (by not a bot)
        if (!message.content.startsWith(CONFIG.prefix)) return;

        // send to console
        new ConsoleTimeComponent(
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
            new StartCommand(message, args[0]);
            break;
          default:
            new ConsoleTimeComponent(
              ANSI_FG_RED,
              "Command ",
              ANSI_RESET,
              `${command?.toUpperCase() as string} `,
              ANSI_FG_RED,
              "not found",
              ANSI_RESET
            );
        }
      }
    });
  }
}
