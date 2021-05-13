import { Client, TextChannel } from "discord.js";
import Store from "../store/Store";

export default class ScanStoryProgressComponent {
  constructor(client: Client) {
    setInterval(() => {
      // console.log(Store.Stories);

      Store.Stories.map((story) => {
        if (
          story.delay + story.timeSend < new Date().getTime() &&
          story.active
        ) {
          story.plotPoints.map((pp) => {
            if (pp.plotPointId === story.currentPlotPointId) {
              const channel = client.channels.get(story.channel.id);
              (channel as TextChannel)
                .fetchMessage(story.messageId)
                .then((msg) => {
                  console.log("this is a thing now");
                });
            }
          });
        }
      });
    }, 1000);
  }
}
