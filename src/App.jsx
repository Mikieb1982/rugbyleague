import { useState, useEffect } from 'react';
import { Home, Calendar, Trophy, MapPin, User, Plus, Share2, CheckCircle } from 'lucide-react';
import { db, auth } from './firebase-config';
import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Mock data - replace with Firebase data later
const MOCK_MATCHES = [
  { id: 1, homeTeam: 'Wigan Warriors', awayTeam: 'St Helens', date: '2025-10-20', venue: 'DW Stadium', homeScore: 24, awayScore: 18, competition: 'Super League', attended: true },
  { id: 2, homeTeam: 'Leeds Rhinos', awayTeam: 'Hull FC', date: '2025-10-21', venue: 'Headingley Stadium', homeScore: 30, awayScore: 22, competition: 'Super League', attended: true },
  { id: 3, homeTeam: 'Warrington Wolves', awayTeam: 'Catalans Dragons', date: '2025-10-25', venue: 'Halliwell Jones Stadium', homeScore: null, awayScore: null, competition: 'Super League', attended: false },
];

const TEAMS = [
  'Wigan Warriors', 'St Helens', 'Leeds Rhinos', 'Hull FC', 'Warrington Wolves',
  'Catalans Dragons', 'Salford Red Devils', 'Castleford Tigers', 'Huddersfield Giants',
  'Hull KR', 'Wakefield Trinity', 'London Broncos'
];

const BADGES = [
  { id: 'first_match', name: 'First Match', description: 'Attend your first match', icon: '🏉', rarity: 'common', unlocked: true },
  { id: 'ten_matches', name: 'Dedicated Fan', description: 'Attend 10 matches', icon: '🔥', rarity: 'rare', unlocked: false, progress: 2, target: 10 },
  { id: 'fifty_matches', name: 'Super Fan', description: 'Attend 50 matches', icon: '⭐', rarity: 'epic', unlocked: false, progress: 2, target: 50 },
  { id: 'all_teams', name: 'League Explorer', description: 'Watch all Super League teams', icon: '🗺️', rarity: 'legendary', unlocked: false, progress: 3, target: 12 },
  { id: 'hat_trick', name: 'Hat Trick', description: 'Attend 3 matches in a week', icon: '🎩', rarity: 'rare', unlocked: false },
  { id: 'derby', name: 'Derby Day', description: 'Attend a local derby', icon: '⚔️', rarity: 'epic', unlocked: true },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [userStats, setUserStats] = useState({
    totalMatches: 2,
    currentStreak: 2,
    favoriteTeam: 'Wigan Warriors',
    badgesUnlocked: 2
  });

  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Test Firebase connection
  useEffect(() => {
    try {
      console.log('🔥 Firebase initialized!');
      console.log('Project ID:', db?.app?.options?.projectId ?? '(unknown)');
    } catch {
      // ignore
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
            <span className="text-5xl">🏉</span>
          </div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <span className="text-5xl">🏉</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              The Turnstile
            </h1>
            <p className="text-white/70">Track your rugby league journey</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl border border-white/10">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-lg'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-lg'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                {authMode === 'signup' && (
                  <p className="text-xs text-white/50 mt-1">At least 6 characters</p>
                )}
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-sm text-red-200">
                  {authError.replace('Firebase:', '').replace(/\(auth.*\)/, '')}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  const DashboardScreen = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-white/70">Track your rugby league journey</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 shadow-xl">
            <div className="text-4xl font-bold mb-2">{userStats.totalMatches}</div>
            <div className="text-white/90 text-sm">Matches Attended</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl">
            <div className="text-4xl font-bold mb-2">{userStats.currentStreak}</div>
            <div className="text-white/90 text-sm">Current Streak</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl">
            <div className="text-4xl font-bold mb-2">{userStats.badgesUnlocked}</div>
            <div className="text-white/90 text-sm">Badges Earned</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <Trophy size={24} />
              <div className="text-sm">Favorite Team</div>
            </div>
            <div className="text-lg font-bold mt-2">{userStats.favoriteTeam}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-cyan-400" />
            Recent Matches
          </h3>
          <div className="space-y-3">
            {matches.filter(m => m.attended).slice(0, 3).map(match => (
              <div key={match.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold">{match.homeTeam} vs {match.awayTeam}</div>
                    <div className="text-sm text-white/60">{match.venue}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-cyan-400">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="text-xs text-white/60">{match.date}</div>
                  </div>
                </div>
                <div className="text-xs text-cyan-400">{match.competition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fixtures Screen
  const FixturesScreen = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Upcoming Fixtures</h2>

        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-400/20 px-3 py-1 rounded-full">
                  {match.competition}
                </span>
                <span className="text-sm text-white/60">{match.date}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.homeTeam}</div>
                </div>
                <div className="px-4">
                  {match.homeScore !== null ? (
                    <div className="text-2xl font-bold">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  ) : (
                    <div className="text-white/40 text-sm">vs</div>
                  )}
                </div>
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.awayTeam}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                <MapPin size={16} />
                {match.venue}
              </div>

              {match.attended && (
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-green-400 bg-green-400/20 px-3 py-1 rounded-full">
                    <CheckCircle size={16} />
                    Attended
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Log Match Screen
  const LogMatchScreen = () => {
    const [formData, setFormData] = useState({
      homeTeam: '',
      awayTeam: '',
      homeScore: '',
      awayScore: '',
      venue: '',
      date: new Date().toISOString().split('T')[0],
      competition: 'Super League',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      if (formData.homeTeam === formData.awayTeam) {
        alert('Home and away teams must be different.');
        return;
      }

      const newMatch = {
        id: Date.now(),
        ...formData,
        homeScore: parseInt(formData.homeScore, 10),
        awayScore: parseInt(formData.awayScore, 10),
        attended: true
      };

      setMatches((prev) => [...prev, newMatch]);
      setUserStats((prev) => ({
        ...prev,
        totalMatches: prev.totalMatches + 1,
        currentStreak: prev.currentStreak + 1
      }));

      alert('Match logged successfully! 🏉');

      setFormData({
        homeTeam: '',
        awayTeam: '',
        homeScore: '',
        awayScore: '',
        venue: '',
        date: new Date().toISOString().split('T')[0],
        competition: 'Super League',
        notes: ''
      });
    };

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Log Match</h2>

        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Home Team</label>
              <select
                value={formData.homeTeam}
                onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              >
                <option value="">Select team</option>
                {TEAMS.map(team => (
                  <option key={team} value={team} className="bg-slate-800">{team}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Away Team</label>
              <select
                value={formData.awayTeam}
                onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              >
                <option value="">Select team</option>
                {TEAMS.map(team => (
                  <option key={team} value={team} className="bg-slate-800">{team}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Home Score</label>
              <input
                type="number"
                min={0}
                step={1}
                value={formData.homeScore}
                onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Away Score</label>
              <input
                type="number"
                min={0}
                step={1}
                value={formData.awayScore}
                onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Stadium name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Competition</label>
              <select
                value={formData.competition}
                onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="Super League" className="bg-slate-800">Super League</option>
                <option value="Challenge Cup" className="bg-slate-800">Challenge Cup</option>
                <option value="Championship" className="bg-slate-800">Championship</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[100px]"
              placeholder="Match highlights, atmosphere, etc."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            Log Match
          </button>
        </form>
      </div>
    );
  };

  // Badges Screen
  const BadgesScreen = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Achievements</h2>

        <div className="grid grid-cols-2 gap-4">
          {BADGES.map(badge => (
            <div
              key={badge.id}
              className={`rounded-2xl p-6 shadow-xl text-center transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  : 'bg-gradient-to-br from-slate-800 to-slate-900 opacity-60'
              }`}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <div className="font-bold mb-2">{badge.name}</div>
              <div className="text-sm text-white/80 mb-3">{badge.description}</div>

              <div className={`text-xs px-3 py-1 rounded-full inline-block font-bold mb-3 ${
                badge.rarity === 'legendary' ? 'bg-amber-400 text-amber-900' :
                badge.rarity === 'epic' ? 'bg-purple-400 text-purple-900' :
                badge.rarity === 'rare' ? 'bg-blue-400 text-blue-900' :
                'bg-gray-400 text-gray-900'
              }`}>
                {badge.rarity.toUpperCase()}
              </div>

              {badge.unlocked ? (
                <div className="bg-white/20 rounded-full py-2 px-4 inline-block backdrop-blur shadow-lg font-bold text-sm">
                  ✓ Unlocked
                </div>
              ) : badge.progress !== undefined ? (
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                  <div
                    className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                  />
                  <p className="text-xs text-white/70 mt-2">
                    {badge.progress} / {badge.target}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-white/50 mt-3">
                  Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Settings Screen
  const SettingsScreen = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Settings</h2>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Email</label>
              <div className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <button className="w-12 h-6 bg-cyan-500 rounded-full relative" aria-label="Toggle push notifications">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Match Reminders</span>
              <button className="w-12 h-6 bg-white/20 rounded-full relative" aria-label="Toggle match reminders">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
        >
          Sign Out
        </button>
      </div>
    );
  };

  // Main App
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏉</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              The Turnstile
            </h1>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Share">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {activeTab === 'home' && <DashboardScreen />}
        {activeTab === 'fixtures' && <FixturesScreen />}
        {activeTab === 'log' && <LogMatchScreen />}
        {activeTab === 'badges' && <BadgesScreen />}
        {activeTab === 'profile' && <SettingsScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'fixtures', icon: Calendar, label: 'Fixtures' },
              { id: 'log', icon: Plus, label: 'Log Match' },
              { id: 'badges', icon: Trophy, label: 'Badges' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === id ? 'text-cyan-400' : 'text-white/60 hover:text-white/80'
                }`}
                aria-label={label}
              >
                <Icon size={24} className={activeTab === id ? 'transform scale-110' : ''} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {activeTab !== 'log' && (
        <button
          aria-label="Log a match"
          onClick={() => setActiveTab('log')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  );
}

export default App;
