import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

export default interface PlotPointCountModel {
  storyId: string;
  channel: TextChannel | DMChannel | GroupDMChannel;
  storyEnded: boolean;
  plotPointId: number;
}
