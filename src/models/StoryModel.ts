import StoryPlotPointsModel from "./StoryPlotPointsModel";

export default interface StoryModel {
  storyId: string;
  name: string;
  hitpoints: number,
  plotPoints: StoryPlotPointsModel[];
}