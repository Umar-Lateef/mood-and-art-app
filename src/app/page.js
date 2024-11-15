"use client";

import { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCw, Timer } from 'lucide-react';

export default function ColorMatch() {
  const [tiles, setTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chain, setChain] = useState(0);

  const colors = {
    red: 'bg-gradient-to-br from-red-400 to-rose-600',
    blue: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    green: 'bg-gradient-to-br from-green-400 to-emerald-600',
    purple: 'bg-gradient-to-br from-purple-400 to-violet-600',
    yellow: 'bg-gradient-to-br from-yellow-400 to-amber-600',
  };

  const startGame = () => {
    const colorKeys = Object.keys(colors);
    const initialTiles = Array(24).fill(null).map((_, index) => ({
      id: index,
      color: colorKeys[Math.floor(index / 5)],
      isMatched: false,
      isSelected: false,
      isRevealed: false,
    }));

    // Shuffle tiles
    const shuffled = [...initialTiles].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setChain(0);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleTileClick = (tile) => {
    if (!isPlaying || tile.isMatched) return;

    const newTiles = [...tiles];
    const clickedTile = newTiles[tile.id];

    if (selectedTile === null) {
      // First tile selection
      clickedTile.isSelected = true;
      setSelectedTile(clickedTile);
    } else if (selectedTile.id !== clickedTile.id) {
      // Second tile selection
      clickedTile.isSelected = true;

      if (selectedTile.color === clickedTile.color) {
        // Match found
        selectedTile.isMatched = true;
        clickedTile.isMatched = true;
        setChain(prev => prev + 1);
        setScore(prev => prev + (100 * chain));
      } else {
        // No match
        setTimeout(() => {
          newTiles[selectedTile.id].isSelected = false;
          newTiles[clickedTile.id].isSelected = false;
          setTiles([...newTiles]);
        }, 1000);
        setChain(0);
      }
      setSelectedTile(null);
    }

    setTiles(newTiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-white/80" />
            <span className="text-xl font-semibold text-white/80">{timeLeft}s</span>
          </div>
          <button
            onClick={startGame}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg 
                     transition-all flex items-center gap-2 hover:scale-105"
          >
            <RotateCw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {tiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className={`aspect-square rounded-xl transition-all transform 
                ${tile.isMatched ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                ${tile.isSelected ? 'ring-4 ring-white scale-95' : 'hover:scale-105'}
                ${colors[tile.color]}
                shadow-lg hover:shadow-xl`}
            >
              {tile.isMatched && (
                <Sparkles className="w-6 h-6 text-white animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Chain Multiplier */}
        {chain > 1 && (
          <div className="fixed top-10 right-10 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2
                         text-white font-bold animate-bounce">
            {chain}x Chain!
          </div>
        )}

        {/* Start/End Screen */}
        {!isPlaying && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Color Match
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Match colors to score points. Chain matches for bonus points!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
                         px-8 py-4 rounded-xl text-xl font-bold
                         hover:scale-105 active:scale-95 transition-transform
                         shadow-lg hover:shadow-xl"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}