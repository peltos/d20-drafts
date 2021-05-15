import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import EnvGuard from "./src/guards/EnvGuard";

import ReadData from "./src/data/ReadData";
import ScanStoryProgressComponent from "./src/components/ScanStoryProgressComponent";
import ReadyComponent from "./src/components/ReadyComponent";
import ClientMessageComponent from "./src/components/ClientMessageComponent";

const client = new Client();

// Discord events
new ReadData();
new ScanStoryProgressComponent(client);
new ReadyComponent(client);
new ClientMessageComponent(client);

new EnvGuard();
client.login(process.env.TOKEN);
