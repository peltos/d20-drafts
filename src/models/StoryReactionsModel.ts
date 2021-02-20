export default interface StoryReactionsModel {
  emoji: string;
  next: {
    rollAtLeast: number;
    rollFailId: number;
    rollSuccessId: number;
  };
  count: number;
}
