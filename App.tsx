import React, { useState, useEffect } from 'react';
import { Game, User, UserRating } from './types';
import { USERS, INITIAL_GAMES_DATA_KEY } from './constants';
import { RatingModal } from './components/RatingModal';
import { SquadReviewsModal } from './components/SquadReviewsModal';
import { Button } from './components/Button';
import { Plus, Users, Gamepad2, Star, UsersRound } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [games, setGames] = useState<Game[]>([]);
  
  // Modals
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isSquadReviewOpen, setIsSquadReviewOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  // Add Game Inputs
  const [newGameName, setNewGameName] = useState('');
  const [newGameImage, setNewGameImage] = useState('');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [isAddingGame, setIsAddingGame] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem(INITIAL_GAMES_DATA_KEY);
    if (stored) {
      setGames(JSON.parse(stored));
    } else {
      // Seed some data if empty
      const seed: Game[] = [
        {
          id: '1',
          name: 'Cyberpunk 2077',
          imageUrl: 'https://picsum.photos/400/600',
          description: 'A futuristic open world RPG set in Night City.',
          ratings: {},
        }
      ];
      setGames(seed);
      localStorage.setItem(INITIAL_GAMES_DATA_KEY, JSON.stringify(seed));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem(INITIAL_GAMES_DATA_KEY, JSON.stringify(games));
    }
  }, [games]);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName) return;
    setIsAddingGame(true);

    // Simulate network delay for "Online" feel
    await new Promise(resolve => setTimeout(resolve, 600));

    const newGame: Game = {
      id: Date.now().toString(),
      name: newGameName,
      imageUrl: newGameImage || `https://picsum.photos/400/600?random=${Date.now()}`,
      description: newGameDesc || 'No description provided.',
      ratings: {}
    };

    setGames(prev => [newGame, ...prev]);
    setNewGameName('');
    setNewGameImage('');
    setNewGameDesc('');
    setIsAddGameModalOpen(false);
    setIsAddingGame(false);
  };

  const handleSaveRating = (gameId: string, rating: UserRating) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          ratings: {
            ...g.ratings,
            [rating.userId]: rating
          }
        };
      }
      return g;
    }));
    setIsRatingModalOpen(false);
  };

  const getAverageScore = (game: Game) => {
    const ratings = Object.values(game.ratings);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.totalScore, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const selectedGame = games.find(g => g.id === selectedGameId);

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-200 font-body selection:bg-purple-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-cyan-900/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-cyan-400 w-8 h-8" />
            <h1 className="text-2xl font-gaming font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              DRUNKPENGUINS
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
              <Users size={16} className="text-slate-400" />
              <span className="text-xs text-slate-500 mr-1 uppercase">User:</span>
              <select 
                value={currentUser.id}
                onChange={(e) => setCurrentUser(USERS.find(u => u.id === e.target.value) || USERS[0])}
                className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-cyan-400 font-bold uppercase tracking-wider"
              >
                {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            
            <Button onClick={() => setIsAddGameModalOpen(true)}>
              <Plus className="w-5 h-5 mr-1" /> Add Game
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Mobile User Selector */}
        <div className="md:hidden mb-6 flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
          <span className="text-sm text-slate-400 uppercase tracking-wide font-bold">Current Player</span>
          <select 
            value={currentUser.id}
            onChange={(e) => setCurrentUser(USERS.find(u => u.id === e.target.value) || USERS[0])}
            className="bg-slate-800 border-none rounded text-sm font-bold text-cyan-400 focus:ring-0 py-1 px-3"
          >
            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center hover:border-cyan-500/30 transition-colors">
            <span className="text-4xl font-gaming text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{games.length}</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Games Tracked</span>
          </div>
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center hover:border-purple-500/30 transition-colors">
             <span className="text-4xl font-gaming text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
               {games.reduce((acc, g) => acc + Object.keys(g.ratings).length, 0)}
             </span>
             <span className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Total Reviews</span>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map(game => {
            const avgScore = Number(getAverageScore(game));
            const userHasRated = !!game.ratings[currentUser.id];
            const ratingsCount = Object.keys(game.ratings).length;
            
            return (
              <div key={game.id} className="group relative bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col">
                
                {/* Image Cover */}
                <div className="h-56 overflow-hidden relative bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10"></div>
                  <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  
                  {avgScore > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-yellow-500/30 flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-gaming font-bold text-white">{avgScore}</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-gaming font-bold text-white mb-2 truncate tracking-wide">{game.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 h-10 leading-relaxed">{game.description}</p>

                  {/* Rating Progress Bars (Aggregate) */}
                  <div className="space-y-3 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Squad Progress</span>
                      <span className={ratingsCount === 4 ? "text-cyan-400" : ""}>{ratingsCount} / 4</span>
                    </div>
                    <div className="flex gap-1.5 h-2.5">
                       {USERS.map(u => (
                         <div 
                           key={u.id} 
                           className={`flex-1 rounded-sm transition-all duration-500 ${game.ratings[u.id] ? u.avatarColor + ' shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'bg-slate-800'}`}
                           title={game.ratings[u.id] ? `${u.name} rated` : 'Pending'}
                         />
                       ))}
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary"
                      className="w-full text-xs md:text-sm"
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsSquadReviewOpen(true);
                      }}
                    >
                      <UsersRound className="w-4 h-4 mr-2" />
                      Reviews
                    </Button>

                    <Button 
                      variant={userHasRated ? "ghost" : "primary"} 
                      className={`w-full text-xs md:text-sm ${userHasRated ? 'border-dashed border-slate-700' : ''}`}
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsRatingModalOpen(true);
                      }}
                    >
                      {userHasRated ? "Edit My Rating" : "Rate Game"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Game Modal */}
      {isAddGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-2xl font-gaming text-white mb-6">Add New Game</h2>
            <form onSubmit={handleAddGame} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Game Name</label>
                <input 
                  type="text" 
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Elden Ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={newGameImage}
                  onChange={(e) => setNewGameImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Description</label>
                <textarea 
                  value={newGameDesc}
                  onChange={(e) => setNewGameDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all min-h-[100px]"
                  placeholder="What is this game about?"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsAddGameModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isAddingGame}>Add Game</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal (Input) */}
      {isRatingModalOpen && selectedGame && (
        <RatingModal 
          game={selectedGame}
          currentUser={currentUser}
          existingRating={selectedGame.ratings[currentUser.id] || null}
          onClose={() => setIsRatingModalOpen(false)}
          onSave={handleSaveRating}
        />
      )}

      {/* Squad Reviews Modal (View Details) */}
      {isSquadReviewOpen && selectedGame && (
        <SquadReviewsModal 
          game={selectedGame}
          onClose={() => setIsSquadReviewOpen(false)}
        />
      )}
    </div>
  );
}