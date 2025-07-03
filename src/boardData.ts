import { BoardTile } from './types';

export const boardTiles: BoardTile[] = [
  // Row 1 (bottom, tiles 1-10, left to right)
  { id: 1, item: "Black Mask", task: "Obtain Black Mask from cave horrors", type: "normal" },
  { id: 2, item: "Any Barrows", task: "Get any barrows weapon/armor", type: "normal" },
  { id: 3, item: "3 Scimitars", task: "Collect 3 different scimitars", type: "normal" },
  { id: 4, item: "Glacial Temper", task: "Complete Fremennik quest", type: "normal" },
  { id: 5, item: "Ladder", task: "Climb up!", type: "ladder", goesTo: 25 },
  { id: 6, item: "10 Hit Magic", task: "Deal 10+ damage with magic", type: "normal" },
  { id: 7, item: "Long Bone", task: "Obtain a long bone drop", type: "normal" },
  { id: 8, item: "Back to Lumby", task: "Die and respawn in Lumbridge", type: "normal" },
  { id: 9, item: "TzHaar Unique", task: "Get any TzHaar unique", type: "normal" },
  { id: 10, item: "Lumby Ring", task: "Complete Lumbridge diary task", type: "normal" },

  // Row 2 (tiles 11-20, right to left)
  { id: 11, item: "CoX Unique", task: "Get CoX unique", type: "normal" },
  { id: 12, item: "Any 3rd Drop", task: "Get any third age drop", type: "normal" },
  { id: 13, item: "Comp Beast Mode", task: "Complete beast mode", type: "normal" },
  { id: 14, item: "Champion Scroll", task: "Get champion scroll", type: "normal" },
  { id: 15, item: "Snake", task: "Slide down!", type: "snake", goesTo: 6 },
  { id: 16, item: "Nex Unique", task: "Defeat Nex", type: "normal" },
  { id: 17, item: "Masori Piece", task: "Get Masori armor", type: "normal" },
  { id: 18, item: "Avernic Piece", task: "Get Avernic defender", type: "normal" },
  { id: 19, item: "Nightmare Unique", task: "Get Nightmare unique", type: "normal" },
  { id: 20, item: "TOA Unique", task: "Get ToA unique", type: "normal" },

  // Row 3 (tiles 21-30, left to right)  
  { id: 21, item: "TOA Unique", task: "Get another ToA unique", type: "normal" },
  { id: 22, item: "UTS Boss Challenge", task: "Complete UTS boss challenge", type: "normal" },
  { id: 23, item: "Gauntlet Seed", task: "Get gauntlet seed", type: "normal" },
  { id: 24, item: "Private Server", task: "Join private server", type: "normal" },
  { id: 25, item: "Ladder", task: "Climb up!", type: "ladder", goesTo: 47 },
  { id: 26, item: "Snake", task: "Slide down!", type: "snake", goesTo: 6 },
  { id: 27, item: "Zulrah Unique", task: "Get Zulrah unique", type: "normal" },
  { id: 28, item: "Collection Log Unique", task: "Get collection log unique", type: "normal" },
  { id: 29, item: "Vorkath Unique", task: "Get Vorkath unique", type: "normal" },
  { id: 30, item: "Spider Boss Unique", task: "Kill spider boss", type: "normal" },

  // Row 4 (tiles 31-40, right to left)
  { id: 31, item: "Aerial Boss Unique", task: "Get aerial boss unique", type: "normal" },
  { id: 32, item: "Blood Shard", task: "Obtain blood shard", type: "normal" },
  { id: 33, item: "Ladder", task: "Climb up!", type: "ladder", goesTo: 55 },
  { id: 34, item: "Zulrah Unique", task: "Get another Zulrah unique", type: "normal" },
  { id: 35, item: "Boss Jars", task: "Collect boss jars", type: "normal" },
  { id: 36, item: "Mahram Unique", task: "Defeat Mahram", type: "normal" },
  { id: 37, item: "5 Grandmaster Quest Achievements", task: "Complete 5 grandmaster quest achievements", type: "normal" },
  { id: 38, item: "Clue from Barb Fishing", task: "Get clue from barbarian fishing", type: "normal" },
  { id: 39, item: "Every CA Ring", task: "Get every combat achievement ring", type: "normal" },
  { id: 40, item: "Complete A Master Quest", task: "Complete a master quest", type: "normal" },

  // Row 5 (tiles 41-50, left to right)
  { id: 41, item: "Enhanced Teleport Seed", task: "Get enhanced teleport seed", type: "normal" },
  { id: 42, item: "Godsword Piece", task: "Get godsword piece", type: "normal" },
  { id: 43, item: "Strange or Ancient Page", task: "Get strange or ancient page", type: "normal" },
  { id: 44, item: "Snake", task: "Slide down!", type: "snake", goesTo: 25 },
  { id: 45, item: "Zulkan Unique", task: "Get Zulkan unique", type: "normal" },
  { id: 46, item: "Ladder", task: "Climb up!", type: "ladder", goesTo: 65 },
  { id: 47, item: "Kree Arra Boss Jars", task: "Get Kree'arra boss jars", type: "normal" },
  { id: 48, item: "Nex Armadyl Crossbow", task: "Get Nex Armadyl crossbow", type: "normal" },
  { id: 49, item: "Unique from Every Kourend Boss", task: "Get unique from every Kourend boss", type: "normal" },
  { id: 50, item: "3 Barrows Sets", task: "Complete 3 barrows sets", type: "normal" },

  // Row 6 (tiles 51-60, right to left)
  { id: 51, item: "Fairy Ring", task: "Random teleport!", type: "fairy_ring", fairyOptions: [15, 35, 72] },
  { id: 52, item: "Abyssal Boots", task: "Get abyssal boots", type: "normal" },
  { id: 53, item: "Venomous or Chronicle Unique", task: "Get venomous or chronicle unique", type: "normal" },
  { id: 54, item: "50 Sarachnis Cudgel", task: "Get 50 Sarachnis cudgels", type: "normal" },
  { id: 55, item: "3 Master Combat Achievements", task: "Complete 3 master combat achievements", type: "normal" },
  { id: 56, item: "Slayer Boss Unique", task: "Get slayer boss unique", type: "normal" },
  { id: 57, item: "Snake", task: "Slide down!", type: "snake", goesTo: 38 },
  { id: 58, item: "Unique from Every Kourend Boss", task: "Get unique from every Kourend boss", type: "normal" },
  { id: 59, item: "Warrior Unique", task: "Get warrior unique", type: "normal" },
  { id: 60, item: "3 Barrows", task: "Get 3 barrows items", type: "normal" },

  // Row 7 (tiles 61-70, left to right)
  { id: 61, item: "Fairy Ring", task: "Random teleport!", type: "fairy_ring", fairyOptions: [25, 45, 80] },
  { id: 62, item: "Spiral Venom Unique", task: "Get spiral venom unique", type: "normal" },
  { id: 63, item: "Dark Bow", task: "Get dark bow", type: "normal" },
  { id: 64, item: "1 Tormented Demon", task: "Kill 1 tormented demon", type: "normal" },
  { id: 65, item: "Godsword Shard", task: "Get godsword shard", type: "normal" },
  { id: 66, item: "Ornate Staff Helm", task: "Get ornate staff helm", type: "normal" },
  { id: 67, item: "GtZ Quartz", task: "Mine granite", type: "normal" },
  { id: 68, item: "Ladder", task: "Climb up!", type: "ladder", goesTo: 89 },
  { id: 69, item: "Zulrah Unique", task: "Get Zulrah unique", type: "normal" },
  { id: 70, item: "R Drag or Dragonbone Outfit", task: "Get R drag or dragonbone outfit", type: "normal" },

  // Row 8 (tiles 71-80, right to left) 
  { id: 71, item: "Runescarved Unique", task: "Get runescarved unique", type: "normal" },
  { id: 72, item: "Fairy Ring", task: "Random teleport!", type: "fairy_ring", fairyOptions: [30, 50, 85] },
  { id: 73, item: "Spirit Seed Drop", task: "Get spirit seed drop", type: "normal" },
  { id: 74, item: "Vorkath or Dragonbone", task: "Get Vorkath or dragonbone", type: "normal" },
  { id: 75, item: "Sanguinesti Staff", task: "Get sanguinesti staff", type: "normal" },
  { id: 76, item: "Ancestral Whip", task: "Get ancestral whip", type: "normal" },
  { id: 77, item: "Ballista Drop", task: "Get ballista drop", type: "normal" },
  { id: 78, item: "Elder Chaos", task: "Cut elder logs in wilderness", type: "normal" },
  { id: 79, item: "Lite Win", task: "Win lite", type: "normal" },
  { id: 80, item: "Bounty Hunter", task: "Get bounty hunter kill", type: "normal" },

  // Row 9 (tiles 81-90, left to right)
  { id: 81, item: "Snake", task: "Slide down!", type: "snake", goesTo: 62 },
  { id: 82, item: "Ancestral Whip", task: "Get ancestral whip", type: "normal" },
  { id: 83, item: "Ballista Drop", task: "Get ballista drop", type: "normal" },
  { id: 84, item: "Elder Chaos", task: "Cut elder logs", type: "normal" },
  { id: 85, item: "Bounty Hunter", task: "Get bounty hunter", type: "normal" },
  { id: 86, item: "Saradomin", task: "Get Saradomin item", type: "normal" },
  { id: 87, item: "Snake", task: "Slide down!", type: "snake", goesTo: 68 },
  { id: 88, item: "Spirit Seed Drop", task: "Get spirit seed drop", type: "normal" },
  { id: 89, item: "Vorkath or Dragonbone", task: "Get Vorkath or dragonbone", type: "normal" },
  { id: 90, item: "Sanguinesti Staff", task: "Get sanguinesti staff", type: "normal" },

  // Top row (tiles 91-100, right to left)
  { id: 91, item: "R Drag or Dragon Outfit", task: "Get R drag or dragon outfit", type: "normal" },
  { id: 92, item: "Boot Head Drop Any Boss", task: "Get boot head drop from any boss", type: "normal" },
  { id: 93, item: "TzHaar Unique", task: "Get TzHaar unique", type: "normal" },
  { id: 94, item: "Complete A Master Quest", task: "Complete a master quest", type: "normal" },
  { id: 95, item: "CoX Unique", task: "Get CoX unique", type: "normal" },
  { id: 96, item: "Best Weapon Abyssal or Scythe", task: "Get best weapon (abyssal or scythe)", type: "normal" },
  { id: 97, item: "Any 3rd Drop", task: "Get any third age drop", type: "normal" },
  { id: 98, item: "Comp Beast Mode", task: "Complete beast mode", type: "normal" },
  { id: 99, item: "Champion Scroll", task: "Get champion scroll", type: "normal" },
  { id: 100, item: "🏆 FINISH!", task: "Complete the challenge!", type: "normal" }
];

export const sampleTeams = [
  { id: '1', name: 'Barrows Bros', color: '#8B4513', position: 1, members: ['Dharok', 'Ahrim', 'Karil'] },
  { id: '2', name: 'GWD Squad', color: '#DAA520', position: 1, members: ['Bandos', 'Sara', 'Zammy'] },
  { id: '3', name: 'Slayer Gang', color: '#228B22', position: 1, members: ['Duradel', 'Nieve', 'Steve'] }
]; 