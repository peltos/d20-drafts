import { Client } from "discord.js";

const ReadyComponent = async (client: Client) => {
  // When the client is ready
  client.once("ready", () => {
    console.log(
      " -----------------------------------------------------------",
      "\n",
      `Logged in as ${client.user.tag}`,
      "\n",
      "-----------------------------------------------------------"
    );
  });
};

export default ReadyComponent;
