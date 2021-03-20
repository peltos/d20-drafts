export default interface StoryReactionsModel {
  emoji: string;
  next: {
    deathId: number | null,
    rollAtLeast: number | null;
    rollDamage: string | null,
    rollFailId: number | null;
    rollSuccessId: number;
  };
}
