import { Client } from "discord.js";
import StoryModel from "./../../../models/StoryModel";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";
import { ANSI_RESET, ANSI_FG_BLUE, ANSI_FG_MAGENTA } from "../../../resources/ANSIEscapeCode"

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
      ANSI_FG_BLUE,
      "Discord Client MessageReactionAdd ",
      ANSI_RESET,
      "event with ",
      `${reactId}  `,
      "on ",
      ANSI_FG_MAGENTA,
      messageId,
      ANSI_RESET,
    );
    console.log(Stories);

    Stories.map((story) => {
      if (story.id === messageId) {
        let reactionExist = false;
        // if (story.reactions) {
        //   story.reactions.map((rec: ReactionModel) => {
        //     if (rec.id === reactId) {
        //       reactionExist = true;
        //       rec.count = count;
        //     }
        //   });
        // }
        // if (!reactionExist) {
        //   story.reactions?.push({ id: reactId, count });
        // }
      }
    });
  });

  return Stories;
};

export default MessageReactionAddComponent;
