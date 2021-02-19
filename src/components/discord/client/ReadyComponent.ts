import { Client } from "discord.js";

const ReadyComponent = async (client: Client) => {
  // When the client is ready
  client.once("ready", () => {
    console.log(
      "\n",
      "-----------------------------------------------------------",
      "\n",
      `Logged in as`,
      "\x1b[32m\x1b[4m",
      `${client.user.tag}`,
      "\x1b[0m",
      "\n",
      "-----------------------------------------------------------",
    );
  });
};

export default ReadyComponent;
