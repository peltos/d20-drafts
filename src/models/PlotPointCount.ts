import PlotPointCountReactions from "./PlotPointCountReactions";

export default interface PlotPointCount {
  storyId: string;
  messageId: string;
  plotPointId: number;
  reactions: PlotPointCountReactions[];
}
