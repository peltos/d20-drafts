import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadData from "./src/data/ReadData";
import ReadyComponent from "./src/components/Ready/ReadyComponent";
import ClientMessageComponent from "./src/components/Clients/ClientMessageComponent";

const client = new Client();

// Discord events
new ReadData();
new ReadyComponent(client);
new ClientMessageComponent(client);

new EnvGuard();
client.login(process.env.TOKEN);
