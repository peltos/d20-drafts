import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadyComponent from "./src/components/discord/ReadyComponent"
import MessageComponent from "./src/components/discord/MessageComponent"
import MessageReactionComponent from "./src/components/discord/MessageReactionComponent"

const client = new Client();

// Discord events
new ReadyComponent(client);
new MessageComponent(client);
new MessageReactionComponent(client);

EnvGuard();
client.login(process.env.TOKEN);
