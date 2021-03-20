import { Client, Message } from "discord.js";
import Store from "../store/Store";
import StartCommand from "../commands/StartCommand";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_RED, ANSI_FG_CYAN } from "../resources/ANSIEscapeCode";
import MessageNextComponent from "./MessageNextComponent";

export default class MessageComponent {
  public message = {} as Message;
  public env = {} as Record<string, unknown>;
  public storyEnd = false;

  constructor(client: Client, env: Record<string, unknown>) {
    this.env = env;
    // When A message is sent
    client.on("message", async (message) => {
      this.message = message;
      if (message.author.bot) {
        this.botMessageResponse();
      } else {
        this.userMessageResponse();
      }
    });
  }

  private botMessageResponse = () => {
    // Listen for the bot
    Store.PlotPointCount[Store.PlotPointCount.length - 1].messageId = this.message.id;

    if (!this.storyEnd) {
      Store.Stories.map((story) => {
        story.plotPoints.map((plotPoint) => {
          if (
            plotPoint.plotPointId ===
            Store.PlotPointCount[Store.PlotPointCount.length - 1].plotPointId
          ) {
            if (plotPoint.reactions) {
              setTimeout(
                () => {
                  this.message.channel
                    .fetchMessage(this.message.id)
                    .then((fetchMessage) => {
                      const next = new MessageNextComponent(
                        fetchMessage,
                        Store.PlotPointCount[Store.PlotPointCount.length - 1].plotPointId
                      );
                      Store.PlotPointCount[Store.PlotPointCount.length - 1].plotPointId =
                        next.plotPointId;
                    });
                },
                this.env.TIME ? parseInt(this.env.TIME as string) : 10000
              ); // MiliSeconds
            } else {
              this.storyEnd = true;
              this.message.channel.send(
                `\n---------------------------------------------------------------------\nThe story has ended. Restart the story to see other endings\n---------------------------------------------------------------------`
              );
            }
          }
        });
      });
    } else {
      this.storyEnd = false;
    }
  };

  private userMessageResponse = () => {
    // Check if a command is used
    if (!this.message.content.startsWith("!")) return;

    // Prepare the command
    const commandBody = this.message.content.slice("!".length);
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
        new StartCommand(this.message, args[0], args[1]);
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
  };
}
