import type { Game } from './Game';
import { createGame } from './fabric';
import type { GameState } from './GameSession';
import { level1 } from './level/levels';

const LEVELS = {
  level1,
};

export { createGame, type Game, type GameState, LEVELS };