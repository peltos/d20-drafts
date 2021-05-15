import ConsoleTimeComponent from "../ConsoleTimeComponent";
import { ANSI_FG_RED, ANSI_RESET } from "../../resources/ANSIEscapeCode";
import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

export default class SendMessageDefaultComponent {
  constructor(
    channel: TextChannel | DMChannel | GroupDMChannel,
    ...content: string[]
  ) {
    channel
      .send(content)
      .catch((err) => {
        new ConsoleTimeComponent(ANSI_FG_RED, err, ANSI_RESET);
      });
  }
}
