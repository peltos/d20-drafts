import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadDataComponent from "./src/components/data/ReadDataComponent";
import ReadyComponent from "./src/components/ReadyComponent";
import ClientMessageComponent from "./src/components/Clients/ClientMessageComponent";

const client = new Client();

// Discord events
new ReadDataComponent();
new ReadyComponent(client);
new ClientMessageComponent(client);

new EnvGuard();
client.login(process.env.TOKEN);
