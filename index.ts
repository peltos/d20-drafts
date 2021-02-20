import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";

import StoryModel from "./src/models/StoryModel";

import EnvGuard from "./src/guards/EnvGuard";

import ReadyComponent from "./src/components/discord/client/ReadyComponent"
import MessageComponent from "./src/components/discord/client/MessageComponent"
import MessageReactionAddComponent from "./src/components/discord/client/MessageReactionAddComponent"

const client = new Client();
let Stories: StoryModel[] = [];

// Discord events
ReadyComponent(client);
MessageComponent(client, Stories).catch((newStories) => Stories = newStories)
// MessageReactionAddComponent(client, Stories).catch((newStories) => Stories = newStories)

EnvGuard();
client.login(process.env.TOKEN);
