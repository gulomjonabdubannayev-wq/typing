import { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const texts = {
    general: {
        easy: [
            "The sun rose slowly over the mountains, painting the sky in shades of gold and pink. Birds began to sing their morning songs as the world woke up to a brand new day.",
            "She walked through the park on a warm summer afternoon, watching children play and dogs run freely on the green grass. It was the perfect day to sit and read a good book.",
            "The old house at the end of the street had been empty for many years. Nobody knew who built it or why it was left behind. The garden was overgrown and the windows were dark.",
            "My favorite place to visit is the beach. I love the sound of the waves, the feeling of sand between my toes, and the warm sun on my face. Every summer I go with my family."
        ],
        medium: [
            "The expedition through the dense rainforest revealed countless species of plants and animals that had never been documented before. Each step forward brought new discoveries and unexpected challenges for the research team.",
            "Architecture reflects the values and aspirations of the civilization that creates it. From the grand cathedrals of medieval Europe to the sleek skyscrapers of modern cities, buildings tell the story of human ambition and ingenuity.",
            "The art of cooking involves not just following recipes but understanding how flavors interact and transform under different conditions. A skilled chef can take simple ingredients and create something extraordinary through technique and creativity.",
            "Traveling to foreign countries opens your mind to different perspectives and ways of living. You learn that despite cultural differences, people everywhere share common hopes, fears, and dreams for their families."
        ],
        hard: [
            "The philosophical implications of consciousness remain one of the most perplexing mysteries in contemporary thought. While neuroscience has made remarkable strides in mapping brain activity, the subjective experience of awareness continues to elude comprehensive explanation, challenging our fundamental understanding of existence itself.",
            "Throughout human history, civilizations have risen and fallen according to patterns that historians continue to debate. The interplay between environmental factors, technological advancement, social organization, and cultural evolution creates a complex tapestry that resists simplistic explanation or deterministic prediction."
        ]
    },
    technology: {
        easy: [
            "Computers have changed the way we live and work. We use them to send emails, browse the internet, and play games. Most people have a computer or a phone that they use every single day.",
            "The internet connects millions of people around the world. You can find information on almost any topic, talk to friends far away, and even buy things without leaving your home.",
            "Smartphones are small computers that fit in your pocket. They can take photos, play music, and help you find your way around. Many people cannot imagine life without their phone.",
            "Video games have become a popular form of entertainment for people of all ages. Modern games have amazing graphics and can be played with friends online from anywhere in the world."
        ],
        medium: [
            "Cloud computing has transformed how businesses store and process data. Instead of maintaining expensive servers on-site, companies can now rent computing resources from providers like Amazon, Google, and Microsoft, paying only for what they use.",
            "Artificial intelligence is rapidly advancing and finding applications in healthcare, transportation, and education. Machine learning algorithms can now recognize patterns in data that would be impossible for humans to detect manually.",
            "The development of 5G networks promises to revolutionize mobile communications with faster speeds and lower latency. This technology will enable new applications in autonomous vehicles, remote surgery, and smart city infrastructure.",
            "Cybersecurity has become increasingly important as our lives become more digital. Organizations must constantly update their defenses against sophisticated attacks that target vulnerabilities in software, hardware, and human behavior."
        ],
        hard: [
            "Quantum computing leverages the principles of quantum mechanics to perform calculations that would be practically impossible for classical computers. By exploiting superposition and entanglement, quantum processors can explore multiple computational paths simultaneously, potentially revolutionizing cryptography, drug discovery, and optimization problems.",
            "The proliferation of Internet of Things devices has created unprecedented challenges in network architecture and data management. Billions of interconnected sensors and actuators generate massive streams of real-time data that must be processed, analyzed, and secured while maintaining acceptable latency and bandwidth constraints across heterogeneous communication protocols."
        ]
    },
    programming: {
        easy: [
            "A variable is like a box that holds information. You can give it a name and put different values inside. Programs use variables to remember things and make decisions based on what they contain.",
            "Functions are reusable blocks of code that perform a specific task. You write them once and then call them whenever you need that task done. This makes your code cleaner and easier to maintain.",
            "Loops let you repeat actions many times without writing the same code over and over. A for loop runs a set number of times, while a while loop continues until a condition becomes false.",
            "Debugging is the process of finding and fixing errors in your code. Every programmer spends a lot of time debugging. It requires patience and careful thinking to trace where things go wrong."
        ],
        medium: [
            "Object-oriented programming organizes code into classes that bundle data and behavior together. Inheritance allows new classes to reuse and extend existing functionality, while encapsulation protects internal state from unintended modification by external code.",
            "Version control systems like Git track changes to source code over time, enabling multiple developers to collaborate without overwriting each other's work. Branches allow parallel development of features, while merges integrate completed work back into the main codebase.",
            "Database normalization reduces redundancy by organizing data into related tables with clear relationships. This prevents update anomalies and ensures data integrity, though excessive normalization can impact query performance and sometimes requires strategic denormalization.",
            "RESTful APIs provide a standardized way for applications to communicate over HTTP. They use standard methods like GET, POST, PUT, and DELETE to perform operations on resources identified by URLs, returning data typically in JSON format."
        ],
        hard: [
            "Functional programming emphasizes immutable data and pure functions without side effects. Monads provide a compositional framework for handling computations involving context, such as optional values, error states, or asynchronous operations, while maintaining referential transparency and enabling elegant abstraction of complex control flow patterns.",
            "Distributed systems must handle network partitions, inconsistent states, and partial failures gracefully. The CAP theorem demonstrates that systems cannot simultaneously guarantee consistency, availability, and partition tolerance, forcing architects to make deliberate trade-offs based on their specific application requirements and acceptable failure modes."
        ]
    },
    business: {
        easy: [
            "A good business starts with a clear idea that solves a real problem. You need to understand your customers and what they want. Then you build something that makes their lives better or easier.",
            "Marketing is how you tell people about your product or service. Good marketing helps the right people find what they need. It uses words, images, and stories to connect with customers.",
            "Teamwork is essential in any successful business. When people work together and share their ideas, they can accomplish much more than any individual could alone. Communication and trust are the foundation.",
            "Customer service is about making people feel valued and heard. When you solve problems quickly and treat customers with respect, they come back and tell their friends about your business."
        ],
        medium: [
            "Strategic planning involves analyzing market conditions, identifying competitive advantages, and setting long-term objectives that align organizational resources with opportunities. Effective strategies require regular review and adaptation as external conditions evolve and new information becomes available to decision makers.",
            "Financial management requires careful tracking of revenue, expenses, and cash flow to ensure business sustainability. Budgets provide a framework for resource allocation, while financial statements reveal the true health of an organization and guide strategic investment decisions.",
            "Negotiation is a fundamental business skill that involves understanding both parties' interests and finding mutually beneficial solutions. Successful negotiators prepare thoroughly, listen actively, and maintain professional relationships even when discussions become challenging or contentious.",
            "Supply chain management coordinates the flow of materials, information, and finances from suppliers through manufacturing to end customers. Efficient supply chains reduce costs, improve delivery times, and create competitive advantages in increasingly global markets."
        ],
        hard: [
            "Mergers and acquisitions require comprehensive due diligence encompassing financial analysis, cultural compatibility assessment, regulatory compliance review, and strategic alignment evaluation. Post-merger integration challenges frequently determine whether anticipated synergies materialize, as organizational cultures, systems, and processes must be harmonized while maintaining operational continuity and employee morale.",
            "Venture capital investment decisions involve evaluating market opportunity size, competitive positioning, team capabilities, and scalability potential under conditions of significant uncertainty. Portfolio theory suggests diversifying across multiple investments while concentrating resources in ventures demonstrating the strongest product-market fit and defensible technological advantages."
        ]
    },
    science: {
        easy: [
            "Plants need sunlight, water, and air to grow. They take in carbon dioxide and give out oxygen, which is what we breathe. Without plants, life on Earth would not be possible for humans or animals.",
            "The Earth goes around the Sun once every year. This journey, combined with the tilt of our planet, gives us the four seasons. Each season brings different weather and changes to nature.",
            "Water can be found in three forms: liquid, solid ice, and gas vapor. When water gets hot enough, it turns to steam. When it gets cold enough, it freezes into ice. This cycle never stops.",
            "The human body has over two hundred bones that give it shape and support muscles. Bones also protect important organs like the brain and heart. They grow and change throughout your entire life."
        ],
        medium: [
            "Photosynthesis is the process by which plants convert sunlight into chemical energy. Chlorophyll in leaf cells captures light energy and uses it to transform carbon dioxide and water into glucose and oxygen, sustaining virtually all life on Earth.",
            "The theory of plate tectonics explains how Earth's outer shell is divided into large plates that float on the mantle beneath. Their movement causes earthquakes, volcanic eruptions, and the formation of mountain ranges over millions of years.",
            "DNA contains the genetic instructions for building and maintaining living organisms. Its double helix structure, discovered by Watson and Crick, enables precise replication during cell division, ensuring that genetic information passes accurately from one generation to the next.",
            "Climate change results from increased greenhouse gases trapping heat in Earth's atmosphere. Rising temperatures affect weather patterns, sea levels, and ecosystems worldwide, requiring coordinated international efforts to reduce emissions and adapt to changing conditions."
        ],
        hard: [
            "Quantum entanglement describes a phenomenon where particles become correlated such that the quantum state of one instantly influences the other regardless of distance. This non-local correlation, which Einstein called spooky action at a distance, has been experimentally verified and forms the basis for emerging quantum communication technologies.",
            "CRISPR-Cas9 gene editing technology enables precise modification of DNA sequences by utilizing bacterial immune system components. Guide RNA directs the Cas9 enzyme to specific genomic locations where it creates targeted double-strand breaks, allowing researchers to insert, delete, or modify genetic material with unprecedented accuracy and efficiency."
        ]
    }
};

type Mode = 'words' | 'time';
type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'random' | 'general' | 'technology' | 'programming' | 'business' | 'science';
type GameState = 'idle' | 'playing' | 'finished';

interface HistoryEntry {
    date: string;
    wpm: number;
    accuracy: number;
    time: number;
    words: number;
    errors: number;
    mode: Mode;
    difficulty: Difficulty;
}

function App() {
    const [mode, setMode] = useState<Mode>(() => {
        return (localStorage.getItem('typeflow-mode') as Mode) || 'words';
    });
    const [wordCount, setWordCount] = useState(() => {
        return parseInt(localStorage.getItem('typeflow-wordCount') || '25');
    });
    const [timeLimit, setTimeLimit] = useState(() => {
        return parseInt(localStorage.getItem('typeflow-timeLimit') || '30');
    });
    const [category, setCategory] = useState<Category>(() => {
        return (localStorage.getItem('typeflow-category') as Category) || 'random';
    });
    const [difficulty, setDifficulty] = useState<Difficulty>(() => {
        return (localStorage.getItem('typeflow-difficulty') as Difficulty) || 'medium';
    });
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('typeflow-sound') === 'true';
    });
    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('typeflow-fontSize') || '22');
    });
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('typeflow-theme') || 'dark';
    });
    
    const [gameState, setGameState] = useState<GameState>('idle');
    const [text, setText] = useState('');
    const [typed, setTyped] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [wpmHistory, setWpmHistory] = useState<number[]>([]);
    const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);
    const [speedOverTime, setSpeedOverTime] = useState<{time: number, wpm: number}[]>([]);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        const saved = localStorage.getItem('typeflow-history');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('typeflow-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('typeflow-mode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('typeflow-wordCount', String(wordCount));
    }, [wordCount]);

    useEffect(() => {
        localStorage.setItem('typeflow-timeLimit', String(timeLimit));
    }, [timeLimit]);

    useEffect(() => {
        localStorage.setItem('typeflow-category', category);
    }, [category]);

    useEffect(() => {
        localStorage.setItem('typeflow-difficulty', difficulty);
    }, [difficulty]);

    useEffect(() => {
        localStorage.setItem('typeflow-sound', String(soundEnabled));
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem('typeflow-fontSize', String(fontSize));
    }, [fontSize]);

    const generateText = useCallback(() => {
        let pool: string[] = [];
        
        if (category === 'random') {
            Object.values(texts).forEach(cat => {
                pool = pool.concat(cat[difficulty]);
            });
        } else {
            pool = texts[category][difficulty];
        }
        
        if (mode === 'words') {
            let result = '';
            const wordsNeeded = wordCount;
            let currentWords = 0;
            
            while (currentWords < wordsNeeded) {
                const randomText = pool[Math.floor(Math.random() * pool.length)];
                const words = randomText.split(' ');
                for (const word of words) {
                    if (currentWords >= wordsNeeded) break;
                    result += (result ? ' ' : '') + word;
                    currentWords++;
                }
            }
            
            setText(result);
        } else {
            let result = '';
            const minLength = 300;
            
            while (result.length < minLength) {
                const randomText = pool[Math.floor(Math.random() * pool.length)];
                result += (result ? ' ' : '') + randomText;
            }
            
            setText(result);
        }
    }, [category, difficulty, mode, wordCount]);

    useEffect(() => {
        generateText();
    }, [generateText]);

    useEffect(() => {
        setTimeLeft(timeLimit);
    }, [timeLimit]);

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

    const recordStats = useCallback(() => {
        if (!startTime) return;
        const elapsed = (Date.now() - startTime) / 1000;
        const correctChars = typed.split('').filter((c, i) => c === text[i]).length;
        const minutes = elapsed / 60;
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
        
        setWpmHistory(prev => [...prev, wpm]);
        setAccuracyHistory(prev => [...prev, accuracy]);
        setSpeedOverTime(prev => [...prev, { time: elapsed, wpm }]);
    }, [startTime, typed, text]);

    const finishTest = useCallback(() => {
        setGameState('finished');
        if (timerRef.current) clearInterval(timerRef.current);
        
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
        const correctChars = typed.split('').filter((c, i) => c === text[i]).length;
        const incorrectChars = typed.length - correctChars;
        const minutes = elapsed / 60;
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 0;
        const words = Math.round(typed.length / 5);
        
        const entry: HistoryEntry = {
            date: new Date().toISOString(),
            wpm,
            accuracy,
            time: elapsed,
            words,
            errors: incorrectChars,
            mode,
            difficulty
        };
        
        const updatedHistory = [entry, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('typeflow-history', JSON.stringify(updatedHistory));
        
        setShowUsername(true);
    }, [startTime, typed, text, mode, difficulty, history]);

    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                if (mode === 'time') {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            setTimeout(() => finishTest(), 0);
                            return 0;
                        }
                        return prev - 1;
                    });
                }
                recordStats();
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, mode, finishTest, recordStats]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (gameState === 'finished') return;
        
        if (gameState === 'idle') {
            setGameState('playing');
            setStartTime(Date.now());
            setWpmHistory([]);
            setAccuracyHistory([]);
            setSpeedOverTime([]);
        }
        
        if (value.length > text.length) return;
        
        setTyped(value);
        playKeySound();
        
        if (value.length > 0 && value[value.length - 1] !== text[value.length - 1]) {
            playErrorSound();
        }
        
        if (mode === 'words' && value.length === text.length) {
            finishTest();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            resetTest();
        }
    };

    const resetTest = () => {
        setGameState('idle');
        setTyped('');
        setStartTime(null);
        setTimeLeft(mode === 'time' ? timeLimit : 0);
        setWpmHistory([]);
        setAccuracyHistory([]);
        setSpeedOverTime([]);
        
        if (timerRef.current) clearInterval(timerRef.current);
        
        generateText();
        
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        
        if (mins > 0) {
            return `${mins}m ${secs}.${ms}s`;
        }
        return `${seconds.toFixed(1)}s`;
    };

    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const correctChars = typed.split('').filter((c, i) => c === text[i]).length;
    const incorrectChars = typed.length - correctChars;
    const minutes = elapsed / 60;
    const liveWpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const liveAccuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
    const progress = text.length > 0 ? (typed.length / text.length) * 100 : 0;
    const currentKey = text[typed.length] || '';

    const stats = gameState === 'finished' ? {
        wpm: liveWpm,
        accuracy: liveAccuracy,
        time: elapsed,
        words: Math.round(typed.length / 5),
        errors: incorrectChars,
        correctChars,
        incorrectChars,
        totalChars: typed.length
    } : null;

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">TypeFlow</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowHistory(true)} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                        <button onClick={() => setShowSettings(true)} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                            {isDark ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {gameState !== 'finished' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className={`flex gap-2 p-2 rounded-xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-200'}`}>
                                <button onClick={() => setMode('words')} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'words' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}>Words</button>
                                <button onClick={() => setMode('time')} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'time' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}>Time</button>
                            </div>
                        </div>

                        <div className={`flex flex-wrap justify-center items-center gap-4 p-4 rounded-xl mb-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
                            {mode === 'words' ? (
                                <div className="flex gap-2">
                                    {[10, 25, 50, 100, 200].map(n => (
                                        <button key={n} onClick={() => setWordCount(n)} className={`px-4 py-2 rounded-lg font-medium transition-all ${wordCount === n ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : (isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}`}>{n}</button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    {[15, 30, 60, 120].map(n => (
                                        <button key={n} onClick={() => setTimeLimit(n)} className={`px-4 py-2 rounded-lg font-medium transition-all ${timeLimit === n ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : (isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}`}>{n}s</button>
                                    ))}
                                </div>
                            )}
                            <div className={`w-px h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={`px-4 py-2 rounded-lg font-medium ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                                <option value="random">Random</option>
                                <option value="general">General</option>
                                <option value="technology">Technology</option>
                                <option value="programming">Programming</option>
                                <option value="business">Business</option>
                                <option value="science">Science</option>
                            </select>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className={`px-4 py-2 rounded-lg font-medium capitalize ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-lg transition-all ${soundEnabled ? 'text-violet-400' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                                {soundEnabled ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
                                )}
                            </button>
                        </div>

                        <div className="flex justify-center gap-12 mb-6">
                            <div className="text-center">
                                <div className={`text-4xl font-bold tabular-nums ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{liveWpm}</div>
                                <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>wpm</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold tabular-nums ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}>{liveAccuracy}%</div>
                                <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>accuracy</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold tabular-nums ${timeLeft <= 5 && gameState === 'playing' && mode === 'time' ? 'text-red-400 animate-pulse' : (isDark ? 'text-white' : 'text-gray-900')}`}>{mode === 'time' ? timeLeft : Math.floor(elapsed)}</div>
                                <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>seconds</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold tabular-nums ${isDark ? 'text-red-400' : 'text-red-600'}`}>{incorrectChars}</div>
                                <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>errors</div>
                            </div>
                        </div>

                        <div className={`relative rounded-2xl p-8 mb-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-200" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="font-mono leading-relaxed select-none whitespace-pre-wrap break-words cursor-text min-h-[120px]" style={{ fontSize: `${fontSize}px` }} onClick={() => inputRef.current?.focus()}>
                                {text.split('').map((char, index) => {
                                    let className = '';
                                    if (index < typed.length) {
                                        className = typed[index] === char ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400 bg-red-400/20 rounded' : 'text-red-500 bg-red-100 rounded');
                                    } else if (index === typed.length) {
                                        className = isDark ? 'text-white bg-violet-500/30 rounded border-b-2 border-violet-400 animate-pulse' : 'text-gray-900 bg-violet-100 rounded border-b-2 border-violet-500 animate-pulse';
                                    } else {
                                        className = isDark ? 'text-gray-600' : 'text-gray-400';
                                    }
                                    return <span key={index} className={`${className} transition-colors duration-75`}>{char}</span>;
                                })}
                            </div>
                            <input ref={inputRef} type="text" value={typed} onChange={handleInput} onKeyDown={handleKeyDown} className="absolute opacity-0 w-0 h-0" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                        </div>

                        {gameState === 'idle' && (
                            <p className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Start typing to begin...</p>
                        )}

                        {gameState === 'playing' && (
                            <div className="hidden sm:block">
                                <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="flex gap-1.5">
                                            {['1','2','3','4','5','6','7','8','9','0'].map(k => (
                                                <div key={k} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentKey.toLowerCase() === k ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' : (isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200')}`}>{k}</div>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5">
                                            {['q','w','e','r','t','y','u','i','o','p'].map(k => (
                                                <div key={k} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentKey.toLowerCase() === k ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' : (isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200')}`}>{k.toUpperCase()}</div>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5 ml-5">
                                            {['a','s','d','f','g','h','j','k','l'].map(k => (
                                                <div key={k} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentKey.toLowerCase() === k ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' : (isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200')}`}>{k.toUpperCase()}</div>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5 ml-10">
                                            {['z','x','c','v','b','n','m'].map(k => (
                                                <div key={k} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentKey.toLowerCase() === k ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' : (isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-600 border border-gray-200')}`}>{k.toUpperCase()}</div>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5 mt-1">
                                            <div className={`w-64 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${currentKey === ' ' ? 'bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30' : (isDark ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-gray-100 text-gray-500 border border-gray-200')}`}>space</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            Press <kbd className={`px-2 py-0.5 rounded ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>Tab</kbd> to restart
                        </div>
                    </>
                )}

                {gameState === 'finished' && stats && (
                    <div className={`rounded-2xl p-8 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-2">🎯</div>
                            <h2 className="text-2xl font-bold">Test Complete!</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                            <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{stats.wpm}</div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WPM</div>
                            </div>
                            <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{stats.accuracy}%</div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</div>
                            </div>
                            <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatTime(stats.time)}</div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Time</div>
                            </div>
                            <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.words}</div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Words</div>
                            </div>
                            <div className={`text-center p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className={`text-5xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{stats.errors}</div>
                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Errors</div>
                            </div>
                        </div>
                        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
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
                                <div className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{formatTime(stats.time)}</div>
                                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Completion</div>
                            </div>
                        </div>
                        
                        {wpmHistory.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>WPM Over Time</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={wpmHistory.map((wpm, i) => ({ time: i + 1, wpm }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} label={{ value: 'Seconds', position: 'insideBottom', offset: -5, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '8px' }} />
                                            <Line type="monotone" dataKey="wpm" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy Over Time</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={accuracyHistory.map((acc, i) => ({ time: i + 1, accuracy: acc }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} label={{ value: 'Seconds', position: 'insideBottom', offset: -5, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} domain={[0, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '8px' }} />
                                            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Character Accuracy</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie data={[{ name: 'Correct', value: stats.correctChars }, { name: 'Incorrect', value: stats.incorrectChars }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}>
                                                <Cell fill="#10b981" />
                                                <Cell fill="#ef4444" />
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '8px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Speed Progression</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={speedOverTime}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                                            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: isDark ? '#9ca3af' : '#6b7280' }} />
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '8px' }} />
                                            <Area type="monotone" dataKey="wpm" stroke="#d946ef" fill="url(#colorWpm)" strokeWidth={2} />
                                            <defs>
                                                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetTest} className={`px-6 py-3 rounded-xl font-semibold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Try Again</button>
                            <button onClick={resetTest} className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 shadow-lg shadow-violet-500/25">New Test</button>
                        </div>
                    </div>
                )}
            </main>

            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
                    <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Settings</h3>
                            <button onClick={() => setShowSettings(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>×</button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setTheme('dark')} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium ${theme === 'dark' ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}`}>🌙 Dark</button>
                                    <button onClick={() => setTheme('light')} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium ${theme === 'light' ? 'bg-violet-500 text-white' : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}`}>☀️ Light</button>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Font Size: {fontSize}px</label>
                                <input type="range" min="16" max="32" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
                    <div className={`w-full max-w-4xl rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Performance History</h3>
                            <button onClick={() => setShowHistory(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>×</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className={`text-center p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0}</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Best WPM</div>
                            </div>
                            <div className={`text-center p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length) : 0}</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Average WPM</div>
                            </div>
                            <div className={`text-center p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{history.length > 0 ? Math.max(...history.map(h => h.accuracy)) : 0}%</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Best Accuracy</div>
                            </div>
                            <div className={`text-center p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length) : 0}%</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Average Accuracy</div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WPM</th>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</th>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Time</th>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mode</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                                    {history.length === 0 ? (
                                        <tr><td colSpan={5} className={`px-4 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No history yet</td></tr>
                                    ) : (
                                        history.map((entry, i) => (
                                            <tr key={i} className={isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}>
                                                <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(entry.date).toLocaleDateString()}</td>
                                                <td className={`px-4 py-3 font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{entry.wpm}</td>
                                                <td className={`px-4 py-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{entry.accuracy}%</td>
                                                <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{entry.time.toFixed(1)}s</td>
                                                <td className={`px-4 py-3 capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{entry.mode}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showUsername && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <h3 className="text-xl font-bold mb-4">Save Your Score</h3>
                        <input type="text" placeholder="Enter your name" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`} autoFocus />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowUsername(false)} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold">Save</button>
                            <button onClick={() => setShowUsername(false)} className={`flex-1 px-4 py-3 rounded-xl font-semibold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Skip</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
