import { Client, TextChannel } from "discord.js";
import Store from "../store/Store";
import SetupNextMessage from "./ResultComponent";

export default class ScanStoryProgressComponent {
  constructor(client: Client) {
    setInterval(() => {
      Store.Stories.map((story) => {
        if (
          story.delay + story.startTime < new Date().getTime() &&
          story.active
        ) {
          story.plotPoints.map((pp) => {
            if (pp.plotPointId === story.currentPlotPointId) {
              const channel = client.channels.get(story.channel.id);
              (channel as TextChannel)
                .fetchMessage(story.messageId)
                .then((msg) => {
                  new SetupNextMessage(msg, story, pp); // figure out what the next story is gonna be.
                });
            }
          });
        }
      });
    }, 1000);
  }
}
