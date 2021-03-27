import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

export default interface PlotProgressionModel {
  storyId: string;
  channel: TextChannel | DMChannel | GroupDMChannel;
  storyEnded: boolean;
  plotPointId: number;
  hitpoints: number;
}
