import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryContentModel {
  fileDestination: string | null;
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[] | boolean;
}
