import PlotPointCountReactions from "./PlotPointCountReactionsModel";

export default interface PlotPointCountModel {
  storyId: string;
  messageId: string;
  plotPointId: number;
  reactions: PlotPointCountReactions[];
}
