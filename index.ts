import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadyComponent from "./src/components/ReadyComponent"
import MessageComponent from "./src/components/MessageComponent"

const client = new Client();

// Discord events
new ReadyComponent(client);
new MessageComponent(client, process.env);

new EnvGuard();
client.login(process.env.TOKEN);
