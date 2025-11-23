import React, { useState, useEffect } from 'react';
import { Game, User, RatingCategory, UserRating, CategoryRating } from '../types';
import { CATEGORIES } from '../constants';
import { Button } from './Button';
import { X, Check, Star } from 'lucide-react';

interface RatingModalProps {
  game: Game;
  currentUser: User;
  existingRating: UserRating | null;
  onClose: () => void;
  onSave: (gameId: string, rating: UserRating) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  game, 
  currentUser, 
  existingRating, 
  onClose, 
  onSave 
}) => {
  const [ratings, setRatings] = useState<Record<RatingCategory, CategoryRating>>(() => {
    if (existingRating) return existingRating.ratings;
    // Default initialization
    const initial: any = {};
    CATEGORIES.forEach(cat => {
      initial[cat] = { score: 0, comment: '' };
    });
    return initial;
  });

  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    let sum = 0;
    (Object.values(ratings) as CategoryRating[]).forEach(r => sum += r.score);
    setTotalScore(sum);
  }, [ratings]);

  const handleScoreChange = (category: RatingCategory, score: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: { ...prev[category], score }
    }));
  };

  const handleCommentChange = (category: RatingCategory, comment: string) => {
    setRatings(prev => ({
      ...prev,
      [category]: { ...prev[category], comment }
    }));
  };

  const handleSave = () => {
    const userRating: UserRating = {
      userId: currentUser.id,
      ratings,
      totalScore,
      timestamp: Date.now()
    };
    onSave(game.id, userRating);
  };

  const ScoreButton = ({ cat, val, currentVal }: { cat: RatingCategory, val: number, currentVal: number }) => (
    <button
      onClick={() => handleScoreChange(cat, val)}
      className={`w-10 h-10 rounded-md font-bold font-gaming transition-all border ${
        currentVal === val 
          ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]' 
          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
      }`}
    >
      {val}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/50 rounded-xl w-full max-w-2xl shadow-[0_0_50px_rgba(139,92,246,0.2)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-gaming text-white">Rate: <span className="text-cyan-400">{game.name}</span></h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className={`w-3 h-3 rounded-full ${currentUser.avatarColor}`}></div>
              Playing as {currentUser.name}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <label className="text-lg font-bold text-purple-300 uppercase tracking-wider w-32">
                  {cat}
                </label>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 uppercase mr-2">Score (0-2)</span>
                  <ScoreButton cat={cat} val={0} currentVal={ratings[cat].score} />
                  <ScoreButton cat={cat} val={1} currentVal={ratings[cat].score} />
                  <ScoreButton cat={cat} val={2} currentVal={ratings[cat].score} />
                </div>
              </div>

              <textarea
                placeholder={`Your thoughts on ${cat}...`}
                value={ratings[cat].comment}
                onChange={(e) => handleCommentChange(cat, e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                rows={2}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/90 sticky bottom-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 uppercase text-sm font-bold">Total Score</span>
            <div className="text-4xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              {totalScore}<span className="text-xl text-slate-600">/10</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" /> Save Review
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};