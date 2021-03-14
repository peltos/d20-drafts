import { DMChannel, GroupDMChannel, Message, TextChannel } from "discord.js";
import { ANSI_RESET, ANSI_FG_GREEN } from "../../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "../ConsoleTimeComponent";
import StoryReactionsModel from "../../models/StoryReactionsModel";
import StoryModel from "../../models/StoryModel";

export default class SendMessageComponent {
  constructor(
    channel: TextChannel | DMChannel | GroupDMChannel,
    story: StoryModel,
    dice: number | undefined = undefined
  ) {
    // current message
    let message = "";
    if (dice !== undefined) message += this.AsciiDice(20);
    message += story.content[0].content;

    channel.send(message).then((msg) => {
      new ConsoleTimeComponent("Message send ", ANSI_FG_GREEN, "succesful", ANSI_RESET);

      story.content[0].reactions.forEach(async (rection: StoryReactionsModel) => {
        await (msg as Message).react(rection.emoji);
      });
    });
  }

  private AsciiDice = (num: number) => {
    if (num > 20 || num < 1) return "";

    let c;
    if (num === 20) c = "+";
    else if (num === 1) c = "-";
    else c = "|";

    let numStr;
    if (num.toString().length === 1) numStr = ` ${num} `;
    else if (num.toString().length >= 2) {
      const double = num.toString().split("");
      numStr = `${double[0]} ${double[1]}`;
    }

    const dice = `\`\`\`diff
${c}     _ --- _     ${c}
${c}   -   / \\   -   ${c}
${c}  |\\ /_____\\ /|  ${c}
${c}  | /\\     /\\ |  ${c}
${c}  |/  \\${numStr}/  \\|  ${c}
${c}  |____\\ /____|  ${c}
${c}   - _  |  _ -   ${c}
${c}       ---       ${c}\`\`\``;

    return dice;
  };
}
