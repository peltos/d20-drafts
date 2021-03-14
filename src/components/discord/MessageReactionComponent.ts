import { Client, MessageReaction, User } from "discord.js";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";
import {
  ANSI_RESET,
  ANSI_FG_BLUE,
  ANSI_FG_MAGENTA,
} from "../../../resources/ANSIEscapeCode";
import Store from "../../../store/Store";
import ReactionsCountReactions from "../../../models/PlotPointCountReactions";

const MessageReactionComponent = (client: Client) => {

  client.on("messageReactionRemove", (reaction, user) => {
    MessageReaction(reaction, user, "REMOVE");
  });

  client.on("messageReactionAdd", (reaction, user) => {
    MessageReaction(reaction, user, "ADD");
  });
  
  // When a Reaction has been given. This is not the same as a Reply
  const MessageReaction = (reaction: MessageReaction, user: User, type: string) => {
    if (user.bot) return;

    const reactId = reaction.emoji.name;
    const messageId = (reaction.message.id as unknown) as number;
    const count = reaction.count;

    // send to console
    ConsoleTimeComponent(
      ANSI_FG_BLUE,
      `Discord Client MessageReaction ${type} `,
      ANSI_RESET,
      "event with ",
      `${reactId}  `,
      "on ",
      ANSI_FG_MAGENTA,
      messageId.toString(),
      ANSI_RESET
    );

    let PlotPointCounter = 0;
    Store.PlotPointCount.map((recCount) => {
      if (recCount.messageId === reaction.message.id) {
        if (Store.PlotPointCount[PlotPointCounter].reactions === undefined) {
          Store.PlotPointCount[
            PlotPointCounter
          ].reactions = [] as ReactionsCountReactions[];

          Store.PlotPointCount[PlotPointCounter].reactions.push({
            emoji: reactId,
            count: count,
          });
        } else {
          let emojiExist = false;
          let PlotPointReactionCounter = 0;
          Store.PlotPointCount[PlotPointCounter].reactions.map((react) => {
            if (reactId === react.emoji) {
              Store.PlotPointCount[PlotPointCounter].reactions[
                PlotPointReactionCounter
              ].count = count;
              emojiExist = true;
            }
            PlotPointReactionCounter++;
          });
          if (!emojiExist)
            Store.PlotPointCount[PlotPointCounter].reactions.push({
              emoji: reactId,
              count: count,
            });
        }
      }
      PlotPointCounter++;
    });
  }

};

export default MessageReactionComponent;
