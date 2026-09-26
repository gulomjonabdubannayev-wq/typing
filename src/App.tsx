import { useState, useEffect, useCallback, useRef } from 'react';

const passages = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and has been used by typists for generations to practice their skills.",
  "Programming is the art of telling another human what one wants the computer to do. It requires patience, creativity, and a willingness to debug until the solution emerges.",
  "In the middle of difficulty lies opportunity. The challenges we face in life are not meant to defeat us but to strengthen our resolve and sharpen our abilities.",
  "Technology is best when it brings people together. The greatest innovations in computing have always been driven by the desire to connect and communicate.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it. The secret is to start before you feel ready.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
  "Code is like humor. When you have to explain it, it's bad. The best programs are written so that the intent is clear and the logic flows naturally from one line to the next.",
  "Simplicity is the soul of efficiency. Before you can add features, you must first learn to subtract complexity until only the essential remains.",
];

type GameState = 'idle' | 'playing' | 'finished';

function App() {
  const [passage, setPassage] = useState('');
  const [typed, setTyped] = useState('');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getRandomPassage = useCallback(() => {
    const idx = Math.floor(Math.random() * passages.length);
    return passages[idx];
  }, []);

  const startGame = useCallback(() => {
    setPassage(getRandomPassage());
    setTyped('');
    setGameState('idle');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [getRandomPassage]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const seconds = (now - startTime) / 1000;
        setElapsed(seconds);
        
        // Calculate WPM in real-time
        const wordsTyped = typed.length / 5;
        const minutes = seconds / 60;
        if (minutes > 0) {
          setWpm(Math.round(wordsTyped / minutes));
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime, typed]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (gameState === 'finished') return;
    
    if (gameState === 'idle') {
      setGameState('playing');
      setStartTime(Date.now());
    }

    // Don't allow typing more than the passage length
    if (value.length > passage.length) return;

    setTyped(value);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== passage[i]) errorCount++;
    }
    setErrors(errorCount);

    // Calculate accuracy
    if (value.length > 0) {
      const acc = Math.round(((value.length - errorCount) / value.length) * 100);
      setAccuracy(acc);
    }

    // Check if finished
    if (value.length === passage.length) {
      setGameState('finished');
      setEndTime(Date.now());
      if (timerRef.current) clearInterval(timerRef.current);
      
      const totalTime = (Date.now() - (startTime || Date.now())) / 1000;
      const wordsTyped = value.length / 5;
      const minutes = totalTime / 60;
      if (minutes > 0) {
        setWpm(Math.round(wordsTyped / minutes));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      startGame();
    }
  };

  const getCharClass = (index: number) => {
    if (index >= typed.length) {
      if (index === typed.length) return 'text-gray-400 bg-gray-100/50 rounded';
      return 'text-gray-400';
    }
    if (typed[index] === passage[index]) {
      return 'text-green-500';
    }
    return 'text-red-500 bg-red-50 rounded';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TypeFlow
          </span>
        </h1>
        <p className="text-gray-400 text-sm">Test your typing speed and accuracy</p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
          <div className="text-2xl font-bold text-purple-300">{wpm}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">WPM</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
          <div className="text-2xl font-bold text-pink-300">{accuracy}%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
          <div className="text-2xl font-bold text-blue-300">{formatTime(elapsed)}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
          <div className="text-2xl font-bold text-red-300">{errors}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Errors</div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="w-full max-w-3xl">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
              style={{ width: `${passage.length > 0 ? (typed.length / passage.length) * 100 : 0}%` }}
            />
          </div>

          {/* Text display */}
          <div className="text-xl leading-relaxed font-mono tracking-wide select-none">
            {passage.split('').map((char, index) => (
              <span
                key={index}
                className={`${getCharClass(index)} transition-colors duration-75`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 w-0 h-0"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Click to focus overlay */}
          {gameState !== 'finished' && (
            <div 
              className="absolute inset-0 cursor-text"
              onClick={() => inputRef.current?.focus()}
            />
          )}
        </div>

        {/* Game state messages */}
        {gameState === 'idle' && (
          <div className="text-center text-gray-400 text-sm animate-pulse">
            Start typing to begin...
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-3xl font-bold text-white mb-2">🎉 Complete!</div>
            <div className="grid grid-cols-3 gap-4 my-6">
              <div>
                <div className="text-4xl font-bold text-purple-300">{wpm}</div>
                <div className="text-sm text-gray-400">Words/Min</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-300">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300">{formatTime(elapsed)}</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm mb-4">
              {wpm >= 80 ? "🔥 Blazing fast! You're a typing master!" : 
               wpm >= 50 ? "⚡ Great speed! Keep practicing!" : 
               wpm >= 30 ? "👍 Good job! You're improving!" : 
               "💪 Keep at it! Practice makes perfect!"}
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">Tab</kbd> to restart • Click the text area to focus</p>
      </div>
    </div>
  );
}

export default App;
