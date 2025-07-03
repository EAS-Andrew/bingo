export interface BoardTile {
  id: number;
  item: string;
  task: string;
  type: 'normal' | 'snake' | 'ladder' | 'fairy_ring';
  goesTo?: number; // for snakes/ladders
  fairyOptions?: number[]; // for fairy rings
}

export interface Team {
  id: string;
  name: string;
  color: string;
  position: number;
  members: string[];
}

export interface GameState {
  teams: Team[];
  currentTile?: BoardTile;
} 