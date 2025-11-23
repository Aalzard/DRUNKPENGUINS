
import React from 'react';
import { Game, User } from '../types';
import { USERS, CATEGORIES } from '../constants';
import { X, MessageSquareQuote, Ghost } from 'lucide-react';

interface SquadReviewsModalProps {
  game: Game;
  onClose: () => void;
}

export const SquadReviewsModal: React.FC<SquadReviewsModalProps> = ({ game, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl w-full max-w-4xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              SQUAD VERDICT
            </h2>
            <p className="text-slate-400 text-sm mt-1">Detailed breakdown for <span className="text-white font-bold">{game.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {USERS.map((user) => {
            const rating = game.ratings[user.id];
            
            if (!rating) {
              return (
                <div key={user.id} className="bg-slate-900/40 rounded-xl p-6 border border-slate-800/50 opacity-50 flex items-center gap-4 grayscale">
                   <div className={`w-12 h-12 rounded-full ${user.avatarColor} flex items-center justify-center`}>
                      <span className="font-bold text-black text-xl">{user.name[0]}</span>
                   </div>
                   <div className="flex-1">
                      <h3 className="text-xl font-gaming text-slate-500">{user.name}</h3>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Ghost size={14} /> Has not rated this game yet.
                      </p>
                   </div>
                </div>
              );
            }

            return (
              <div key={user.id} className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-lg">
                {/* User Header */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${user.avatarColor} shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center`}>
                      <span className="font-bold text-slate-900 text-xl">{user.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-gaming text-white tracking-wide">{user.name}</h3>
                      <div className="text-xs text-slate-400 uppercase tracking-widest">Critic</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 uppercase font-bold mb-1">Total Score</span>
                    <div className="text-4xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-lg">
                      {rating.totalScore}<span className="text-xl text-slate-600">/10</span>
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => {
                    const catRating = rating.ratings[cat];
                    const score = catRating?.score || 0;
                    const comment = catRating?.comment || '';

                    return (
                      <div key={cat} className="bg-black/20 p-3 rounded border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-purple-300 uppercase">{cat}</span>
                          <span className={`text-sm font-gaming px-2 py-0.5 rounded ${
                            score === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 
                            score === 1 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {score}/2
                          </span>
                        </div>
                        
                        {comment ? (
                          <div className="flex gap-2 items-start mt-2">
                            <MessageSquareQuote size={14} className="text-slate-500 mt-1 shrink-0" />
                            <p className="text-sm text-slate-300 italic leading-snug">"{comment}"</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600 italic mt-2">No comment provided.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
