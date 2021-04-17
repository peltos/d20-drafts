import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";

export default interface TimeoutModel {
  channel: TextChannel | DMChannel | GroupDMChannel;
  setTimeout: ReturnType<typeof setTimeout>
}