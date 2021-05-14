import ConsoleTimeComponent from "./ConsoleTimeComponent";
import { ANSI_FG_RED, ANSI_RESET } from "../resources/ANSIEscapeCode";
import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

export default class SendMessageDefaultComponent {
  constructor(channel: TextChannel | DMChannel | GroupDMChannel, ...content: string[]) {
    // current message
    const message = ["```",...content,"```"].join("");

    channel
      .send(message)
      .then((msg) => {
        // console.log(msg.id);
      })
      .catch((err) => {
       new SendMessageDefaultComponent(channel, ...new ConsoleTimeComponent(ANSI_FG_RED, err, ANSI_RESET).messages);
      });
  }
}
