import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import { ANSI_RESET, ANSI_FG_GREEN } from "../../../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "../../ConsoleTimeComponent";
import StoryReactionsModel from "../../../models/StoryReactionsModel";
import StoryModel from "../../../models/StoryModel";

const SendMessageComponent = (
  channel: TextChannel | DMChannel | GroupDMChannel,
  story: StoryModel
) => {
  // current message
  channel.send(story.content[0].content).then((msg) => {
    // send to console
    ConsoleTimeComponent("Message send ", ANSI_FG_GREEN, "succesful", ANSI_RESET);

    story.content[0].reactions.forEach(async (rection: StoryReactionsModel) => {
      await (msg as Message).react(rection.emoji);
    });
  });
};

export default SendMessageComponent;
