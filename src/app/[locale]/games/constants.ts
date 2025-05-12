export const SPECIAL_GAMES = {
  TIBIA: 'tibia'
} as const;

export const isSpecialGame = (slug: string): boolean => {
  return Object.values(SPECIAL_GAMES).includes(slug as any);
}; 