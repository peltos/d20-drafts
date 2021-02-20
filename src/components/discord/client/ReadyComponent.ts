import { Client } from "discord.js";
import { ANSI_RESET, ANSI_UNDERSCORE, ANSI_FG_GREEN } from "../../../resources/ANSIEscapeCode"

const ReadyComponent = async (client: Client) => {
  // When the client is ready
  client.once("ready", () => {
    console.log(
      "\n",
      "-----------------------------------------------------------",
      "\n",
      `Logged in as`,
      ANSI_FG_GREEN,
      ANSI_UNDERSCORE,
      client.user.tag,
      ANSI_RESET,
      "\n",
      "-----------------------------------------------------------",
    );
  });
};

export default ReadyComponent;
