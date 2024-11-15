"use client";

import { useState, useEffect, useRef } from 'react';
import { Smile, Palette, Heart, RotateCw } from 'lucide-react';

export default function MoodArtApp() {
  const [currentMode, setCurrentMode] = useState('mood');
  
  // Mood Tracker State
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodCount, setMoodCount] = useState(0);
  
  // Art Canvas State
  const [isDrawing, setIsDrawing] = useState(false);
  const [particles, setParticles] = useState([]);
  const [hue, setHue] = useState(0);
  
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  
  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
    { emoji: '😍', label: 'Love', color: 'bg-red-400' },
    { emoji: '😌', label: 'Calm', color: 'bg-blue-400' },
    { emoji: '😤', label: 'Angry', color: 'bg-orange-500' },
    { emoji: '😢', label: 'Sad', color: 'bg-indigo-400' },
    { emoji: '😴', label: 'Tired', color: 'bg-purple-400' },
  ];

  useEffect(() => {
    if (currentMode === 'art') {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctxRef.current = canvas.getContext('2d');
    }
  }, [currentMode]);

  // Mood Functions
  const addMood = (mood) => {
    const newMood = {
      id: Date.now(),
      ...mood,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMoodHistory(prev => [newMood, ...prev]);
    setMoodCount(prev => prev + 1);
  };

  // Art Functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const ctx = ctxRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    createParticle(x, y);
    setHue(prev => (prev + 1) % 360);
  };

  const createParticle = (x, y) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 10 + 5,
      color: `hsl(${hue}, 100%, 50%)`,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
      life: 1,
    };

    setParticles(prev => [...prev, newParticle]);
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    if (currentMode === 'art') {
      const interval = setInterval(() => {
        clearCanvas();
        setParticles(prev => 
          prev
            .map(particle => ({
              ...particle,
              x: particle.x + particle.speedX,
              y: particle.y + particle.speedY,
              life: particle.life - 0.02,
              size: particle.size * 0.95,
            }))
            .filter(particle => particle.life > 0)
        );
      }, 16);

      return () => clearInterval(interval);
    }
  }, [currentMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Mode Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1 z-10">
        <button
          onClick={() => setCurrentMode('mood')}
          className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all
                     ${currentMode === 'mood' ? 
                     'bg-white text-gray-900' : 
                     'text-white hover:bg-white/10'}`}
        >
          <Smile className="w-5 h-5" />
          Mood
        </button>
        <button
          onClick={() => setCurrentMode('art')}
          className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all
                     ${currentMode === 'art' ? 
                     'bg-white text-gray-900' : 
                     'text-white hover:bg-white/10'}`}
        >
          <Palette className="w-5 h-5" />
          Art
        </button>
      </div>

      {/* Mood Tracker */}
      {currentMode === 'mood' && (
        <div className="max-w-md mx-auto pt-20 px-4">
          {/* Mood Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {moods.map(mood => (
              <button
                key={mood.label}
                onClick={() => addMood(mood)}
                className={`${mood.color} rounded-xl p-4 aspect-square flex flex-col items-center 
                           justify-center gap-2 transition-transform hover:scale-105 active:scale-95`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-sm font-medium text-white/90">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Mood History */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Mood History</h2>
              <div className="flex items-center gap-2 text-white/80">
                <Heart className="w-4 h-4" />
                {moodCount} moods tracked
              </div>
            </div>
            <div className="space-y-3">
              {moodHistory.map(mood => (
                <div
                  key={mood.id}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3 
                           animate-fadeIn"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{mood.label}</div>
                    <div className="text-xs text-white/60">{mood.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Art Canvas */}
      {currentMode === 'art' && (
        <div className="fixed inset-0">
          <canvas
            ref={canvasRef}
            className="touch-none"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              startDrawing({
                clientX: touch.clientX,
                clientY: touch.clientY,
              });
            }}
            onTouchEnd={stopDrawing}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              draw({
                clientX: touch.clientX,
                clientY: touch.clientY,
              });
            }}
          />
          {/* Art Controls */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md 
                        rounded-full px-4 py-2 flex items-center gap-4">
            <button
              onClick={() => {
                const ctx = ctxRef.current;
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }}
              className="text-white hover:text-white/80 transition-colors"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}