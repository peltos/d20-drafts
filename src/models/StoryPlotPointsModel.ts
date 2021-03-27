import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryPlotPointsModel {
  fileDestination: string | null;
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[] | boolean;
}
