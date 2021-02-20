import StoryContentModel from "./StoryContentModel";

export default interface StoryModel {
  id: string;
  name: string;
  content: StoryContentModel[];
}