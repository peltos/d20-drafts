import { Client, Message } from "discord.js";
import Store from "../store/Store";
import StartCommand from "../commands/StartCommand";
import ConsoleTimeComponent from "./ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_RED,
  ANSI_FG_CYAN,
  ANSI_FG_GREEN,
  ANSI_FG_MAGENTA,
} from "../resources/ANSIEscapeCode";
import MessageNextComponent from "./MessageNextComponent";
import StoryPlotPointsModel from "../models/StoryPlotPointsModel";

export default class MessageComponent {
  public env = {} as Record<string, unknown>;
  public plotpoint = {} as StoryPlotPointsModel;

  constructor(client: Client, env: Record<string, unknown>) {
    this.env = env;
    // When A message is sent
    client.on("message", async (message) => {
      if (message.author.bot) {
        this.botMessageResponse(message);
      } else {
        this.userMessageResponse(message);
      }
    });
  }

  private botMessageResponse = (message: Message) => {
    // Listen for the bot
    if (Store.PlotProgression.length !== 0) {
      if (Store.PlotProgression[Store.PlotProgression.length - 1].channel === undefined) {
        Store.PlotProgression[Store.PlotProgression.length - 1].channel = message.channel;
      }
      let counter = 0;
      Store.PlotProgression.map((progression) => {
        if (progression.channel === message.channel) {
          setTimeout(
            () => {
              message.channel.fetchMessage(message.id).then((msg) => {
                const next = new MessageNextComponent(
                  msg,
                  progression.plotPointId,
                  progression.channel
                );
                progression.plotPointId = next.plotPointId;
              });
            },
            this.env.TIME ? parseInt(this.env.TIME as string) : 10000
          ); // MiliSeconds

          if (!progression.storyEnded) {
            Store.Stories.map((story) =>
              story.plotPoints.map((plotPoint) => {
                if (
                  plotPoint.plotPointId === progression.plotPointId &&
                  !plotPoint.reactions
                ) {
                  progression.storyEnded = true;

                  setTimeout(() => {
                    progression.channel.send(
                      `\n---------------------------------------------------------------------\nThe story has ended. Restart the story to see other endings\n---------------------------------------------------------------------`
                    );
                    new ConsoleTimeComponent(
                      `Story `,
                      ANSI_FG_GREEN,
                      `${story.storyId.toUpperCase()} `,
                      ANSI_RESET,
                      "has ",
                      ANSI_FG_RED,
                      `ended `.toUpperCase(),
                      ANSI_RESET,
                      "on channel ",
                      ANSI_FG_MAGENTA,
                      `${message.channel.id} `,
                      ANSI_RESET
                    );
                  }, 100);
                  Store.PlotProgression.splice(counter, 1);
                }
              })
            );
          }
        }
        counter++;
      });
    }
  };

  private userMessageResponse = (message: Message) => {
    // Check if a command is used
    if (!message.content.startsWith("!")) return;

    // Prepare the command
    const commandBody = message.content.slice("!".length);
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
  };
}
