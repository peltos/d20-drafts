import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryContentModel {
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[] | boolean;
}
