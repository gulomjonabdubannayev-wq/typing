import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getRandomText, type Category, type Difficulty } from './data/texts';

type GameState = 'idle' | 'playing' | 'finished';
type Theme = 'dark' | 'light';
type View = 'test' | 'leaderboard' | 'settings';

interface LeaderboardEntry {
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
  difficulty: Difficulty;
  duration: number;
}

interface TestStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  errors: number;
  duration: number;
}

const DURATIONS = [15, 30, 60, 120];
const CATEGORIES: { value: Category | 'random'; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'general', label: 'General' },
  { value: 'technology', label: 'Technology' },
  { value: 'programming', label: 'Programming' },
  { value: 'business', label: 'Business' },
  { value: 'science', label: 'Science' },
];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('typeflow-theme') as Theme) || 'dark';
  });
  const [view, setView] = useState<View>('test');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [text, setText] = useState('');
  const [typed, setTyped] = useState('');
  const [duration, setDuration] = useState(() => {
    return parseInt(localStorage.getItem('typeflow-duration') || '30');
  });
  const [timeLeft, setTimeLeft] = useState(duration);
  const [category, setCategory] = useState<Category | 'random'>(() => {
    return (localStorage.getItem('typeflow-category') as Category | 'random') || 'random';
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    return (localStorage.getItem('typeflow-difficulty') as Difficulty) || 'medium';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('typeflow-sound') === 'true';
  });
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('typeflow-fontsize') || '22');
  });
  const [stats, setStats] = useState<TestStats | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('typeflow-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Theme
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('typeflow-theme', theme);
  }, [theme]);

  // Save settings
  useEffect(() => { localStorage.setItem('typeflow-duration', String(duration)); }, [duration]);
  useEffect(() => { localStorage.setItem('typeflow-category', category); }, [category]);
  useEffect(() => { localStorage.setItem('typeflow-difficulty', difficulty); }, [difficulty]);
  useEffect(() => { localStorage.setItem('typeflow-sound', String(soundEnabled)); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem('typeflow-fontsize', String(fontSize)); }, [fontSize]);

  // Generate text
  const generateText = useCallback(() => {
    return getRandomText(category, difficulty);
  }, [category, difficulty]);

  // Initialize
  useEffect(() => {
    setText(generateText());
  }, [generateText]);

  // Sound
  const playKeySound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = 'sine';
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, [soundEnabled]);

  const playErrorSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = 'square';
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [soundEnabled]);

  // Refs for current values (to avoid stale closures)
  const typedRef = useRef('');
  const textRef = useRef('');
  const durationRef = useRef(duration);
  typedRef.current = typed;
  textRef.current = text;
  durationRef.current = duration;

  const finishTest = useCallback(() => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const currentTyped = typedRef.current;
    const currentText = textRef.current;
    const currentDuration = durationRef.current;
    
    // Calculate elapsed time
    let elapsed: number;
    if (startTimeRef.current) {
      elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      elapsed = Math.min(elapsed, currentDuration);
    } else {
      elapsed = currentDuration;
    }
    
    const correctChars = currentTyped.split('').filter((c, i) => c === currentText[i]).length;
    const incorrectChars = currentTyped.length - correctChars;
    const errors = incorrectChars;
    const minutes = elapsed / 60 || 1/60;
    const words = correctChars / 5;
    const wpm = Math.round(words / minutes);
    const accuracy = currentTyped.length > 0 ? Math.round((correctChars / currentTyped.length) * 100) : 0;

    setStats({
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars: currentTyped.length,
      errors,
      duration: elapsed,
    });
    setShowUsernameModal(true);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimeout(() => finishTest(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle input
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (gameState === 'finished') return;
    
    if (gameState === 'idle') {
      setGameState('playing');
      startTimeRef.current = Date.now();
      setTimeLeft(duration);
    }

    if (value.length > text.length) return;
    setTyped(value);
    playKeySound();

    // Check if last char was wrong
    if (value.length > 0 && value[value.length - 1] !== text[value.length - 1]) {
      playErrorSound();
    }

    // Check completion
    if (value.length === text.length) {
      finishTest();
    }
  }, [gameState, text, duration, playKeySound, playErrorSound, finishTest]);

  // Reset
  const resetTest = useCallback(() => {
    setGameState('idle');
    setTyped('');
    setTimeLeft(duration);
    setStats(null);
    setShowUsernameModal(false);
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setText(generateText());
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, generateText]);

  const newTest = useCallback(() => {
    resetTest();
    setView('test');
  }, [resetTest]);

  // Keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
    }
    if (e.key === 'Escape') {
      setSettingsOpen(false);
    }
  }, [resetTest]);

  // Save to leaderboard
  const saveToLeaderboard = useCallback(() => {
    if (!stats || !username.trim()) return;
    const entry: LeaderboardEntry = {
      username: username.trim(),
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      date: new Date().toISOString(),
      difficulty,
      duration,
    };
    const updated = [...leaderboard, entry].sort((a, b) => b.wpm - a.wpm).slice(0, 50);
    setLeaderboard(updated);
    localStorage.setItem('typeflow-leaderboard', JSON.stringify(updated));
    setShowUsernameModal(false);
  }, [stats, username, leaderboard, difficulty, duration]);

  // Live stats
  const liveStats = useMemo(() => {
    if (gameState !== 'playing' || !startTimeRef.current) return { wpm: 0, accuracy: 100 };
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const correctChars = typed.split('').filter((c, i) => c === text[i]).length;
    const minutes = elapsed / 60 || 1/60;
    const wpm = Math.round((correctChars / 5) / minutes);
    const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
    return { wpm, accuracy };
  }, [typed, text, gameState]);

  // Current key to press
  const currentKey = text[typed.length] || '';
  const progress = text.length > 0 ? (typed.length / text.length) * 100 : 0;

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">TypeFlow</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => { setView('test'); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${view === 'test' ? (isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
            >
              <span className="hidden sm:inline">Test</span>
              <span className="sm:hidden">⌨</span>
            </button>
            <button
              onClick={() => setView('leaderboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${view === 'leaderboard' ? (isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
            >
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">🏆</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {view === 'test' && (
          <TestView
            gameState={gameState}
            text={text}
            typed={typed}
            timeLeft={timeLeft}
            duration={duration}
            category={category}
            difficulty={difficulty}
            fontSize={fontSize}
            soundEnabled={soundEnabled}
            progress={progress}
            liveStats={liveStats}
            currentKey={currentKey}
            isDark={isDark}
            inputRef={inputRef}
            stats={stats}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onReset={resetTest}
            onNewTest={newTest}
            setDuration={setDuration}
            setCategory={setCategory}
            setDifficulty={setDifficulty}
            setSoundEnabled={setSoundEnabled}
          />
        )}
        {view === 'leaderboard' && (
          <LeaderboardView leaderboard={leaderboard} isDark={isDark} />
        )}
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          theme={theme}
          duration={duration}
          difficulty={difficulty}
          soundEnabled={soundEnabled}
          fontSize={fontSize}
          isDark={isDark}
          onClose={() => setSettingsOpen(false)}
          setTheme={setTheme}
          setDuration={setDuration}
          setDifficulty={setDifficulty}
          setSoundEnabled={setSoundEnabled}
          setFontSize={setFontSize}
        />
      )}

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Save Your Score</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-violet-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500'}`}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') saveToLeaderboard(); }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveToLeaderboard}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                onClick={() => setShowUsernameModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Test View Component
function TestView({
  gameState, text, typed, timeLeft, duration, category, difficulty, fontSize, soundEnabled, progress, liveStats, currentKey, isDark, inputRef, stats, onInput, onKeyDown, onReset, onNewTest, setDuration, setCategory, setDifficulty, setSoundEnabled,
}: {
  gameState: GameState; text: string; typed: string; timeLeft: number; duration: number; category: Category | 'random'; difficulty: Difficulty; fontSize: number; soundEnabled: boolean; progress: number; liveStats: { wpm: number; accuracy: number }; currentKey: string; isDark: boolean; inputRef: React.RefObject<HTMLInputElement>; stats: TestStats | null; onInput: (e: React.ChangeEvent<HTMLInputElement>) => void; onKeyDown: (e: React.KeyboardEvent) => void; onReset: () => void; onNewTest: () => void; setDuration: (d: number) => void; setCategory: (c: Category | 'random') => void; setDifficulty: (d: Difficulty) => void; setSoundEnabled: (s: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      {gameState === 'idle' && (
        <div className={`flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
          {/* Duration */}
          <div className="flex items-center gap-1">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${duration === d ? 'bg-violet-500 text-white' : (isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}`}
              >
                {d}s
              </button>
            ))}
          </div>
          <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | 'random')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium outline-none cursor-pointer ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {/* Difficulty */}
          <div className="flex items-center gap-1">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${difficulty === d ? 'bg-violet-500 text-white' : (isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          {/* Sound */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${soundEnabled ? 'text-violet-400' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            )}
          </button>
        </div>
      )}

      {/* Live Stats */}
      {gameState !== 'idle' && (
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{gameState === 'playing' ? liveStats.wpm : (stats?.wpm || 0)}</div>
            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>wpm</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}>{gameState === 'playing' ? liveStats.accuracy : (stats?.accuracy || 0)}%</div>
            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>accuracy</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${timeLeft <= 5 && gameState === 'playing' ? 'text-red-400 animate-pulse' : (isDark ? 'text-white' : 'text-gray-900')}`}>{timeLeft}</div>
            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>seconds</div>
          </div>
        </div>
      )}

      {/* Typing Area */}
      {gameState !== 'finished' && (
        <div className={`relative rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
          {/* Progress bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>

          {/* Text */}
          <div 
            className="font-mono leading-relaxed select-none whitespace-pre-wrap break-words cursor-text min-h-[120px]"
            style={{ fontSize: `${fontSize}px` }}
            onClick={() => inputRef.current?.focus()}
          >
            {text.split('').map((char, index) => {
              let className = '';
              if (index < typed.length) {
                className = typed[index] === char
                  ? (isDark ? 'text-green-400' : 'text-green-600')
                  : (isDark ? 'text-red-400 bg-red-400/20 rounded' : 'text-red-500 bg-red-100 rounded');
              } else if (index === typed.length) {
                className = isDark
                  ? 'text-white bg-violet-500/30 rounded border-b-2 border-violet-400 animate-pulse'
                  : 'text-gray-900 bg-violet-100 rounded border-b-2 border-violet-500 animate-pulse';
              } else {
                className = isDark ? 'text-gray-600' : 'text-gray-400';
              }
              return (
                <span key={index} className={`${className} transition-colors duration-75`}>
                  {char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={onInput}
            onKeyDown={onKeyDown}
            className="absolute opacity-0 w-0 h-0"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {/* Idle message */}
      {gameState === 'idle' && (
        <p className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Start typing to begin the test...
        </p>
      )}

      {/* Virtual Keyboard - hidden on mobile where device keyboard is visible */}
      {gameState === 'playing' && (
        <div className="hidden sm:block">
          <VirtualKeyboard currentKey={currentKey} isDark={isDark} />
        </div>
      )}

      {/* Results */}
      {gameState === 'finished' && stats && (
        <ResultsView stats={stats} isDark={isDark} onReset={onReset} onNewTest={onNewTest} />
      )}

      {/* Restart hint */}
      {gameState !== 'finished' && (
        <div className={`text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          <kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>Tab</kbd> to restart
        </div>
      )}
    </div>
  );
}

// Virtual Keyboard Component
function VirtualKeyboard({ currentKey, isDark }: { currentKey: string; isDark: boolean }) {
  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
  ];
  const numberRow = ['1','2','3','4','5','6','7','8','9','0'];

  const isActive = (key: string) => {
    return currentKey.toLowerCase() === key.toLowerCase();
  };

  const KeyButton = ({ k }: { k: string }) => (
    <div
      className={`
        w-8 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium
        transition-all duration-150 
        ${isActive(k) 
          ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' 
          : (isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200')}
      `}
    >
      {k.toUpperCase()}
    </div>
  );

  return (
    <div className={`rounded-2xl p-4 sm:p-6 ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
      <div className="flex flex-col items-center gap-1.5">
        {/* Number row */}
        <div className="flex gap-1 sm:gap-1.5">
          {numberRow.map(k => <KeyButton key={k} k={k} />)}
        </div>
        {/* Row 1 */}
        <div className="flex gap-1 sm:gap-1.5">
          {rows[0].map(k => <KeyButton key={k} k={k} />)}
        </div>
        {/* Row 2 */}
        <div className="flex gap-1 sm:gap-1.5 ml-4 sm:ml-5">
          {rows[1].map(k => <KeyButton key={k} k={k} />)}
        </div>
        {/* Row 3 */}
        <div className="flex gap-1 sm:gap-1.5 ml-8 sm:ml-10">
          {rows[2].map(k => <KeyButton key={k} k={k} />)}
        </div>
        {/* Space bar */}
        <div className="flex gap-1 sm:gap-1.5 mt-1">
          <div
            className={`
              w-48 sm:w-64 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs font-medium
              transition-all duration-150
              ${currentKey === ' '
                ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30'
                : (isDark ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-gray-100 text-gray-500 border border-gray-200')}
            `}
          >
            space
          </div>
        </div>
      </div>
    </div>
  );
}

// Results View Component
function ResultsView({ stats, isDark, onReset, onNewTest }: { stats: TestStats; isDark: boolean; onReset: () => void; onNewTest: () => void }) {
  return (
    <div className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🎯</div>
        <h2 className="text-2xl font-bold">Test Complete!</h2>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{stats.wpm}</div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Words/Min</div>
        </div>
        <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{stats.accuracy}%</div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.correctChars}</div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Correct</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{stats.incorrectChars}</div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Incorrect</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.totalChars}</div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{stats.errors}</div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Errors</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stats.duration}s</div>
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Duration</div>
        </div>
      </div>

      {/* Performance message */}
      <div className={`text-center mb-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {stats.wpm >= 100 ? "🔥 Incredible! You're a typing legend!" :
         stats.wpm >= 70 ? "⚡ Excellent speed! You're among the best!" :
         stats.wpm >= 50 ? "🚀 Great job! Above average typing speed!" :
         stats.wpm >= 30 ? "👍 Good effort! Keep practicing to improve!" :
         "💪 Keep at it! Practice makes perfect!"}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onReset}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Try Again
        </button>
        <button
          onClick={onNewTest}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
        >
          New Test
        </button>
      </div>
    </div>
  );
}

// Leaderboard View
function LeaderboardView({ leaderboard, isDark }: { leaderboard: LeaderboardEntry[]; isDark: boolean }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Top typing scores</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200'}`}>
          <div className="text-4xl mb-3">📝</div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No scores yet. Complete a test to get on the board!</p>
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDark ? 'bg-gray-800/50' : 'bg-gray-50'}>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>#</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Name</th>
                  <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WPM</th>
                  <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</th>
                  <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Difficulty</th>
                  <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {leaderboard.slice(0, 20).map((entry, i) => (
                  <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{i + 1}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.username}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{entry.wpm}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{entry.accuracy}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        entry.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        entry.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{entry.difficulty}</span>
                    </td>
                    <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings Modal
function SettingsModal({
  theme, duration, difficulty, soundEnabled, fontSize, isDark, onClose, setTheme, setDuration, setDifficulty, setSoundEnabled, setFontSize,
}: {
  theme: Theme; duration: number; difficulty: Difficulty; soundEnabled: boolean; fontSize: number; isDark: boolean;
  onClose: () => void; setTheme: (t: Theme) => void; setDuration: (d: number) => void; setDifficulty: (d: Difficulty) => void; setSoundEnabled: (s: boolean) => void; setFontSize: (s: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Settings</h3>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${theme === 'dark' ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${theme === 'light' ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Test Duration</label>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${duration === d ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${difficulty === d ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Typing Sounds</label>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${soundEnabled ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}
            >
              {soundEnabled ? '🔊 Enabled' : '🔇 Disabled'}
            </button>
          </div>

          {/* Font Size */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Font Size: {fontSize}px</label>
            <input
              type="range"
              min="16"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Small</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Large</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
