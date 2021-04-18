import Store from "../../store/Store";
import fs from "fs";
import { ANSI_FG_YELLOW, ANSI_RESET } from "../../resources/ANSIEscapeCode";
import ConsoleTimeComponent from "../Console/ConsoleTimeComponent";

export default class ReadDataComponent {
  constructor() {
    const dir = "./storage/";
    const file = "activeStories.json";

    try {
      Store.Stories = JSON.parse(
        (fs.readFileSync(dir + file) as unknown) as string
      );
    } catch {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(dir + file, JSON.stringify([], null, 2));
      new ConsoleTimeComponent(
        `New `,
        ANSI_FG_YELLOW,
        `${file} `,
        ANSI_RESET,
        `created at directory `,
        ANSI_FG_YELLOW,
        `${dir} `,
        ANSI_RESET
      );
    }
  }
}
