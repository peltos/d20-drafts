import { Client } from "discord.js";
import Store from "../store/Store";
import CONFIG from "../../config";
import StartCommand from "../commands/StartCommand";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_RED, ANSI_FG_CYAN } from "../resources/ANSIEscapeCode";
import MessageNextComponent from "./MessageNextComponent";

export default class MessageComponent {
  constructor(client: Client) {
    // When A message is sent
    client.on("message", async (message) => {
      if (message.author.bot) {
        // Listen for the bot
        Store.PlotPointCount[Store.PlotPointCount.length - 1].messageId = message.id;
        setTimeout(() => {
          message.channel.fetchMessage(message.id).then((fetchMessage) => {
            const next = new MessageNextComponent(
              fetchMessage,
              Store.PlotPointCount[Store.PlotPointCount.length - 1].plotPointId
            );
            Store.PlotPointCount[Store.PlotPointCount.length - 1].plotPointId =
              next.plotPointId;
          });
          
        }, 5000); // MiliSeconds
      } else {
        // Listen for commands

        // Check if a command is used
        if (!message.content.startsWith(CONFIG.prefix)) return;

        // Prepare the command
        const commandBody = message.content.slice(CONFIG.prefix.length);
        const args = commandBody.split(" ");

        if (args.shift() !== "d20d") return;

        // send to console
        new ConsoleTimeComponent(
          ANSI_FG_CYAN,
          "Discord Client Message ",
          ANSI_RESET,
          "event"
        );

        const command = args.shift()?.toLowerCase();

        // Commands
        switch (command) {
          case "start":
            new StartCommand(message, args[0], args[1]);
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
