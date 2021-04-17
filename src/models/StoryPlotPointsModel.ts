import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryPlotPointsModel {
  imageFile: string | null;
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[] | boolean;
}
