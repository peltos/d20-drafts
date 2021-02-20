import StoryReactionsModel from "./StoryReactionsModel";

export default interface StoryContentModel {
  content: string;
  id: number;
  reactions: StoryReactionsModel[];
}
