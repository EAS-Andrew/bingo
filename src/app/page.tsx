'use client';

import { useState, useEffect } from 'react';
import { Team, BoardTile } from '../types';
import { boardTiles, sampleTeams } from '../boardData';

type UserRole = 'leader' | 'participant';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [movingTeam, setMovingTeam] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('participant');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTile, setEditingTile] = useState<BoardTile | null>(null);
  const [boardData, setBoardData] = useState<BoardTile[]>(boardTiles);
  const [heldKeys, setHeldKeys] = useState<{ shift: boolean, ctrl: boolean, alt: boolean }>({ shift: false, ctrl: false, alt: false });
  const [hoveredInsertPosition, setHoveredInsertPosition] = useState<number | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ tile: BoardTile; teams: Team[]; x: number; y: number } | null>(null);
  const [highlightedDestinations, setHighlightedDestinations] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [connectionMode, setConnectionMode] = useState<{ sourceId: number; type: 'snake' | 'ladder' } | null>(null);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-disable edit mode on mobile
  useEffect(() => {
    if (isMobile && isEditMode) {
      setIsEditMode(false);
    }
  }, [isMobile, isEditMode]);

  const updateTeamPosition = (teamId: string, newPosition: number) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, position: newPosition } : team
    ));
  };

  const addTeam = () => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: `Team ${teams.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      position: 1,
      members: []
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const removeTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const editTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  const resetAllTeamPositions = () => {
    setTeams(prev => prev.map(team => ({ ...team, position: 1 })));
  };

  const getTileHoverInfo = (tile: BoardTile, teamsHere: Team[]) => {
    const parts = [];

    // Tile info
    parts.push(`#${tile.id} • ${tile.item}`);

    // Task info (only for normal tiles)
    if (tile.type === 'normal' && tile.task) {
      parts.push(`Task: ${tile.task}`);
    }

    // Special tile type info
    if (tile.type === 'snake' && tile.goesTo) {
      parts.push(`🐍 Snake to tile ${tile.goesTo}`);
    } else if (tile.type === 'ladder' && tile.goesTo) {
      parts.push(`🪜 Ladder to tile ${tile.goesTo}`);
    } else if (tile.type === 'fairy_ring' && tile.fairyOptions) {
      parts.push(`✦ Fairy ring to tiles ${tile.fairyOptions.join(', ')}`);
    }

    // Teams on tile
    if (teamsHere.length > 0) {
      const teamNames = teamsHere.map(team => team.name).join(', ');
      parts.push(`Teams: ${teamNames}`);
    }

    // Edit mode specific info
    if (isEditMode && userRole === 'leader') {
      parts.push('');
      parts.push('Edit: Click • Shift+Click: Delete');
      parts.push('Ctrl+Click: Cycle type • Alt+Click: Duplicate');
    }

    return parts.join('\n');
  };

  const rollD6 = (): number => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const handleTileClick = (tile: BoardTile, event?: React.MouseEvent) => {
    if (isEditMode && userRole === 'leader' && !isMobile) {
      // Handle connection mode clicks
      if (connectionMode) {
        const isValidTarget = tile.type === 'normal' && tile.id !== connectionMode.sourceId && (
          // Ladders can only go to future tiles (higher numbers)
          connectionMode.type === 'ladder' ? tile.id > connectionMode.sourceId :
            // Snakes can only go to previous tiles (lower numbers)  
            connectionMode.type === 'snake' ? tile.id < connectionMode.sourceId : false
        );

        if (isValidTarget) {
          // Valid destination - create connection
          const updatedTile: BoardTile = {
            ...boardData.find(t => t.id === connectionMode.sourceId)!,
            goesTo: tile.id
          };
          updateBoardTileWithFairyRingUpdates(updatedTile);
          setConnectionMode(null);
          return;
        } else {
          // Invalid destination or clicking source tile - exit connection mode
          setConnectionMode(null);
          return;
        }
      }

      // Shift+Click = Delete tile
      if (event?.shiftKey) {
        deleteTile(tile.id);
        return;
      }

      // Ctrl+Click = Quick type cycle (normal → snake → ladder → fairy_ring → normal)
      if (event?.ctrlKey || event?.metaKey) {
        const typeOrder: ('normal' | 'snake' | 'ladder' | 'fairy_ring')[] = ['normal', 'snake', 'ladder', 'fairy_ring'];
        const currentIndex = typeOrder.indexOf(tile.type);
        const nextIndex = (currentIndex + 1) % typeOrder.length;
        const newType = typeOrder[nextIndex];

        const updatedTile: BoardTile = {
          ...tile,
          type: newType,
          // Update item name and clear task for special tiles
          item: newType !== 'normal' ? (
            newType === 'snake' ? `Snake #${tile.id}` :
              newType === 'ladder' ? `Ladder #${tile.id}` :
                newType === 'fairy_ring' ? `Fairy Ring #${tile.id}` : tile.item
          ) : tile.item,
          task: newType === 'normal' ? tile.task : '',
          goesTo: newType === 'normal' || newType === 'fairy_ring' ? undefined : tile.goesTo,
          fairyOptions: undefined // Will be set automatically for fairy rings
        };
        updateBoardTileWithFairyRingUpdates(updatedTile);
        return;
      }

      // Alt+Click = Duplicate tile at end
      if (event?.altKey) {
        setBoardData(prev => {
          const newId = prev.length + 1;
          const duplicatedTile: BoardTile = {
            ...tile,
            id: newId,
            item: `${tile.item} (Copy)`,
            // Don't copy connections to avoid conflicts
            goesTo: undefined,
            fairyOptions: undefined
          };
          return [...prev, duplicatedTile];
        });
        return;
      }

      // Special tile click = Enter connection mode (for snake/ladder) or edit modal (for others)
      if (tile.type === 'snake' || tile.type === 'ladder') {
        setConnectionMode({ sourceId: tile.id, type: tile.type });
        return;
      }

      // Regular click = Edit tile (for normal tiles and fairy rings)
      setEditingTile(tile);
    } else {
      setSelectedTile(tile);
    }
  };

  const updateBoardTileWithFairyRingUpdates = (updatedTile: BoardTile) => {
    setBoardData(prev => {
      // Update the current tile
      const newBoardData = prev.map(tile =>
        tile.id === updatedTile.id ? updatedTile : tile
      );

      // Auto-update all fairy rings to target each other
      const fairyRings = newBoardData.filter(tile => tile.type === 'fairy_ring');
      if (fairyRings.length > 0) {
        const fairyRingIds = fairyRings.map(ring => ring.id);

        return newBoardData.map(tile => {
          if (tile.type === 'fairy_ring') {
            // Each fairy ring targets all other fairy rings
            const otherFairyRings = fairyRingIds.filter(id => id !== tile.id);
            return {
              ...tile,
              fairyOptions: otherFairyRings.length > 0 ? otherFairyRings : undefined
            };
          }
          return tile;
        });
      }

      return newBoardData;
    });
    setEditingTile(null);
  };

  const addNewTile = (insertAtIndex?: number) => {
    setBoardData(prev => {
      if (insertAtIndex === undefined) {
        // Add at the end
        const newId = prev.length + 1;
        const newTile: BoardTile = {
          id: newId,
          item: `New Item ${newId}`,
          task: `Complete task ${newId}`,
          type: 'normal'
        };
        return [...prev, newTile];
      } else {
        // Insert at the specified index and renumber everything
        const newTile: BoardTile = {
          id: insertAtIndex + 1,
          item: `New Item ${insertAtIndex + 1}`,
          task: `Complete task ${insertAtIndex + 1}`,
          type: 'normal'
        };

        // Split the array and insert the new tile
        const before = prev.slice(0, insertAtIndex);
        const after = prev.slice(insertAtIndex);
        const newArray = [...before, newTile, ...after];

        // Renumber all tiles sequentially
        return newArray.map((tile, index) => ({
          ...tile,
          id: index + 1,
          item: tile.item.replace(/New Item \d+/, `New Item ${index + 1}`),
          task: tile.task.replace(/Complete task \d+/, `Complete task ${index + 1}`)
        }));
      }
    });
  };

  const deleteTile = (tileId: number) => {
    setBoardData(prev => {
      // Remove the tile
      const filtered = prev.filter(tile => tile.id !== tileId);

      // Renumber all tiles sequentially
      const renumbered = filtered.map((tile, index) => ({
        ...tile,
        id: index + 1
      }));

      // Create mapping from old IDs to new IDs
      const idMapping = new Map();
      filtered.forEach((tile, index) => {
        idMapping.set(tile.id, index + 1);
      });

      // Update all connections to use new IDs
      return renumbered.map(tile => ({
        ...tile,
        goesTo: tile.goesTo && idMapping.has(tile.goesTo) ? idMapping.get(tile.goesTo) : undefined,
        fairyOptions: tile.fairyOptions?.map(id => idMapping.get(id)).filter(id => id !== undefined)
      }));
    });

    // Update team positions to account for renumbering
    setTeams(prev => prev.map(team => {
      // If team was on deleted tile, move to tile 1
      if (team.position === tileId) {
        return { ...team, position: 1 };
      }

      // Calculate new position based on how many tiles before this one were deleted/renumbered
      let newPosition = team.position;
      if (team.position > tileId) {
        // If team was on a tile after the deleted one, shift position down by 1
        newPosition = team.position - 1;
      }

      return { ...team, position: Math.max(1, newPosition) };
    }));
  };

  const resetBoard = () => {
    setBoardData([]);
    // Don't exit edit mode when resetting - stay in edit mode
  };

  const exportBoard = () => {
    const dataStr = JSON.stringify(boardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'board-config.json';
    link.click();
  };

  const importBoard = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            if (Array.isArray(importedData) && importedData.length > 0) {
              setBoardData(importedData);
              // Reset team positions that might be out of bounds
              setTeams(prev => prev.map(team => ({
                ...team,
                position: team.position > importedData.length ? 1 : team.position
              })));
            }
          } catch {
            alert('Invalid board configuration file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const animateTeamMove = async (teamId: string, startPos: number, endPos: number, steps: number = 1) => {
    setMovingTeam(teamId);

    const maxTile = boardData.length;

    for (let i = 1; i <= steps; i++) {
      const currentPos = Math.min(startPos + i, maxTile);
      updateTeamPosition(teamId, currentPos);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const landedTile = boardData.find(t => t.id === endPos);
    if (landedTile) {
      if (landedTile.type === 'snake' || landedTile.type === 'ladder') {
        if (landedTile.goesTo) {
          await new Promise(resolve => setTimeout(resolve, 400));
          updateTeamPosition(teamId, landedTile.goesTo);
        }
      } else if (landedTile.type === 'fairy_ring' && landedTile.fairyOptions) {
        const fairyRoll = rollD6();
        let destination: number;

        // Safely handle fairy rings with different numbers of options
        const numOptions = landedTile.fairyOptions.length;
        if (numOptions === 1) {
          destination = landedTile.fairyOptions[0];
        } else if (numOptions === 2) {
          destination = fairyRoll <= 3 ? landedTile.fairyOptions[0] : landedTile.fairyOptions[1];
        } else {
          // 3 or more options - distribute evenly
          if (fairyRoll <= 2) {
            destination = landedTile.fairyOptions[0];
          } else if (fairyRoll <= 4) {
            destination = landedTile.fairyOptions[1];
          } else {
            destination = landedTile.fairyOptions[2] || landedTile.fairyOptions[0]; // fallback to first option
          }
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        updateTeamPosition(teamId, destination);
      }
    }

    setMovingTeam(null);
  };

  const rollForTeam = async (teamId: string) => {
    if (isRolling || movingTeam) return;

    setIsRolling(true);
    setDiceRoll(null);

    let rollCount = 0;
    const rollAnimation = setInterval(() => {
      setDiceRoll(rollD6());
      rollCount++;

      if (rollCount >= 8) {
        clearInterval(rollAnimation);
        const finalRoll = rollD6();
        setDiceRoll(finalRoll);
        setIsRolling(false);

        const team = teams.find(t => t.id === teamId);
        if (team) {
          const maxTile = boardData.length;
          const newPosition = Math.min(team.position + finalRoll, maxTile);
          animateTeamMove(teamId, team.position, newPosition, finalRoll);
        }
      }
    }, 100);
  };

  const sortedTeams = [...teams].sort((a, b) => b.position - a.position);

  // Dynamic grid calculation based on number of tiles
  const calculateOptimalGrid = (totalTiles: number) => {
    if (totalTiles <= 0) return { cols: 1, rows: 1 }; // Minimum 1x1 grid for add button

    // Mobile-specific constraints
    if (isMobile) {
      const maxCols = 6; // Fewer columns on mobile for better touch targets
      const minCols = 4;

      // For mobile, prioritize fewer columns for larger tiles
      const cols = Math.min(Math.max(Math.ceil(Math.sqrt(totalTiles) * 0.8), minCols), maxCols);
      const rows = Math.ceil(totalTiles / cols);

      return { cols, rows };
    }

    // Desktop constraints
    const maxCols = 20; // Maximum columns to prevent tiny tiles
    const minCols = 5;  // Minimum columns for usability

    // Start with square root but cap it
    const sqrt = Math.sqrt(totalTiles);
    let cols = Math.min(Math.max(Math.ceil(sqrt), minCols), maxCols);
    let rows = Math.ceil(totalTiles / cols);

    // Try to optimize for better aspect ratios within bounds
    // Prefer slightly wider grids (better for landscape displays)
    if (cols < maxCols && rows > 1) {
      const alternativeCols = cols + 1;
      const alternativeRows = Math.ceil(totalTiles / alternativeCols);

      // If adding a column reduces rows significantly, do it
      if (alternativeRows < rows - 1) {
        cols = alternativeCols;
        rows = alternativeRows;
      }
    }

    // Final check - make sure we don't have too many rows
    if (rows > 15) {
      cols = Math.min(Math.ceil(totalTiles / 15), maxCols);
      rows = Math.ceil(totalTiles / cols);
    }

    return { cols, rows };
  };

  const { cols, rows } = calculateOptimalGrid(boardData.length);

  const getSnakingPositionForGrid = (tileId: number, cols: number) => {
    const index = tileId - 1;
    const row = Math.floor(index / cols);
    const col = row % 2 === 0 ? index % cols : (cols - 1) - (index % cols);
    return { row, col };
  };

  // Global keyboard shortcuts and key tracking
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Track modifier keys for visual feedback
      setHeldKeys(prev => ({
        ...prev,
        shift: event.shiftKey,
        ctrl: event.ctrlKey || event.metaKey,
        alt: event.altKey
      }));

      // Only handle global shortcuts in edit mode
      if (!isEditMode || userRole !== 'leader') return;

      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          if (connectionMode) {
            setConnectionMode(null);
          } else if (editingTile) {
            setEditingTile(null);
          } else {
            setIsEditMode(false);
          }
          event.preventDefault();
          break;

        case ' ':
          addNewTile();
          event.preventDefault();
          break;

        case 'Delete':
        case 'Backspace':
          if (editingTile) {
            deleteTile(editingTile.id);
            setEditingTile(null);
            event.preventDefault();
          }
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Update modifier key state
      setHeldKeys(prev => ({
        ...prev,
        shift: event.shiftKey,
        ctrl: event.ctrlKey || event.metaKey,
        alt: event.altKey
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditMode, userRole, editingTile, connectionMode, addNewTile, deleteTile]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="max-w-[1800px] mx-auto p-4 md:p-8">

        {/* Header */}
        <header className="border-b border-neutral-700 pb-4 md:pb-6 mb-4 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-100 mb-1">
                OSRS Board Game
              </h1>
              <div className="text-sm text-neutral-400 font-mono">
                {boardData.length} TILES · {teams.length} TEAMS
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                {userRole === 'leader' ? 'Game Leader' : 'Team Member'}
                {isEditMode && userRole === 'leader' && (
                  <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded">EDIT MODE</span>
                )}
              </div>

              <div className="flex gap-2">
                {userRole === 'leader' && !isMobile && (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex-1 md:flex-none px-3 md:px-4 py-2 text-sm font-medium border transition-colors ${isEditMode
                      ? 'border-orange-500 bg-orange-600 text-white hover:bg-orange-500'
                      : 'border-neutral-600 hover:border-neutral-400 bg-neutral-800 hover:bg-neutral-700'
                      }`}
                  >
                    {isEditMode ? 'Exit Editor' : 'Edit Board'}
                  </button>
                )}

                <button
                  onClick={() => {
                    setUserRole(userRole === 'leader' ? 'participant' : 'leader');
                    if (userRole === 'leader' && isEditMode) {
                      setIsEditMode(false);
                    }
                  }}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 text-sm font-medium border border-neutral-600 hover:border-neutral-400 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  {userRole === 'leader' ? 'View as Member' : 'Leader Mode'}
                </button>

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden px-3 py-2 text-sm font-medium border border-neutral-600 hover:border-neutral-400 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">

          {/* Game Board */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="border border-neutral-700 bg-neutral-800">
              <div className="p-4 md:p-6 border-b border-neutral-700">
                <h2 className="text-lg font-medium text-neutral-100">Game Board</h2>
              </div>

              <div className="p-4 md:p-6">
                {/* Connection Mode Banner */}
                {connectionMode && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-2 border-blue-500 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {connectionMode.type === 'snake' ? '🐍' : '🪜'}
                      </div>
                      <div>
                        <div className="text-blue-200 font-medium">
                          {connectionMode.type === 'snake' ? 'Snake' : 'Ladder'} Connection Mode
                        </div>
                        <div className="text-xs text-blue-300">
                          {connectionMode.type === 'snake' ?
                            'Click a green tile with a lower number to set destination' :
                            'Click a green tile with a higher number to set destination'
                          } • Press Escape to cancel
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="grid gap-1 bg-neutral-900 p-3 md:p-4 w-full max-w-4xl mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    ...(isEditMode ? {} : {
                      gridTemplateRows: `repeat(${rows}, 1fr)`,
                      aspectRatio: `${cols} / ${rows}`
                    })
                  }}
                  onClick={(e) => {
                    // Exit connection mode if clicking the grid background
                    if (connectionMode && e.target === e.currentTarget) {
                      setConnectionMode(null);
                    }
                  }}
                >

                  {boardData.map((tile) => {
                    const position = getSnakingPositionForGrid(tile.id, cols);
                    const teamsHere = teams.filter(team => team.position === tile.id);
                    const isMoving = movingTeam && teamsHere.some(team => team.id === movingTeam);
                    const isSelected = selectedTile?.id === tile.id;
                    const isEditing = editingTile?.id === tile.id;
                    const isHovering = hoveredInsertPosition === tile.id;
                    const isHighlightedDestination = highlightedDestinations.includes(tile.id);
                    const isConnectionSource = connectionMode?.sourceId === tile.id;
                    const isValidConnectionTarget = connectionMode && tile.type === 'normal' && tile.id !== connectionMode.sourceId && (
                      // Ladders can only go to future tiles (higher numbers)
                      connectionMode.type === 'ladder' ? tile.id > connectionMode.sourceId :
                        // Snakes can only go to previous tiles (lower numbers)
                        connectionMode.type === 'snake' ? tile.id < connectionMode.sourceId : false
                    );
                    const isInvalidConnectionTarget = connectionMode && !isValidConnectionTarget && !isConnectionSource;

                    let tileStyle = 'bg-neutral-700 border border-neutral-600 hover:border-neutral-500 text-neutral-200';

                    // Connection mode overrides
                    if (connectionMode) {
                      if (isConnectionSource) {
                        tileStyle = `${connectionMode.type === 'snake' ? 'bg-red-600' : 'bg-emerald-600'} border-2 border-white text-white animate-pulse shadow-lg shadow-white/30`;
                      } else if (isValidConnectionTarget) {
                        tileStyle = 'bg-green-600/60 border-2 border-green-400 text-green-100 hover:bg-green-500/70 cursor-pointer shadow-lg shadow-green-500/20';
                      } else if (isInvalidConnectionTarget) {
                        tileStyle = 'bg-neutral-800/50 border border-neutral-700 text-neutral-500 opacity-40 cursor-not-allowed';
                      }
                    } else {
                      // Normal styling when not in connection mode
                      if (tile.type === 'snake') tileStyle = 'bg-red-900/40 border-red-700 hover:border-red-600 text-red-200';
                      if (tile.type === 'ladder') tileStyle = 'bg-emerald-900/40 border-emerald-700 hover:border-emerald-600 text-emerald-200';
                      if (tile.type === 'fairy_ring') tileStyle = 'bg-gradient-to-br from-violet-900/60 via-purple-800/50 to-indigo-900/60 border-violet-500 hover:border-violet-400 text-violet-100 animate-pulse fairy-ring-glow';
                      if (isHighlightedDestination) tileStyle = 'bg-yellow-600/50 border-yellow-400 border-2 text-yellow-100 animate-pulse shadow-lg shadow-yellow-500/20';
                      if (isSelected) tileStyle = 'bg-neutral-100 border-neutral-200 text-neutral-900';
                      if (isEditing && isEditMode && !isMobile) tileStyle = 'bg-orange-600 border-orange-500 text-white';
                      if (isEditMode && userRole === 'leader' && !isMobile) tileStyle += ' hover:border-orange-400 cursor-pointer';
                    }

                    return (
                      <button
                        key={tile.id}
                        className={`aspect-square text-[10px] md:text-xs font-mono cursor-pointer transition-all relative group min-h-[40px] md:min-h-[48px] ${tileStyle} ${isMoving ? 'animate-pulse' : ''}`}
                        style={{
                          gridRow: position.row + 1,
                          gridColumn: position.col + 1,
                        }}
                        onClick={(event) => handleTileClick(tile, event)}
                        onMouseEnter={(e) => {
                          if (isEditMode && userRole === 'leader' && !isMobile && !connectionMode) {
                            setHoveredInsertPosition(tile.id);
                          }

                          // Don't show tooltip during connection mode
                          if (!connectionMode) {
                            setHoveredTile({
                              tile,
                              teams: teamsHere,
                              x: e.clientX,
                              y: e.clientY
                            });

                            // Highlight destination tiles for special tiles
                            const destinations = [];
                            if (tile.type === 'snake' || tile.type === 'ladder') {
                              if (tile.goesTo) destinations.push(tile.goesTo);
                            } else if (tile.type === 'fairy_ring' && tile.fairyOptions) {
                              destinations.push(...tile.fairyOptions);
                            }
                            setHighlightedDestinations(destinations);
                          }
                        }}
                        onMouseMove={(e) => {
                          if (hoveredTile?.tile.id === tile.id) {
                            setHoveredTile({
                              tile,
                              teams: teamsHere,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredInsertPosition(null);
                          setHoveredTile(null);
                          setHighlightedDestinations([]);
                        }}
                        onTouchStart={(e) => {
                          // Show tile info on touch for mobile
                          setHoveredTile({
                            tile,
                            teams: teamsHere,
                            x: e.touches[0].clientX,
                            y: e.touches[0].clientY
                          });
                        }}
                        onTouchEnd={() => {
                          setTimeout(() => setHoveredTile(null), 2000);
                        }}
                      >
                        <div className="absolute top-0.5 md:top-1 left-0.5 md:left-1 text-[8px] md:text-[10px] font-bold opacity-60">
                          {tile.id}
                        </div>

                        {tile.type === 'snake' && (
                          <div className="absolute bottom-0.5 md:bottom-1 right-0.5 md:right-1 text-red-400 text-[10px] md:text-xs">
                            🐍{tile.goesTo || '?'}
                          </div>
                        )}
                        {tile.type === 'ladder' && (
                          <div className="absolute bottom-0.5 md:bottom-1 right-0.5 md:right-1 text-emerald-400 text-[10px] md:text-xs">
                            🪜{tile.goesTo || '?'}
                          </div>
                        )}
                        {tile.type === 'fairy_ring' && (
                          <div className="absolute bottom-0.5 md:bottom-1 right-0.5 md:right-1 text-violet-400 text-[10px] md:text-xs">
                            ✦{tile.fairyOptions ? tile.fairyOptions.join(',') : '?'}
                          </div>
                        )}

                        {isEditMode && userRole === 'leader' && !isMobile && !connectionMode && (
                          <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center ${heldKeys.shift ? 'bg-red-500/30' :
                            heldKeys.ctrl ? 'bg-blue-500/30' :
                              heldKeys.alt ? 'bg-green-500/30' :
                                'bg-orange-500/20'
                            }`}>
                            {heldKeys.shift && (
                              <div className="text-xs font-bold text-white">DELETE</div>
                            )}
                            {heldKeys.ctrl && (
                              <div className="text-xs font-bold text-white">CYCLE TYPE</div>
                            )}
                            {heldKeys.alt && (
                              <div className="text-xs font-bold text-white">DUPLICATE</div>
                            )}
                            {!heldKeys.shift && !heldKeys.ctrl && !heldKeys.alt && (
                              <>
                                <span className="text-xs font-bold text-white mb-1">EDIT</span>
                                <div className="text-[10px] text-white/80 leading-tight">
                                  <div>⇧ Del</div>
                                  <div>⌃ Type</div>
                                  <div>⌥ Copy</div>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Team markers */}
                        {teamsHere.length > 0 && !isEditMode && (
                          <div className="absolute top-0.5 md:top-1 right-0.5 md:right-1 flex gap-0.5">
                            {teamsHere.slice(0, 4).map(team => (
                              <div
                                key={team.id}
                                className="w-1.5 h-1.5 md:w-2 md:h-2 border border-neutral-800"
                                style={{ backgroundColor: team.color }}
                              />
                            ))}
                            {teamsHere.length > 4 && (
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 border border-neutral-800 bg-neutral-600 flex items-center justify-center">
                                <span className="text-[5px] md:text-[6px] text-white font-bold">+{teamsHere.length - 4}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Insert buttons when hovering */}
                        {isEditMode && userRole === 'leader' && !isMobile && isHovering && (() => {
                          const currentIndex = boardData.findIndex(t => t.id === tile.id);
                          const row = Math.floor((tile.id - 1) / cols);
                          const isLeftToRight = row % 2 === 0;

                          return (
                            <>
                              <button
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-green-900/50 border border-green-600 hover:bg-green-900/70 text-green-300 hover:text-green-200 cursor-pointer transition-all flex items-center justify-center text-xs font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // For left-to-right rows: left = before, for right-to-left: left = after
                                  const insertIndex = isLeftToRight ? currentIndex : currentIndex + 1;
                                  addNewTile(insertIndex);
                                }}
                                title={`Insert tile ${isLeftToRight ? 'before' : 'after'} ${tile.id}`}
                              >
                                +
                              </button>
                              <button
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-green-900/50 border border-green-600 hover:bg-green-900/70 text-green-300 hover:text-green-200 cursor-pointer transition-all flex items-center justify-center text-xs font-bold"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // For left-to-right rows: right = after, for right-to-left: right = before
                                  const insertIndex = isLeftToRight ? currentIndex + 1 : currentIndex;
                                  addNewTile(insertIndex);
                                }}
                                title={`Insert tile ${isLeftToRight ? 'after' : 'before'} ${tile.id}`}
                              >
                                +
                              </button>
                            </>
                          );
                        })()}
                      </button>
                    );
                  })}

                  {/* Add new tile button */}
                  {isEditMode && userRole === 'leader' && !isMobile && (() => {
                    if (boardData.length === 0) {
                      // Special case for empty board - show add button in center
                      return (
                        <button
                          className="aspect-square text-lg font-mono cursor-pointer transition-all relative bg-neutral-800/50 border-2 border-dashed border-green-600 hover:border-green-500 hover:bg-green-900/20 text-green-500 hover:text-green-300 min-h-[120px]"
                          style={{
                            gridRow: 1,
                            gridColumn: 1,
                          }}
                          onClick={() => addNewTile()}
                          title="Add first tile to start building your board"
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl font-bold">+</span>
                            <span className="text-xs text-neutral-400">Add First Tile</span>
                          </div>
                        </button>
                      );
                    }

                    const nextTileId = boardData.length + 1;
                    const nextPosition = getSnakingPositionForGrid(nextTileId, cols);

                    return (
                      <button
                        className="aspect-square text-xs font-mono cursor-pointer transition-all relative bg-neutral-800/50 border border-dashed border-neutral-600 hover:border-green-500 hover:bg-green-900/20 text-neutral-500 hover:text-green-300"
                        style={{
                          gridRow: nextPosition.row + 1,
                          gridColumn: nextPosition.col + 1,
                          opacity: hoveredInsertPosition ? 0.8 : 0.4,
                        }}
                        onClick={() => addNewTile()}
                        onMouseEnter={() => setHoveredInsertPosition(-1)}
                        onMouseLeave={() => setHoveredInsertPosition(null)}
                        title="Add new tile"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">+</span>
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`w-full lg:w-80 space-y-4 lg:space-y-6 order-1 lg:order-2 ${isSidebarOpen ? 'block' : 'hidden lg:block'
            }`}>

            {userRole === 'leader' ? (
              // LEADER CONTROLS
              <>
                {isEditMode && !isMobile && (
                  /* Board Editor Controls */
                  <div className="border border-orange-600 bg-orange-900/20">
                    <div className="p-4 border-b border-orange-600">
                      <h3 className="font-medium text-orange-200">Board Editor</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={importBoard}
                            className="p-3 md:p-2 text-sm md:text-xs border border-blue-600 hover:border-blue-500 text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            Import
                          </button>
                          <button
                            onClick={exportBoard}
                            className="p-3 md:p-2 text-sm md:text-xs border border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-neutral-100 transition-colors"
                          >
                            Export
                          </button>
                        </div>

                        <button
                          onClick={resetBoard}
                          className="w-full p-3 md:p-2 text-sm md:text-xs border border-red-600 hover:border-red-500 text-red-300 hover:text-red-200 transition-colors"
                        >
                          Reset Board
                        </button>

                        <div className="text-xs text-neutral-400 space-y-1">
                          {boardData.length === 0 ? (
                            <>
                              <p className="text-green-400">• Click the + button to add your first tile</p>
                              <p>• Build your custom board from there</p>
                            </>
                          ) : (
                            <>
                              <p>• Click tiles to edit • + tile to add</p>
                              <p>• Click 🐍/🪜 tiles to set destination (🐍→lower, 🪜→higher)</p>
                              <p>• Shift+Click to delete • Ctrl+Click to cycle type</p>
                            </>
                          )}
                          <p className="text-orange-400">{boardData.length} tiles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Management */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-100">Team Management</h3>
                      <button
                        onClick={addTeam}
                        className="text-sm md:text-xs px-3 md:px-2 py-2 md:py-1 border border-green-600 hover:border-green-500 text-green-300 hover:text-green-200 transition-colors"
                      >
                        Add Team
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {teams.map(team => (
                        <div key={team.id} className="border border-neutral-700 bg-neutral-750 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 border border-neutral-500 cursor-pointer"
                              style={{ backgroundColor: team.color }}
                              onClick={() => {
                                const newColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
                                editTeam(team.id, { color: newColor });
                              }}
                              title="Click to change color"
                            />
                            <input
                              type="text"
                              value={team.name}
                              onChange={(e) => editTeam(team.id, { name: e.target.value })}
                              className="flex-1 bg-neutral-800 border border-neutral-600 text-neutral-200 text-sm px-2 py-1 focus:outline-none focus:border-neutral-400"
                            />
                            <button
                              onClick={() => removeTeam(team.id)}
                              className="text-xs px-2 py-1 border border-red-600 hover:border-red-500 text-red-300 hover:text-red-200 transition-colors"
                              title="Remove team"
                            >
                              ×
                            </button>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Position: {team.position} • Members: {team.members.length}
                          </div>
                        </div>
                      ))}
                    </div>

                    {teams.length > 0 && (
                      <button
                        onClick={resetAllTeamPositions}
                        className="w-full mt-3 p-2 text-xs border border-yellow-600 hover:border-yellow-500 text-yellow-300 hover:text-yellow-200 transition-colors"
                      >
                        Reset All Positions
                      </button>
                    )}
                  </div>
                </div>

                {/* Game Control */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-100">Game Control</h3>
                      <div className="text-xs text-neutral-400 font-mono">
                        {isRolling || movingTeam ? 'ACTIVE' : 'READY'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-neutral-500 bg-neutral-900 mx-auto flex items-center justify-center text-2xl md:text-3xl font-bold font-mono mb-3 transition-all">
                        {diceRoll || '?'}
                      </div>
                      <div className="text-xs md:text-sm text-neutral-400 font-mono uppercase tracking-wider mb-4">
                        {isRolling ? 'Rolling dice...' : movingTeam ? `Moving ${teams.find(t => t.id === movingTeam)?.name}` : 'Ready to roll'}
                      </div>

                      {/* Quick Roll All Button */}
                      <button
                        onClick={async () => {
                          for (const team of teams) {
                            if (!isRolling && !movingTeam) {
                              await rollForTeam(team.id);
                              await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                          }
                        }}
                        disabled={isRolling || movingTeam !== null}
                        className={`w-full mb-4 p-3 md:p-2 text-sm md:text-xs font-mono border transition-all ${isRolling || movingTeam !== null
                          ? 'border-neutral-700 text-neutral-600 cursor-not-allowed bg-neutral-800'
                          : 'border-neutral-500 hover:border-neutral-300 text-neutral-300 hover:text-neutral-100 bg-neutral-700 hover:bg-neutral-600'
                          }`}
                      >
                        ROLL ALL TEAMS
                      </button>
                    </div>

                    <div className="space-y-2">
                      {teams.map(team => (
                        <div key={team.id} className="border border-neutral-700 bg-neutral-750 p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-4 h-4 border border-neutral-500"
                              style={{ backgroundColor: team.color }}
                            />
                            <span className="flex-1 text-sm font-medium text-neutral-200">{team.name}</span>
                            <span className="text-xs text-neutral-400 font-mono">#{team.position}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => rollForTeam(team.id)}
                              disabled={isRolling || movingTeam !== null}
                              className={`flex-1 p-3 md:p-2 text-sm md:text-xs font-mono border transition-all ${movingTeam === team.id
                                ? 'border-yellow-500 text-yellow-300 bg-yellow-900/20'
                                : isRolling || movingTeam !== null
                                  ? 'border-neutral-700 text-neutral-600 cursor-not-allowed'
                                  : 'border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-neutral-100'
                                }`}
                            >
                              {movingTeam === team.id ? 'MOVING...' : isRolling ? 'WAIT' : 'ROLL'}
                            </button>

                            <button
                              onClick={() => updateTeamPosition(team.id, 1)}
                              disabled={isRolling || movingTeam !== null}
                              className={`p-2 text-xs font-mono border transition-all ${isRolling || movingTeam !== null
                                ? 'border-neutral-700 text-neutral-600 cursor-not-allowed'
                                : 'border-neutral-600 hover:border-red-500 text-neutral-400 hover:text-red-300'
                                }`}
                              title="Reset to start"
                            >
                              ↺
                            </button>

                            <button
                              onClick={() => updateTeamPosition(team.id, boardData.length)}
                              disabled={isRolling || movingTeam !== null}
                              className={`p-2 text-xs font-mono border transition-all ${isRolling || movingTeam !== null
                                ? 'border-neutral-700 text-neutral-600 cursor-not-allowed'
                                : 'border-neutral-600 hover:border-green-500 text-neutral-400 hover:text-green-300'
                                }`}
                              title="Move to end"
                            >
                              ↗
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Standings & Analytics */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <h3 className="font-medium text-neutral-100">Standings</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {sortedTeams.map((team, index) => {
                        const progress = (team.position / boardData.length) * 100;
                        const isLeading = index === 0;
                        const currentTile = boardData.find(t => t.id === team.position);

                        return (
                          <div key={team.id} className={`p-3 border ${isLeading ? 'border-yellow-700 bg-yellow-900/10' : 'border-neutral-700 bg-neutral-750'}`}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isLeading ? 'bg-yellow-600 text-neutral-900' : 'bg-neutral-600 text-neutral-300'}`}>
                                {index + 1}
                              </div>
                              <div
                                className="w-4 h-4 border border-neutral-500"
                                style={{ backgroundColor: team.color }}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-neutral-200">{team.name}</div>
                                <div className="text-xs text-neutral-400 font-mono">
                                  {team.position}/{boardData.length} • {Math.round(progress)}%
                                </div>
                              </div>
                              {currentTile?.type && (
                                <div className="text-xs text-neutral-400">
                                  {currentTile.type === 'snake' ? '🐍' :
                                    currentTile.type === 'ladder' ? '🪜' :
                                      currentTile.type === 'fairy_ring' ? '✦' : ''}
                                </div>
                              )}
                            </div>
                            <div className="w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-700 ${isLeading ? 'bg-yellow-500' : 'bg-neutral-500'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Advanced Controls */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <h3 className="font-medium text-neutral-100">Advanced Controls</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {teams.map(team => (
                      <div key={team.id} className="border border-neutral-700 bg-neutral-750 p-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-3 h-3 border border-neutral-500"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-sm font-medium text-neutral-200">{team.name}</span>
                          <span className="ml-auto text-xs font-mono text-neutral-400">{team.position}</span>
                        </div>

                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => updateTeamPosition(team.id, Math.max(1, team.position - 10))}
                            className="px-2 py-1 border border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => updateTeamPosition(team.id, Math.max(1, team.position - 1))}
                            className="px-2 py-1 border border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateTeamPosition(team.id, Math.min(boardData.length, team.position + 1))}
                            className="px-2 py-1 border border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => updateTeamPosition(team.id, Math.min(boardData.length, team.position + 10))}
                            className="px-2 py-1 border border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // PARTICIPANT VIEW
              <>
                {/* Team Tasks */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <h3 className="font-medium text-neutral-100">Current Tasks</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {teams.map(team => {
                      const currentTile = boardData.find(t => t.id === team.position);

                      return (
                        <div key={team.id} className="border border-neutral-700 bg-neutral-750 p-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-3 h-3 border border-neutral-500"
                              style={{ backgroundColor: team.color }}
                            />
                            <div>
                              <div className="text-sm font-medium text-neutral-200">{team.name}</div>
                              <div className="text-xs text-neutral-400 font-mono">TILE {team.position}</div>
                            </div>
                          </div>

                          {currentTile ? (
                            <div className="bg-neutral-700 p-3 text-xs">
                              <div className="font-bold text-neutral-100 mb-1">{currentTile.item}</div>
                              <div className="text-neutral-300 mb-2 leading-tight">{currentTile.task}</div>

                              {currentTile.goesTo && (
                                <div className="text-neutral-400 font-mono">
                                  → TILE {currentTile.goesTo}
                                </div>
                              )}

                              {currentTile.fairyOptions && (
                                <div className="text-neutral-400 font-mono">
                                  → {currentTile.fairyOptions.join(' / ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-neutral-700 p-3 text-center text-xs text-neutral-400">
                              WAITING TO START
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress */}
                <div className="border border-neutral-700 bg-neutral-800">
                  <div className="p-4 border-b border-neutral-700">
                    <h3 className="font-medium text-neutral-100">Progress</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {sortedTeams.map((team, index) => {
                      const progress = (team.position / boardData.length) * 100;

                      return (
                        <div key={team.id}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 text-xs font-mono text-neutral-400">#{index + 1}</div>
                            <div
                              className="w-3 h-3 border border-neutral-500"
                              style={{ backgroundColor: team.color }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-neutral-200">{team.name}</div>
                              <div className="text-xs text-neutral-400 font-mono">
                                {Math.round(progress)}% COMPLETE
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-neutral-700">
                            <div
                              className="h-full bg-neutral-300 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tile Editor Modal */}
        {editingTile && isEditMode && userRole === 'leader' && (
          <div className="fixed inset-0 bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 z-50">
            <div className="bg-neutral-800 border border-orange-600 max-w-lg w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-orange-200">
                      Edit Tile {editingTile.id}
                    </h3>
                    <div className="text-sm text-neutral-400 font-mono">
                      Modify tile properties and connections
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingTile(null)}
                    className="text-neutral-500 hover:text-neutral-200 text-xl font-light transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newType = formData.get('type') as 'normal' | 'snake' | 'ladder' | 'fairy_ring';

                  // Validate snake/ladder destinations are not special tiles
                  let goesTo: number | undefined = undefined;
                  if ((newType === 'snake' || newType === 'ladder') && formData.get('goesTo')) {
                    const destinationId = parseInt(formData.get('goesTo') as string);
                    const destinationTile = boardData.find(t => t.id === destinationId);

                    if (destinationTile && destinationTile.type !== 'normal') {
                      alert(`${newType === 'snake' ? 'Snake' : 'Ladder'} destinations must be normal tiles, not special tiles.`);
                      return;
                    }
                    goesTo = destinationId;
                  }

                  const updatedTile: BoardTile = {
                    ...editingTile,
                    item: formData.get('item') as string,
                    task: newType === 'normal' ? (formData.get('task') as string) : '', // Only normal tiles have tasks
                    type: newType,
                    goesTo,
                    fairyOptions: undefined // Will be set automatically for fairy rings
                  };

                  updateBoardTileWithFairyRingUpdates(updatedTile);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-200 mb-2">Item Name</label>
                      <input
                        name="item"
                        type="text"
                        defaultValue={editingTile.item}
                        className="w-full p-3 bg-neutral-700 border border-neutral-600 text-neutral-200 rounded focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>

                    {editingTile.type === 'normal' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-200 mb-2">Task Description</label>
                        <textarea
                          name="task"
                          defaultValue={editingTile.task}
                          rows={3}
                          className="w-full p-3 bg-neutral-700 border border-neutral-600 text-neutral-200 rounded focus:border-orange-500 focus:outline-none"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-neutral-200 mb-2">Tile Type</label>
                      <select
                        name="type"
                        defaultValue={editingTile.type}
                        className="w-full p-3 bg-neutral-700 border border-neutral-600 text-neutral-200 rounded focus:border-orange-500 focus:outline-none"
                      >
                        <option value="normal">Normal</option>
                        <option value="snake">Snake (moves down)</option>
                        <option value="ladder">Ladder (moves up)</option>
                        <option value="fairy_ring">Fairy Ring (random teleport)</option>
                      </select>
                    </div>

                    {(editingTile.type === 'snake' || editingTile.type === 'ladder') && (
                      <div className="p-3 bg-blue-900/20 border border-blue-600 rounded">
                        <div className="text-sm text-blue-200 mb-2">
                          {editingTile.type === 'snake' ? '🐍 Snake' : '🪜 Ladder'} Connection
                        </div>
                        {editingTile.goesTo ? (
                          <div className="text-xs text-neutral-300">
                            Currently connects to tile #{editingTile.goesTo}
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-400 italic">
                            No destination set yet
                          </div>
                        )}
                        <div className="text-xs text-blue-300 mt-2">
                          💡 Close this dialog and click the {editingTile.type === 'snake' ? 'snake' : 'ladder'} tile to set its destination visually
                        </div>
                      </div>
                    )}

                    {editingTile.type === 'fairy_ring' && (() => {
                      const otherFairyRings = boardData.filter(tile =>
                        tile.type === 'fairy_ring' && tile.id !== editingTile.id
                      );

                      return (
                        <div>
                          <label className="block text-sm font-medium text-neutral-200 mb-2">
                            Fairy Ring Auto-Targeting
                          </label>
                          <div className="p-3 bg-violet-900/20 border border-violet-600 rounded">
                            <div className="text-sm text-violet-200 mb-2">
                              ✦ This fairy ring will automatically target all other fairy rings:
                            </div>
                            {otherFairyRings.length > 0 ? (
                              <div className="space-y-1">
                                {otherFairyRings.map(ring => (
                                  <div key={ring.id} className="text-xs text-neutral-300">
                                    #{ring.id} - {ring.item}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-neutral-400 italic">
                                No other fairy rings found. Create more fairy rings to enable teleportation.
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">
                            Fairy rings automatically connect to each other for balanced gameplay
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex gap-3 pt-4 border-t border-neutral-700">
                      <button
                        type="submit"
                        className="flex-1 p-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete tile ${editingTile.id}?\n\nThis will renumber all tiles sequentially and update all connections automatically.`)) {
                            deleteTile(editingTile.id);
                            setEditingTile(null);
                          }
                        }}
                        className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tile Detail Modal */}
        {selectedTile && !isEditMode && (
          <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 z-50">
            <div className="bg-neutral-800 border border-neutral-600 max-w-lg w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-100">
                      Tile {selectedTile.id}
                    </h3>
                    <div className="text-sm text-neutral-400 font-mono uppercase tracking-wider">
                      {selectedTile.type?.replace('_', ' ') || 'Standard'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTile(null)}
                    className="text-neutral-500 hover:text-neutral-200 text-xl font-light transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-base font-bold text-neutral-100 mb-2">
                    {selectedTile.item}
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">
                    {selectedTile.task}
                  </p>
                </div>

                {selectedTile.goesTo && (
                  <div className="mb-4 p-4 bg-neutral-700 border-l-4 border-neutral-300">
                    <div className="text-sm font-medium text-neutral-100 mb-1">
                      {selectedTile.type === 'snake' ? 'Snake Effect' : 'Ladder Effect'}
                    </div>
                    <div className="text-sm text-neutral-400 font-mono">
                      Moves to Tile {selectedTile.goesTo}
                    </div>
                  </div>
                )}

                {selectedTile.fairyOptions && (
                  <div className="mb-4 p-4 bg-neutral-700 border-l-4 border-neutral-300">
                    <div className="text-sm font-medium text-neutral-100 mb-1">
                      Fairy Ring Teleport
                    </div>
                    <div className="text-sm text-neutral-400 font-mono">
                      Randomly teleports to: {selectedTile.fairyOptions.join(', ')}
                    </div>
                  </div>
                )}

                {/* Teams on this tile */}
                {(() => {
                  const teamsHere = teams.filter(team => team.position === selectedTile.id);
                  if (teamsHere.length === 0) return null;

                  return (
                    <div className="mt-6 pt-4 border-t border-neutral-700">
                      <div className="text-sm font-medium text-neutral-100 mb-3">
                        Teams on this tile
                      </div>
                      <div className="space-y-2">
                        {teamsHere.map(team => (
                          <div key={team.id} className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 border border-neutral-500"
                              style={{ backgroundColor: team.color }}
                            />
                            <span className="text-sm text-neutral-200">{team.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Custom Tooltip */}
        {hoveredTile && (
          <div
            className="fixed pointer-events-none bg-neutral-900 border border-neutral-600 text-neutral-200 text-xs md:text-sm p-3 rounded shadow-lg max-w-xs md:max-w-sm z-50"
            style={{
              left: typeof window !== 'undefined' ? Math.min(
                hoveredTile.x + 10,
                window.innerWidth - 280 // tooltip width + margin
              ) : hoveredTile.x + 10,
              top: typeof window !== 'undefined' ? Math.max(
                10,
                Math.min(
                  hoveredTile.y + 10,
                  window.innerHeight - 200 // estimated tooltip height + margin
                )
              ) : hoveredTile.y + 10,
            }}
          >
            <div className="whitespace-pre-line font-mono text-xs md:text-sm">
              {getTileHoverInfo(hoveredTile.tile, hoveredTile.teams)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
