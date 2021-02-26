import { Client, MessageReaction, User } from "discord.js";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_BLUE,
  ANSI_FG_MAGENTA,
} from "../../../resources/ANSIEscapeCode";
import Store from "../../../store/Store";
import ReactionsCountReactions from "../../../models/ReactionsCountReactions";

const MessageReactionComponent = (client: Client) => {

  client.on("messageReactionRemove", (reaction, user) => {
    MessageReaction(reaction, user);
  });

  client.on("messageReactionAdd", (reaction, user) => {
    MessageReaction(reaction, user);
  });
  
  // When a Reaction has been given. This is not the same as a Reply
  const MessageReaction = (reaction: MessageReaction, user: User) => {
    if (user.bot) return;

    const reactId = reaction.emoji.name;
    const messageId = (reaction.message.id as unknown) as number;
    const count = reaction.count;

    // send to console
    ConsoleTimeComponent(
      ANSI_FG_BLUE,
      "Discord Client MessageReaction ",
      ANSI_RESET,
      "event with ",
      `${reactId}  `,
      "on ",
      ANSI_FG_MAGENTA,
      messageId.toString(),
      ANSI_RESET
    );

    let reactionCountCounter = 0;
    Store.ReactionCount.map((recCount) => {
      if (recCount.messageId === reaction.message.id) {
        if (Store.ReactionCount[reactionCountCounter].reactions === undefined) {
          Store.ReactionCount[
            reactionCountCounter
          ].reactions = [] as ReactionsCountReactions[];

          Store.ReactionCount[reactionCountCounter].reactions.push({
            emoji: reactId,
            count: count,
          });
        } else {
          let emojiExist = false;
          let reactionCountreactionCounter = 0;
          Store.ReactionCount[reactionCountCounter].reactions.map((react) => {
            if (reactId === react.emoji) {
              Store.ReactionCount[reactionCountCounter].reactions[
                reactionCountreactionCounter
              ].count = count;
              emojiExist = true;
            }
            reactionCountreactionCounter++;
          });
          if (!emojiExist)
            Store.ReactionCount[reactionCountCounter].reactions.push({
              emoji: reactId,
              count: count,
            });
        }
      }
      reactionCountCounter++;
    });
  }

};

export default MessageReactionComponent;
