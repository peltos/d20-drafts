import ReactionsCountReactions from "./ReactionsCountReactions";

export default interface ReactionsCount {
  storyId: string;
  messageId: string;
  plotPointId: number;
  reactions: ReactionsCountReactions[];
}
