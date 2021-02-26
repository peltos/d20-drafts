import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadyComponent from "./src/components/discord/client/ReadyComponent"
import MessageComponent from "./src/components/discord/client/MessageComponent"
import MessageReactionComponent from "./src/components/discord/client/MessageReactionComponent"

const client = new Client();

// Discord events
ReadyComponent(client);
MessageComponent(client);
MessageReactionComponent(client);

EnvGuard();
client.login(process.env.TOKEN);
