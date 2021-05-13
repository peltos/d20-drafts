import Store from "../store/Store";
import fs from "fs";
import {
  ANSI_FG_RED,
  ANSI_FG_YELLOW,
  ANSI_RESET,
} from "../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "../components/ConsoleTimeComponent";
import StoryModel from "../models/StoryModel";

export default class WriteData {
  constructor() {
    const dir = "./storage/";
    const file = "activeStories.json";

    const cloneStories = [] as StoryModel[];
    
    Store.Stories.map((story) => {
      const copyStory = {...story}
      copyStory.active = false;
      cloneStories.push(copyStory);
    })

    try {
      fs.writeFileSync(dir + file, JSON.stringify(cloneStories, null, 2));
    } catch {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(dir + file, JSON.stringify([], null, 2));
      new ConsoleTimeComponent(
        `No file called `,
        ANSI_FG_YELLOW,
        `${file} `,
        ANSI_RESET,
        `So a new file was created in directory `,
        ANSI_FG_YELLOW,
        `${dir} `,
        ANSI_RESET
      );
      try {
        fs.writeFileSync(dir + file, JSON.stringify(cloneStories, null, 2));
      } catch {
        new ConsoleTimeComponent(
          ANSI_FG_RED,
          "The file ",
          ANSI_RESET,
          file,
          ANSI_FG_RED,
          "is not found",
          ANSI_RESET
        );
      }
    }
  }
}
