import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import PlotPointCountReactions from "./PlotPointCountReactionsModel";

export default interface PlotPointCountModel {
  storyId: string;
  channelId: TextChannel | DMChannel | GroupDMChannel;
  plotPointId: number;
  reactions: PlotPointCountReactions[];
}
