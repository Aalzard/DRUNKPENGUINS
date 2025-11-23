
export interface User {
  id: string;
  name: string;
  avatarColor: string;
}

export enum RatingCategory {
  Gameplay = 'Gameplay',
  Story = 'Story',
  Graphics = 'Graphics',
  Audio = 'Audio',
  Performance = 'Performance'
}

export interface CategoryRating {
  score: number; // 0, 1, or 2
  comment: string;
}

export interface UserRating {
  userId: string;
  ratings: Record<RatingCategory, CategoryRating>;
  totalScore: number; // 0-10
  timestamp: number;
}

export interface Game {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  ratings: Record<string, UserRating>; // Keyed by userId
}

export type ScreenState = 'DASHBOARD' | 'ADD_GAME' | 'RATE_GAME';
