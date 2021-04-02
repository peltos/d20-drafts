import StoryPlotPointsModel from "./StoryPlotPointsModel";

export default interface StoryModel {
  storyId: string;
  name: string;
  parsingVariables: object;
  hitpoints: number;
  plotPoints: StoryPlotPointsModel[];
}