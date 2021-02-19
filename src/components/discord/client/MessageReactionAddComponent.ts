import { Client } from "discord.js";
import StoryModel from "./../../../models/StoryModel";
import ReactionModel from "./../../../models/ReactionModel";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";

const MessageReactionAddComponent = async (
  client: Client,
  Stories: StoryModel[]
) => {
  // When a Reaction has been given. This is not the same as a Reply
  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    const reactId = reaction.emoji.name;
    const messageId = reaction.message.id;
    const count = reaction.count;

    // send to console
    ConsoleTimeComponent(
      "\x1b[34m",
      "Discord Client MessageReactionAdd ",
      "\x1b[0m",
      "event with ",
      `${reactId}  `,
      "on ",
      "\x1b[35m",
      `${messageId} `,
      "\x1b[0m",
    );

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
  });

  return Stories;
};

export default MessageReactionAddComponent;
