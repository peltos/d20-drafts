import StoryModel from "../models/StoryModel";
import ReactionsCount from "../models/ReactionsCount";

export default class Store {
  public static Stories: StoryModel[] = [];
  public static ReactionCount: ReactionsCount[] = [];
}
