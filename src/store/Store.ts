import StoryModel from "../models/StoryModel";
import TimeoutModel from "../models/TimeoutModel";

export default class Store {
  public static Stories: StoryModel[] = [];
  public static Timeouts: TimeoutModel[] = [];
}
