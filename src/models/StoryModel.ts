import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import StoryPlotPointsModel from "./StoryPlotPointsModel";

export default interface StoryModel {
  storyId: string;
  name: string;
  channel: TextChannel | DMChannel | GroupDMChannel;
  messageId: string;
  storyEnded: boolean;
  hitpoints: number,
  currentPlotPointId: number;
  plotPoints: StoryPlotPointsModel[];
  delay: number;
  startTime: number;
  active: boolean;
}