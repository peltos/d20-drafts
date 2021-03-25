import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryContentModel {
  file_destination: string;
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[];
}
