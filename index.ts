import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadyComponent from "./src/components/ReadyComponent"
import ClientMessageComponent from "./src/components/Client/ClientMessageComponent"

const client = new Client();

// Discord events
new ReadyComponent(client);
new ClientMessageComponent(client);

new EnvGuard();
client.login(process.env.TOKEN);
