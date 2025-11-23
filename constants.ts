import { RatingCategory, User } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Rayan', avatarColor: 'bg-cyan-500' },
  { id: 'u2', name: 'Saad', avatarColor: 'bg-purple-500' },
  { id: 'u3', name: 'Osama', avatarColor: 'bg-pink-500' },
  { id: 'u4', name: 'Yaman', avatarColor: 'bg-yellow-500' },
];

export const CATEGORIES = [
  RatingCategory.Gameplay,
  RatingCategory.Story,
  RatingCategory.Graphics,
  RatingCategory.Audio,
  RatingCategory.Performance,
];

export const INITIAL_GAMES_DATA_KEY = 'drunkpenguins_games_data';