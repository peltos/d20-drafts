import ReactionModel from "./ReactionModel";

export default interface StoryModel {
  id: string | undefined;
  reactions: ReactionModel[] | undefined;
}