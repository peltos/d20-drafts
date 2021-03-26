import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryContentModel {
  file_destination: string | null;
  plotPointId: number;
  content: string;
  reactions: StoryReactionsModel[] | boolean;
}
