import { Client } from "discord.js";
import dotenv from "dotenv";
import CONFIG from "./config";
import StoryModel from "./src/models/StoryModel";
import ReactionModel from "./src/models/ReactionModel";
import StartCommand from "./src/commands/StartCommand";
dotenv.config();
const dev = process.env.NODE_ENV === "dev";
const client = new Client();

const App = () => {
    let Stories: StoryModel[] = [];

    // When the client is ready
    client.once("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
    });

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
        Stories = await StartCommand( message, Stories );
      }
    });

    // When a Reaction has been given. This is not the same as a Reply
    client.on("messageReactionAdd", async (reaction, user) => {
      if (user.bot) return;

      const reactId = reaction.emoji.name;
      const messageId = reaction.message.id;
      const count = reaction.count;

      Stories.map((story) => {
        if (story.id === messageId) {
          let reactionExist = false;
          if (story.reactions) {
            story.reactions.map((rec: ReactionModel) => {
              if (rec.id === reactId) {
                reactionExist = true;
                rec.count = count;
              }
            });
          }
          if (!reactionExist) {
            story.reactions?.push({ id: reactId, count });
          }
        }
      });

      console.log(Stories);
    });

    // in dev mode, check all the input/output
    if (dev) {
      client.on("debug", (e) => {
        // console.log(e);
      });
    }

    // If no ENV file is present. give error
    if (process.env.TOKEN) client.login(process.env.TOKEN);
    else {
      console.error(
        "Create a file called .env and put your bot's token in there."
      );
      process.exit(1);
    }
}
App();
