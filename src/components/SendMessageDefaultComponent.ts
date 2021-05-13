import ConsoleTimeComponent from "./ConsoleTimeComponent";
import StoryModel from "../models/StoryModel";
import { ANSI_FG_RED, ANSI_RESET } from "../resources/ANSIEscapeCode";

export default class SendMessageDefaultComponent {
  constructor(story: StoryModel, ...content: string[]) {
    // current message
    const message = [content].join("");

    story.channel
      .send(message)
      .then((msg) => {
        console.log(msg.id);
      })
      .catch((err) => {
        new ConsoleTimeComponent(ANSI_FG_RED, err, ANSI_RESET);
      });
  }
}
