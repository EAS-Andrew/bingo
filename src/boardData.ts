import { BoardTile } from './types';

export const boardTiles: BoardTile[] = [
  // Row 1 (tiles 1-10, left to right)
  { id: 1, item: "Iron Dagger", task: "Craft an iron dagger", type: "normal" },
  { id: 2, item: "Ladder Up", task: "", type: "ladder", goesTo: 15 },
  { id: 3, item: "Bronze Sword", task: "Obtain a bronze sword", type: "normal" },
  { id: 4, item: "Cook Shrimp", task: "Cook 10 shrimp", type: "normal" },
  { id: 5, item: "Mine Copper", task: "Mine 15 copper ore", type: "normal" },
  { id: 6, item: "Chop Oak Logs", task: "Cut 20 oak logs", type: "normal" },
  { id: 7, item: "Small Ladder", task: "", type: "ladder", goesTo: 18 },
  { id: 8, item: "Catch Trout", task: "Fish 5 trout", type: "normal" },
  { id: 9, item: "Light Fire", task: "Light 3 fires", type: "normal" },
  { id: 10, item: "Steel Bar", task: "Smelt a steel bar", type: "normal" },

  // Row 2 (tiles 11-20, right to left)
  { id: 11, item: "Mithril Ore", task: "Mine mithril ore", type: "normal" },
  { id: 12, item: "Magic Logs", task: "Cut magic logs", type: "normal" },
  { id: 13, item: "Dragon Bones", task: "Bury dragon bones", type: "normal" },
  { id: 14, item: "Snake Pit", task: "", type: "snake", goesTo: 4 },
  { id: 15, item: "Rune Armor", task: "Equip full rune armor", type: "normal" },
  { id: 16, item: "Fairy Ring A", task: "", type: "fairy_ring", fairyOptions: [28, 43] },
  { id: 17, item: "Barrows Item", task: "Get any barrows item", type: "normal" },
  { id: 18, item: "Abyssal Whip", task: "Obtain abyssal whip", type: "normal" },
  { id: 19, item: "Big Snake", task: "", type: "snake", goesTo: 6 },
  { id: 20, item: "Dragon Scimitar", task: "Get dragon scimitar", type: "normal" },

  // Row 3 (tiles 21-30, left to right)
  { id: 21, item: "Graceful Outfit", task: "Complete graceful set", type: "normal" },
  { id: 22, item: "Quest Cape", task: "Complete all quests", type: "normal" },
  { id: 23, item: "Slayer Helmet", task: "Craft slayer helmet", type: "normal" },
  { id: 24, item: "Fire Cape", task: "Obtain fire cape", type: "normal" },
  { id: 25, item: "Big Ladder", task: "", type: "ladder", goesTo: 38 },
  { id: 26, item: "Defender", task: "Get dragon defender", type: "normal" },
  { id: 27, item: "Void Set", task: "Complete void set", type: "normal" },
  { id: 28, item: "Fairy Ring B", task: "", type: "fairy_ring", fairyOptions: [16, 43] },
  { id: 29, item: "Bandos Item", task: "Get bandos armor piece", type: "normal" },
  { id: 30, item: "Armadyl Item", task: "Get armadyl armor piece", type: "normal" },

  // Row 4 (tiles 31-40, right to left)  
  { id: 31, item: "Saradomin Item", task: "Get saradomin armor piece", type: "normal" },
  { id: 32, item: "Zamorak Item", task: "Get zamorak armor piece", type: "normal" },
  { id: 33, item: "Venom Snake", task: "", type: "snake", goesTo: 13 },
  { id: 34, item: "Elite Diary", task: "Complete elite diary", type: "normal" },
  { id: 35, item: "Master Clue", task: "Complete master clue", type: "normal" },
  { id: 36, item: "Pet Drop", task: "Obtain any pet", type: "normal" },
  { id: 37, item: "Magic Ladder", task: "", type: "ladder", goesTo: 45 },
  { id: 38, item: "Infernal Cape", task: "Obtain infernal cape", type: "normal" },
  { id: 39, item: "Third Age", task: "Get third age item", type: "normal" },
  { id: 40, item: "Twisted Bow", task: "Obtain twisted bow", type: "normal" },

  // Row 5 (tiles 41-50, left to right)
  { id: 41, item: "Scythe", task: "Get scythe of vitur", type: "normal" },
  { id: 42, item: "Tbow Rebuild", task: "Rebuild after tbow", type: "normal" },
  { id: 43, item: "Fairy Ring C", task: "", type: "fairy_ring", fairyOptions: [16, 28] },
  { id: 44, item: "Dangerous Snake", task: "", type: "snake", goesTo: 26 },
  { id: 45, item: "Max Cape", task: "Achieve max cape", type: "normal" },
  { id: 46, item: "Diary Master", task: "Complete all diaries", type: "normal" },
  { id: 47, item: "Final Snake", task: "", type: "snake", goesTo: 31 },
  { id: 48, item: "Collection Log", task: "Complete collection log", type: "normal" },
  { id: 49, item: "Completionist", task: "Achieve all goals", type: "normal" },
  { id: 50, item: "🏆 VICTORY!", task: "Congratulations! You won!", type: "normal" }
];

export const sampleTeams = [
  { id: '1', name: 'Melee Warriors', color: '#DC2626', position: 1, members: ['Dharok', 'Abyssal'] },
  { id: '2', name: 'Magic Masters', color: '#3B82F6', position: 1, members: ['Ahrim', 'Wizard'] },
  { id: '3', name: 'Range Rangers', color: '#059669', position: 1, members: ['Karil', 'Archer'] },
  { id: '4', name: 'Skill Grinders', color: '#7C3AED', position: 1, members: ['Skiller', 'Crafter'] }
]; 