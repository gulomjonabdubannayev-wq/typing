export type Category = 'general' | 'technology' | 'programming' | 'business' | 'science';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TextEntry {
  text: string;
  category: Category;
  difficulty: Difficulty;
}

export const texts: TextEntry[] = [
  // GENERAL - Easy
  { text: "The sun rose slowly over the mountains, painting the sky in shades of gold and pink. Birds began to sing their morning songs as the world woke up to a brand new day.", category: 'general', difficulty: 'easy' },
  { text: "She walked through the park on a warm summer afternoon, watching children play and dogs run freely on the green grass. It was the perfect day to sit and read a good book.", category: 'general', difficulty: 'easy' },
  { text: "The old house at the end of the street had been empty for many years. Nobody knew who built it or why it was left behind. The garden was overgrown and the windows were dark.", category: 'general', difficulty: 'easy' },
  { text: "My favorite place to visit is the beach. I love the sound of the waves, the feeling of sand between my toes, and the warm sun on my face. Every summer I go with my family.", category: 'general', difficulty: 'easy' },
  // GENERAL - Medium
  { text: "The expedition through the dense rainforest revealed countless species of plants and animals that had never been documented before. Each step forward brought new discoveries and unexpected challenges for the research team.", category: 'general', difficulty: 'medium' },
  { text: "Architecture reflects the values and aspirations of the civilization that creates it. From the grand cathedrals of medieval Europe to the sleek skyscrapers of modern cities, buildings tell the story of human ambition and ingenuity.", category: 'general', difficulty: 'medium' },
  { text: "The art of cooking involves not just following recipes but understanding how flavors interact and transform under different conditions. A skilled chef can take simple ingredients and create something extraordinary through technique and creativity.", category: 'general', difficulty: 'medium' },
  { text: "Traveling to foreign countries opens your mind to different perspectives and ways of living. You learn that despite cultural differences, people everywhere share common hopes, fears, and dreams for their families.", category: 'general', difficulty: 'medium' },
  // GENERAL - Hard
  { text: "The philosophical implications of consciousness remain one of the most perplexing mysteries in contemporary thought. While neuroscience has made remarkable strides in mapping brain activity, the subjective experience of awareness continues to elude comprehensive explanation, challenging our fundamental understanding of existence itself.", category: 'general', difficulty: 'hard' },
  { text: "Throughout human history, civilizations have risen and fallen according to patterns that historians continue to debate. The interplay between environmental factors, technological advancement, social organization, and cultural evolution creates a complex tapestry that resists simplistic explanation or deterministic prediction.", category: 'general', difficulty: 'hard' },

  // TECHNOLOGY - Easy
  { text: "Computers have changed the way we live and work. We use them to send emails, browse the internet, and play games. Most people have a computer or a phone that they use every single day.", category: 'technology', difficulty: 'easy' },
  { text: "The internet connects millions of people around the world. You can find information on almost any topic, talk to friends far away, and even buy things without leaving your home.", category: 'technology', difficulty: 'easy' },
  { text: "Smartphones are small computers that fit in your pocket. They can take photos, play music, and help you find your way around. Many people cannot imagine life without their phone.", category: 'technology', difficulty: 'easy' },
  { text: "Video games have become a popular form of entertainment for people of all ages. Modern games have amazing graphics and can be played with friends online from anywhere in the world.", category: 'technology', difficulty: 'easy' },
  // TECHNOLOGY - Medium
  { text: "Cloud computing has transformed how businesses store and process data. Instead of maintaining expensive servers on-site, companies can now rent computing resources from providers like Amazon, Google, and Microsoft, paying only for what they use.", category: 'technology', difficulty: 'medium' },
  { text: "Artificial intelligence is rapidly advancing and finding applications in healthcare, transportation, and education. Machine learning algorithms can now recognize patterns in data that would be impossible for humans to detect manually.", category: 'technology', difficulty: 'medium' },
  { text: "The development of 5G networks promises to revolutionize mobile communications with faster speeds and lower latency. This technology will enable new applications in autonomous vehicles, remote surgery, and smart city infrastructure.", category: 'technology', difficulty: 'medium' },
  { text: "Cybersecurity has become increasingly important as our lives become more digital. Organizations must constantly update their defenses against sophisticated attacks that target vulnerabilities in software, hardware, and human behavior.", category: 'technology', difficulty: 'medium' },
  // TECHNOLOGY - Hard
  { text: "Quantum computing leverages the principles of quantum mechanics to perform calculations that would be practically impossible for classical computers. By exploiting superposition and entanglement, quantum processors can explore multiple computational paths simultaneously, potentially revolutionizing cryptography, drug discovery, and optimization problems.", category: 'technology', difficulty: 'hard' },
  { text: "The proliferation of Internet of Things devices has created unprecedented challenges in network architecture and data management. Billions of interconnected sensors and actuators generate massive streams of real-time data that must be processed, analyzed, and secured while maintaining acceptable latency and bandwidth constraints across heterogeneous communication protocols.", category: 'technology', difficulty: 'hard' },

  // PROGRAMMING - Easy
  { text: "A variable is like a box that holds information. You can give it a name and put different values inside. Programs use variables to remember things and make decisions based on what they contain.", category: 'programming', difficulty: 'easy' },
  { text: "Functions are reusable blocks of code that perform a specific task. You write them once and then call them whenever you need that task done. This makes your code cleaner and easier to maintain.", category: 'programming', difficulty: 'easy' },
  { text: "Loops let you repeat actions many times without writing the same code over and over. A for loop runs a set number of times, while a while loop continues until a condition becomes false.", category: 'programming', difficulty: 'easy' },
  { text: "Debugging is the process of finding and fixing errors in your code. Every programmer spends a lot of time debugging. It requires patience and careful thinking to trace where things go wrong.", category: 'programming', difficulty: 'easy' },
  // PROGRAMMING - Medium
  { text: "Object-oriented programming organizes code into classes that bundle data and behavior together. Inheritance allows new classes to reuse and extend existing functionality, while encapsulation protects internal state from unintended modification by external code.", category: 'programming', difficulty: 'medium' },
  { text: "Version control systems like Git track changes to source code over time, enabling multiple developers to collaborate without overwriting each other's work. Branches allow parallel development of features, while merges integrate completed work back into the main codebase.", category: 'programming', difficulty: 'medium' },
  { text: "Database normalization reduces redundancy by organizing data into related tables with clear relationships. This prevents update anomalies and ensures data integrity, though excessive normalization can impact query performance and sometimes requires strategic denormalization.", category: 'programming', difficulty: 'medium' },
  { text: "RESTful APIs provide a standardized way for applications to communicate over HTTP. They use standard methods like GET, POST, PUT, and DELETE to perform operations on resources identified by URLs, returning data typically in JSON format.", category: 'programming', difficulty: 'medium' },
  // PROGRAMMING - Hard
  { text: "Functional programming emphasizes immutable data and pure functions without side effects. Monads provide a compositional framework for handling computations involving context, such as optional values, error states, or asynchronous operations, while maintaining referential transparency and enabling elegant abstraction of complex control flow patterns.", category: 'programming', difficulty: 'hard' },
  { text: "Distributed systems must handle network partitions, inconsistent states, and partial failures gracefully. The CAP theorem demonstrates that systems cannot simultaneously guarantee consistency, availability, and partition tolerance, forcing architects to make deliberate trade-offs based on their specific application requirements and acceptable failure modes.", category: 'programming', difficulty: 'hard' },

  // BUSINESS - Easy
  { text: "A good business starts with a clear idea that solves a real problem. You need to understand your customers and what they want. Then you build something that makes their lives better or easier.", category: 'business', difficulty: 'easy' },
  { text: "Marketing is how you tell people about your product or service. Good marketing helps the right people find what they need. It uses words, images, and stories to connect with customers.", category: 'business', difficulty: 'easy' },
  { text: "Teamwork is essential in any successful business. When people work together and share their ideas, they can accomplish much more than any individual could alone. Communication and trust are the foundation.", category: 'business', difficulty: 'easy' },
  { text: "Customer service is about making people feel valued and heard. When you solve problems quickly and treat customers with respect, they come back and tell their friends about your business.", category: 'business', difficulty: 'easy' },
  // BUSINESS - Medium
  { text: "Strategic planning involves analyzing market conditions, identifying competitive advantages, and setting long-term objectives that align organizational resources with opportunities. Effective strategies require regular review and adaptation as external conditions evolve and new information becomes available to decision makers.", category: 'business', difficulty: 'medium' },
  { text: "Financial management requires careful tracking of revenue, expenses, and cash flow to ensure business sustainability. Budgets provide a framework for resource allocation, while financial statements reveal the true health of an organization and guide strategic investment decisions.", category: 'business', difficulty: 'medium' },
  { text: "Negotiation is a fundamental business skill that involves understanding both parties' interests and finding mutually beneficial solutions. Successful negotiators prepare thoroughly, listen actively, and maintain professional relationships even when discussions become challenging or contentious.", category: 'business', difficulty: 'medium' },
  { text: "Supply chain management coordinates the flow of materials, information, and finances from suppliers through manufacturing to end customers. Efficient supply chains reduce costs, improve delivery times, and create competitive advantages in increasingly global markets.", category: 'business', difficulty: 'medium' },
  // BUSINESS - Hard
  { text: "Mergers and acquisitions require comprehensive due diligence encompassing financial analysis, cultural compatibility assessment, regulatory compliance review, and strategic alignment evaluation. Post-merger integration challenges frequently determine whether anticipated synergies materialize, as organizational cultures, systems, and processes must be harmonized while maintaining operational continuity and employee morale.", category: 'business', difficulty: 'hard' },
  { text: "Venture capital investment decisions involve evaluating market opportunity size, competitive positioning, team capabilities, and scalability potential under conditions of significant uncertainty. Portfolio theory suggests diversifying across multiple investments while concentrating resources in ventures demonstrating the strongest product-market fit and defensible technological advantages.", category: 'business', difficulty: 'hard' },

  // SCIENCE - Easy
  { text: "Plants need sunlight, water, and air to grow. They take in carbon dioxide and give out oxygen, which is what we breathe. Without plants, life on Earth would not be possible for humans or animals.", category: 'science', difficulty: 'easy' },
  { text: "The Earth goes around the Sun once every year. This journey, combined with the tilt of our planet, gives us the four seasons. Each season brings different weather and changes to nature.", category: 'science', difficulty: 'easy' },
  { text: "Water can be found in three forms: liquid, solid ice, and gas vapor. When water gets hot enough, it turns to steam. When it gets cold enough, it freezes into ice. This cycle never stops.", category: 'science', difficulty: 'easy' },
  { text: "The human body has over two hundred bones that give it shape and support muscles. Bones also protect important organs like the brain and heart. They grow and change throughout your entire life.", category: 'science', difficulty: 'easy' },
  // SCIENCE - Medium
  { text: "Photosynthesis is the process by which plants convert sunlight into chemical energy. Chlorophyll in leaf cells captures light energy and uses it to transform carbon dioxide and water into glucose and oxygen, sustaining virtually all life on Earth.", category: 'science', difficulty: 'medium' },
  { text: "The theory of plate tectonics explains how Earth's outer shell is divided into large plates that float on the mantle beneath. Their movement causes earthquakes, volcanic eruptions, and the formation of mountain ranges over millions of years.", category: 'science', difficulty: 'medium' },
  { text: "DNA contains the genetic instructions for building and maintaining living organisms. Its double helix structure, discovered by Watson and Crick, enables precise replication during cell division, ensuring that genetic information passes accurately from one generation to the next.", category: 'science', difficulty: 'medium' },
  { text: "Climate change results from increased greenhouse gases trapping heat in Earth's atmosphere. Rising temperatures affect weather patterns, sea levels, and ecosystems worldwide, requiring coordinated international efforts to reduce emissions and adapt to changing conditions.", category: 'science', difficulty: 'medium' },
  // SCIENCE - Hard
  { text: "Quantum entanglement describes a phenomenon where particles become correlated such that the quantum state of one instantly influences the other regardless of distance. This non-local correlation, which Einstein called spooky action at a distance, has been experimentally verified and forms the basis for emerging quantum communication technologies.", category: 'science', difficulty: 'hard' },
  { text: "CRISPR-Cas9 gene editing technology enables precise modification of DNA sequences by utilizing bacterial immune system components. Guide RNA directs the Cas9 enzyme to specific genomic locations where it creates targeted double-strand breaks, allowing researchers to insert, delete, or modify genetic material with unprecedented accuracy and efficiency.", category: 'science', difficulty: 'hard' },
];

export function getTexts(category: Category | 'random', difficulty: Difficulty): string[] {
  let filtered = texts;
  
  if (category !== 'random') {
    filtered = filtered.filter(t => t.category === category);
  }
  
  filtered = filtered.filter(t => t.difficulty === difficulty);
  
  return filtered.map(t => t.text);
}

export function getRandomText(category: Category | 'random', difficulty: Difficulty): string {
  const available = getTexts(category, difficulty);
  return available[Math.floor(Math.random() * available.length)];
}
