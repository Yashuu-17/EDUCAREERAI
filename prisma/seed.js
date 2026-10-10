const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Create Demo Student
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'student@btech.edu' },
    update: {
      name: 'Alex Johnson',
      college: 'National Institute of Technology',
      department: 'Computer Science (CSE)',
      yearSemester: '3rd Year / Semester 5 & 6',
      careerGoal: 'IT',
      skillLevel: 'Intermediate',
      preferredLanguage: 'English',
      streak: 7,
      lastActive: new Date(),
    },
    create: {
      name: 'Alex Johnson',
      email: 'student@btech.edu',
      password: hashedPassword,
      college: 'National Institute of Technology',
      department: 'Computer Science (CSE)',
      yearSemester: '3rd Year / Semester 5 & 6',
      careerGoal: 'IT',
      skillLevel: 'Intermediate',
      preferredLanguage: 'English',
      streak: 7,
      lastActive: new Date(),
    },
  });

  console.log('Seeded User:', user.email);

  // 2. Define Curated Courses across 5 Categories
  const initialCourses = [
    // Category A: Programming Languages
    {
      slug: 'python-mastery',
      title: 'Python for Engineers & AI',
      description: 'From syntax to data structures, OOP, file handling, and NumPy/Pandas scripting.',
      category: 'PROGRAMMING_LANGUAGES',
      department: 'CSE',
      domain: 'Programming',
      language: 'Python',
      level: 'Beginner',
      prerequisites: 'None',
      estimatedHours: 24,
      miniProject: 'Build a CLI Automated Student Grade & Placement Analytics Engine',
      modules: [
        {
          title: 'Module 1: Syntax, Control Flow & Data Structures',
          lessons: [
            { id: 'py-1', title: 'Python Setup, Variables & Dynamic Typing', durationMinutes: 25, isVideo: true, freeResourceUrl: 'https://docs.python.org/3/tutorial/', youtubeSearchQuery: 'Python full course Corey Schafer' },
            { id: 'py-2', title: 'Lists, Tuples, Sets & Dictionaries', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://realpython.com/python-data-structures/', youtubeSearchQuery: 'Python data structures Tech With Tim' },
            { id: 'py-3', title: 'Functions, Lambdas & List Comprehensions', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html', youtubeSearchQuery: 'Python functions list comprehension Chai aur Code' },
          ]
        },
        {
          title: 'Module 2: OOP & Engineering Libraries',
          lessons: [
            { id: 'py-4', title: 'Classes, Dunder Methods & Inheritance', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://realpython.com/python3-object-oriented-programming/', youtubeSearchQuery: 'Python OOP Corey Schafer' },
            { id: 'py-5', title: 'NumPy & Vectorized Math Operations', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://numpy.org/doc/stable/user/quickstart.html', youtubeSearchQuery: 'NumPy full course Keith Galli' },
          ]
        }
      ]
    },
    {
      slug: 'cpp-dsa',
      title: 'C++ Mastery & Competitive Programming',
      description: 'Pointers, memory layout, STL (Vectors, Maps, Sets), and core algorithm patterns.',
      category: 'PROGRAMMING_LANGUAGES',
      department: 'CSE',
      domain: 'DSA',
      language: 'C++',
      level: 'Intermediate',
      prerequisites: 'Basic logic',
      estimatedHours: 32,
      miniProject: 'Custom STL Vector & Cache Implementation with LRU Eviction',
      modules: [
        {
          title: 'Module 1: Memory Layout & Pointers',
          lessons: [
            { id: 'cpp-1', title: 'Pointers, References & Dynamic Memory Allocation', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://en.cppreference.com/w/cpp/language/pointer', youtubeSearchQuery: 'C++ pointers The Cherno' },
            { id: 'cpp-2', title: 'Modern C++: Smart Pointers (unique_ptr, shared_ptr)', durationMinutes: 25, isVideo: true, freeResourceUrl: 'https://en.cppreference.com/w/cpp/memory', youtubeSearchQuery: 'Smart pointers C++ The Cherno' },
          ]
        },
        {
          title: 'Module 2: Standard Template Library (STL)',
          lessons: [
            { id: 'cpp-3', title: 'Vectors, Deques & Iterators in Depth', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://en.cppreference.com/w/cpp/container/vector', youtubeSearchQuery: 'C++ STL Take U Forward Striver' },
            { id: 'cpp-4', title: 'Unordered Maps, Hash Sets & Binary Search STL', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://en.cppreference.com/w/cpp/container/unordered_map', youtubeSearchQuery: 'C++ STL Maps Sets Luv Love Babbar' },
          ]
        }
      ]
    },
    {
      slug: 'javascript-typescript',
      title: 'Modern JavaScript & TypeScript Architecture',
      description: 'Event loop, async/await, closures, prototypes, type generics, and interfaces.',
      category: 'PROGRAMMING_LANGUAGES',
      department: 'IT',
      domain: 'Web Development',
      language: 'JavaScript',
      level: 'Intermediate',
      prerequisites: 'Basic HTML/CSS',
      estimatedHours: 28,
      miniProject: 'Real-time Collaborative Task Board with Type-Safe State Machine',
      modules: [
        {
          title: 'Module 1: JS Engine & Async Execution',
          lessons: [
            { id: 'js-1', title: 'V8 Engine, Call Stack & Event Loop Mechanics', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://javascript.info/event-loop', youtubeSearchQuery: 'JavaScript Event loop Jake Archibald Traversy' },
            { id: 'js-2', title: 'Promises, Async/Await & Microtask Queue', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://javascript.info/async-await', youtubeSearchQuery: 'Async Await Web Dev Simplified' },
          ]
        },
        {
          title: 'Module 2: TypeScript Typing Mastery',
          lessons: [
            { id: 'js-3', title: 'Generics, Utility Types & Type Narrowing', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://www.typescriptlang.org/docs/handbook/2/generics.html', youtubeSearchQuery: 'TypeScript Generics The Net Ninja' },
          ]
        }
      ]
    },
    {
      slug: 'java-enterprise',
      title: 'Java 21 & Object-Oriented Design Patterns',
      description: 'JVM architecture, garbage collection, multithreading, collections framework, and Spring fundamentals.',
      category: 'PROGRAMMING_LANGUAGES',
      department: 'CSE',
      domain: 'Backend',
      language: 'Java',
      level: 'Intermediate',
      prerequisites: 'Basic programming',
      estimatedHours: 35,
      miniProject: 'Multi-threaded Banking Transaction Simulator with Concurrency Locks',
      modules: [
        {
          title: 'Module 1: Core Java & JVM',
          lessons: [
            { id: 'java-1', title: 'JVM Internals, Heap vs Stack & Garbage Collector', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://docs.oracle.com/javase/tutorial/', youtubeSearchQuery: 'JVM Architecture Telusko Kunal Kushwaha' },
            { id: 'java-2', title: 'Collections Framework (ArrayList, HashMap, ConcurrentHashMap)', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://docs.oracle.com/javase/8/docs/technotes/guides/collections/', youtubeSearchQuery: 'Java Collections Framework Amigoscode' },
          ]
        }
      ]
    },

    // Category B: AI / Data Domains
    {
      slug: 'machine-learning-engineering',
      title: 'Machine Learning: Theory to Production',
      description: 'Linear/Logistic regression, decision trees, random forests, SVM, gradient boosting, and scikit-learn.',
      category: 'AI_DATA',
      department: 'AI & ML',
      domain: 'Machine Learning',
      language: 'Python',
      level: 'Intermediate',
      prerequisites: 'Python, Linear Algebra',
      estimatedHours: 30,
      miniProject: 'End-to-End Placement Salary Prediction Pipeline with Streamlit & Docker',
      modules: [
        {
          title: 'Module 1: Supervised Learning & Loss Optimization',
          lessons: [
            { id: 'ml-1', title: 'Linear Regression & Cost Function (MSE)', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://scikit-learn.org/stable/modules/linear_model.html', youtubeSearchQuery: 'StatQuest Linear Regression Josh Starmer' },
            { id: 'ml-2', title: 'Gradient Descent Optimization & Learning Rates', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://ml-cheatsheet.readthedocs.io/en/latest/gradient_descent.html', youtubeSearchQuery: 'Gradient Descent 3Blue1Brown StatQuest' },
            { id: 'ml-3', title: 'Logistic Regression, ROC-AUC & Confusion Matrix', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://scikit-learn.org/stable/modules/model_evaluation.html', youtubeSearchQuery: 'Logistic Regression ROC AUC StatQuest' },
          ]
        },
        {
          title: 'Module 2: Ensembles & Feature Engineering',
          lessons: [
            { id: 'ml-4', title: 'Decision Trees, Random Forests & XGBoost', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://xgboost.readthedocs.io/en/stable/', youtubeSearchQuery: 'XGBoost Explained StatQuest CampusX' },
          ]
        }
      ]
    },
    {
      slug: 'deep-learning-transformers',
      title: 'Deep Learning, CNNs & Transformers',
      description: 'Backpropagation, PyTorch tensors, CNN architectures, self-attention, and LLM foundations.',
      category: 'AI_DATA',
      department: 'AI & ML',
      domain: 'Deep Learning',
      language: 'Python',
      level: 'Advanced',
      prerequisites: 'Machine Learning, Calculus',
      estimatedHours: 40,
      miniProject: 'Fine-tune a BERT / HuggingFace Model for Engineering Job Description Classifier',
      modules: [
        {
          title: 'Module 1: Neural Networks & PyTorch',
          lessons: [
            { id: 'dl-1', title: 'Feedforward Networks & Backprop Math', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://pytorch.org/tutorials/beginner/basics/intro.html', youtubeSearchQuery: 'Backpropagation Calculus 3Blue1Brown' },
            { id: 'dl-2', title: 'Convolutional Neural Networks (CNN) for Computer Vision', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://cs231n.github.io/convolutional-networks/', youtubeSearchQuery: 'CNN explained Stanford CS231n Andrew Ng' },
          ]
        },
        {
          title: 'Module 2: Transformers & Attention Mechanisms',
          lessons: [
            { id: 'dl-3', title: 'Self-Attention & Multi-Head Attention Mechanism', durationMinutes: 50, isVideo: true, freeResourceUrl: 'https://jalammar.github.io/illustrated-transformer/', youtubeSearchQuery: 'Transformers Andrej Karpathy Umar Jamil' },
          ]
        }
      ]
    },
    {
      slug: 'generative-ai-rag',
      title: 'Generative AI, LLMs & Retrieval Augmented Generation (RAG)',
      description: 'LangChain, LlamaIndex, vector databases (Chroma/Pinecone), prompt engineering, and agentic workflows.',
      category: 'AI_DATA',
      department: 'AI & ML',
      domain: 'GenAI',
      language: 'Python',
      level: 'Intermediate',
      prerequisites: 'Python basics',
      estimatedHours: 25,
      miniProject: 'Build a University Exam Syllabus RAG Assistant with PDF Vector Search',
      modules: [
        {
          title: 'Module 1: Vector Embeddings & Similarity Search',
          lessons: [
            { id: 'rag-1', title: 'Text Embeddings & Cosine Distance', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://platform.openai.com/docs/guides/embeddings', youtubeSearchQuery: 'Embeddings HuggingFace AssemblyAI' },
            { id: 'rag-2', title: 'Building a RAG Pipeline with LangChain & Vector DB', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://python.langchain.com/docs/tutorials/rag/', youtubeSearchQuery: 'LangChain RAG tutorial Krish Naik' },
          ]
        }
      ]
    },

    // Category C: Mathematics
    {
      slug: 'engineering-linear-algebra',
      title: 'Linear Algebra for Engineers & Machine Learning',
      description: 'Vector spaces, matrix decomposition, eigenvalues & eigenvectors, SVD, and PCA projection.',
      category: 'MATHEMATICS',
      department: 'CSE',
      domain: 'Mathematics',
      language: 'Math',
      level: 'Beginner',
      prerequisites: '10+2 Mathematics',
      estimatedHours: 18,
      miniProject: 'Eigenface Face Recognition & Image Compression using SVD',
      modules: [
        {
          title: 'Module 1: Vectors, Matrices & Transformations',
          lessons: [
            { id: 'la-1', title: 'Vectors as Linear Transformations', durationMinutes: 25, isVideo: true, freeResourceUrl: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', youtubeSearchQuery: 'Essence of Linear Algebra 3Blue1Brown' },
            { id: 'la-2', title: 'Eigenvalues and Eigenvectors Intuition', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://mathworld.wolfram.com/Eigenvalue.html', youtubeSearchQuery: 'Eigenvectors 3Blue1Brown Gilbert Strang' },
          ]
        }
      ]
    },
    {
      slug: 'probability-statistics-data',
      title: 'Probability & Inferential Statistics for Data Science',
      description: 'Bayes Theorem, probability distributions, hypothesis testing (p-value, t-test, ANOVA), and confidence intervals.',
      category: 'MATHEMATICS',
      department: 'Data Science',
      domain: 'Mathematics',
      language: 'Math',
      level: 'Intermediate',
      prerequisites: 'Basic math',
      estimatedHours: 20,
      miniProject: 'A/B Testing Simulator for Campus Placement Platform Click-Through Rates',
      modules: [
        {
          title: 'Module 1: Distributions & Bayes Rule',
          lessons: [
            { id: 'stat-1', title: 'Conditional Probability & Bayes Theorem', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://openstax.org/books/introductory-statistics/', youtubeSearchQuery: 'Bayes Theorem 3Blue1Brown Khan Academy' },
            { id: 'stat-2', title: 'Hypothesis Testing, p-values & Z-Scores', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://www.statisticshowto.com/p-value/', youtubeSearchQuery: 'p-values explained StatQuest' },
          ]
        }
      ]
    },

    // Category D: B.Tech Department Courses
    {
      slug: 'btech-cse-core',
      title: 'CSE Core: Operating Systems & DBMS Architecture',
      description: 'Process scheduling, deadlocks, virtual memory, SQL indexing, ACID transactions, and normalization.',
      category: 'BTECH_DEPARTMENTS',
      department: 'CSE',
      domain: 'Core Computer Science',
      language: 'C / SQL',
      level: 'Intermediate',
      prerequisites: 'C Basics',
      estimatedHours: 35,
      miniProject: 'Mini Relational B+ Tree Index Engine in C/C++',
      modules: [
        {
          title: 'Module 1: Operating Systems Internals',
          lessons: [
            { id: 'cse-1', title: 'CPU Scheduling Algorithms & Deadlock Banker Algorithm', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', youtubeSearchQuery: 'Operating Systems Gate Smashers Neso Academy' },
            { id: 'cse-2', title: 'Paging, TLB & Virtual Memory Management', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf', youtubeSearchQuery: 'Virtual Memory Paging Gate Smashers' },
          ]
        },
        {
          title: 'Module 2: DBMS & Relational Architecture',
          lessons: [
            { id: 'cse-3', title: 'B-Trees, B+ Trees & Database Indexing', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://use-the-index-luke.com/', youtubeSearchQuery: 'DBMS Indexing B+ Tree Gate Smashers' },
            { id: 'cse-4', title: 'ACID Properties, Concurrency Control & 2PL', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://en.wikipedia.org/wiki/ACID', youtubeSearchQuery: 'DBMS Transactions 2PL Gate Smashers' },
          ]
        }
      ]
    },
    {
      slug: 'btech-ece-signals-vlsi',
      title: 'ECE Core: Signals, Systems & VLSI Digital Design',
      description: 'Fourier transform, Laplace, Z-transform, CMOS logic, Verilog HDL basics, and ASIC design flow.',
      category: 'BTECH_DEPARTMENTS',
      department: 'ECE',
      domain: 'Electronics',
      language: 'Verilog',
      level: 'Intermediate',
      prerequisites: 'Basic Circuit Theory',
      estimatedHours: 30,
      miniProject: 'Verilog 8-bit ALU Design and Simulation with ModelSim',
      modules: [
        {
          title: 'Module 1: Signals & Systems',
          lessons: [
            { id: 'ece-1', title: 'Continuous-Time Fourier Transform & Sampling Theorem', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/117104074', youtubeSearchQuery: 'Signals and Systems Neso Academy' },
            { id: 'ece-2', title: 'Laplace Transform & Region of Convergence (ROC)', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/108104100', youtubeSearchQuery: 'Laplace Transform Neso Academy' },
          ]
        },
        {
          title: 'Module 2: VLSI Design & Verilog',
          lessons: [
            { id: 'ece-3', title: 'CMOS Inverter Characteristics & Stick Diagrams', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://www.vlsiguide.com/', youtubeSearchQuery: 'VLSI CMOS Inverter Neso Academy Ekeeda' },
            { id: 'ece-4', title: 'Verilog HDL Combinational & Sequential Circuits', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://www.chipverify.com/verilog/verilog-tutorial', youtubeSearchQuery: 'Verilog HDL tutorial Neso Academy' },
          ]
        }
      ]
    },
    {
      slug: 'btech-mech-thermal-design',
      title: 'Mechanical Core: Thermodynamics, Fluid Mechanics & CAD/CAM',
      description: 'Carnot cycle, Otto vs Diesel cycle, Navier-Stokes, stress-strain tensors, SolidWorks modeling, and ANSYS FEA.',
      category: 'BTECH_DEPARTMENTS',
      department: 'Mechanical',
      domain: 'Mechanical Engineering',
      language: 'CAD / FEA',
      level: 'Intermediate',
      prerequisites: 'Engineering Physics',
      estimatedHours: 32,
      miniProject: 'Finite Element Analysis (FEA) of a Cantilever Bracket under Dynamic Stress',
      modules: [
        {
          title: 'Module 1: Thermodynamics & IC Engines',
          lessons: [
            { id: 'mech-1', title: 'First & Second Laws of Thermodynamics and Entropy', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/112105123', youtubeSearchQuery: 'Thermodynamics Learn Engineering NPTEL' },
            { id: 'mech-2', title: 'Otto, Diesel & Dual Cycles Comparison', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://www.grc.nasa.gov/www/k-12/airplane/diesel.html', youtubeSearchQuery: 'Otto vs Diesel Cycle The Efficient Engineer' },
          ]
        },
        {
          title: 'Module 2: Strength of Materials & CAD',
          lessons: [
            { id: 'mech-3', title: 'Stress-Strain Curve & Mohr Circle of Stress', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/112107146', youtubeSearchQuery: 'Mohrs circle The Efficient Engineer' },
          ]
        }
      ]
    },
    {
      slug: 'btech-civil-structural',
      title: 'Civil Core: Structural Analysis, Concrete Tech & Geotech',
      description: 'Bending moment & shear force diagrams, limit state design of RCC, soil consolidation, and AutoCAD/STAAD.Pro.',
      category: 'BTECH_DEPARTMENTS',
      department: 'Civil',
      domain: 'Civil Engineering',
      language: 'STAAD / AutoCAD',
      level: 'Intermediate',
      prerequisites: 'Engineering Mechanics',
      estimatedHours: 30,
      miniProject: 'Structural Design of G+3 Residential RCC Building using STAAD.Pro',
      modules: [
        {
          title: 'Module 1: Structural Mechanics',
          lessons: [
            { id: 'civ-1', title: 'Shear Force & Bending Moment Diagrams (SFD/BMD)', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/105101082', youtubeSearchQuery: 'SFD BMD The Efficient Engineer NPTEL' },
            { id: 'civ-2', title: 'RCC Limit State Method & Singly Reinforced Beams', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/105105105', youtubeSearchQuery: 'RCC Design Civil Engineering Academy' },
          ]
        }
      ]
    },
    {
      slug: 'btech-eee-power-machines',
      title: 'EEE Core: Electric Machines, Power Systems & Renewable Energy',
      description: 'Transformers, induction & synchronous motors, transmission lines, power electronics inverters, and EV drives.',
      category: 'BTECH_DEPARTMENTS',
      department: 'EEE',
      domain: 'Electrical Engineering',
      language: 'MATLAB / Simulink',
      level: 'Intermediate',
      prerequisites: 'Basic Electrical Engg',
      estimatedHours: 32,
      miniProject: 'MATLAB Simulink Model of Solar PV Grid-Tied Inverter with MPPT',
      modules: [
        {
          title: 'Module 1: Transformers & AC Machines',
          lessons: [
            { id: 'eee-1', title: 'Single-Phase Transformer Equivalent Circuit & OC/SC Tests', durationMinutes: 40, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/108105017', youtubeSearchQuery: 'Transformer equivalent circuit Neso Academy' },
            { id: 'eee-2', title: 'Three-Phase Induction Motor Torque-Speed Characteristics', durationMinutes: 45, isVideo: true, freeResourceUrl: 'https://nptel.ac.in/courses/108106072', youtubeSearchQuery: 'Induction Motor Torque Speed Learn Engineering' },
          ]
        }
      ]
    },

    // Category E: Career & Soft Skills
    {
      slug: 'campus-aptitude-mastery',
      title: 'Campus Placements: Quantitative, Logical & Verbal Aptitude',
      description: 'Percentages, ratios, time & work, syllogisms, blood relations, reading comprehension, and speed math shortcuts.',
      category: 'CAREER_SOFT_SKILLS',
      department: 'All Departments',
      domain: 'Placements',
      language: 'English',
      level: 'Beginner',
      prerequisites: 'None',
      estimatedHours: 20,
      miniProject: 'Full-length 60-question Placement Simulation Test with Instant Analytics',
      modules: [
        {
          title: 'Module 1: Quantitative Aptitude Speed Math',
          lessons: [
            { id: 'apt-1', title: 'Percentages, Profit & Loss Shortcuts', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://www.indiabix.com/aptitude/questions-and-answers/', youtubeSearchQuery: 'Quantitative Aptitude CareerRide Rahul Tiwari' },
            { id: 'apt-2', title: 'Time, Speed, Distance & Work Pipes Formulas', durationMinutes: 35, isVideo: true, freeResourceUrl: 'https://www.indiabix.com/aptitude/time-and-distance/', youtubeSearchQuery: 'Time and work aptitude CareerRide' },
          ]
        },
        {
          title: 'Module 2: Logical Reasoning & HR Verbal',
          lessons: [
            { id: 'apt-3', title: 'Blood Relations, Direction Sense & Syllogisms', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/', youtubeSearchQuery: 'Logical Reasoning Gate Smashers CareerRide' },
          ]
        }
      ]
    },
    {
      slug: 'hr-interview-soft-skills',
      title: 'HR & Behavioral Interview Prep (STAR Method)',
      description: 'Tell me about yourself, strengths/weaknesses, behavioral questions, salary negotiation, and executive presence.',
      category: 'CAREER_SOFT_SKILLS',
      department: 'All Departments',
      domain: 'Career & HR',
      language: 'English',
      level: 'Beginner',
      prerequisites: 'None',
      estimatedHours: 12,
      miniProject: 'Record & Refine Your 90-second Elevator Pitch & STAR Behavioral Stories',
      modules: [
        {
          title: 'Module 1: The First Impression & Self Introduction',
          lessons: [
            { id: 'hr-1', title: 'Crafting the 90-Second "Tell Me About Yourself" Pitch', durationMinutes: 25, isVideo: true, freeResourceUrl: 'https://hbr.org/2021/05/how-to-answer-tell-me-about-yourself', youtubeSearchQuery: 'Tell me about yourself interview Apna College Jenny' },
            { id: 'hr-2', title: 'The STAR Method (Situation, Task, Action, Result)', durationMinutes: 30, isVideo: true, freeResourceUrl: 'https://www.themuse.com/advice/star-interview-method', youtubeSearchQuery: 'STAR interview method examples CareerVidz' },
          ]
        }
      ]
    }
  ];

  for (const c of initialCourses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        description: c.description,
        category: c.category,
        department: c.department,
        domain: c.domain,
        language: c.language,
        level: c.level,
        prerequisites: c.prerequisites,
        estimatedHours: c.estimatedHours,
        miniProject: c.miniProject,
        modulesJson: JSON.stringify(c.modules),
      },
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.category,
        department: c.department,
        domain: c.domain,
        language: c.language,
        level: c.level,
        prerequisites: c.prerequisites,
        estimatedHours: c.estimatedHours,
        miniProject: c.miniProject,
        modulesJson: JSON.stringify(c.modules),
      },
    });
  }

  console.log(`Seeded ${initialCourses.length} Comprehensive Courses across all 5 domains.`);

  // 3. Seed Course Enrollments for the Demo User
  const allCourses = await prisma.course.findMany();
  const pythonCourse = allCourses.find(c => c.slug === 'python-mastery');
  const mlCourse = allCourses.find(c => c.slug === 'machine-learning-engineering');
  const cseCourse = allCourses.find(c => c.slug === 'btech-cse-core');
  const aptCourse = allCourses.find(c => c.slug === 'campus-aptitude-mastery');

  if (pythonCourse) {
    await prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: pythonCourse.id } },
      update: { progressPercent: 75 },
      create: { userId: user.id, courseId: pythonCourse.id, progressPercent: 75 },
    });
    // Mark lessons completed
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-1' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-1', completed: true, isWatched: true },
    });
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-2' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-2', completed: true, isWatched: true },
    });
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-3' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: pythonCourse.id, lessonId: 'py-3', completed: true, isWatched: true },
    });
  }

  if (mlCourse) {
    await prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: mlCourse.id } },
      update: { progressPercent: 50 },
      create: { userId: user.id, courseId: mlCourse.id, progressPercent: 50 },
    });
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: mlCourse.id, lessonId: 'ml-1' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: mlCourse.id, lessonId: 'ml-1', completed: true, isWatched: true },
    });
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: mlCourse.id, lessonId: 'ml-2' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: mlCourse.id, lessonId: 'ml-2', completed: true, isWatched: true },
    });
  }

  if (cseCourse) {
    await prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: cseCourse.id } },
      update: { progressPercent: 40 },
      create: { userId: user.id, courseId: cseCourse.id, progressPercent: 40 },
    });
    await prisma.lessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId: user.id, courseId: cseCourse.id, lessonId: 'cse-1' } },
      update: { completed: true, isWatched: true },
      create: { userId: user.id, courseId: cseCourse.id, lessonId: 'cse-1', completed: true, isWatched: true },
    });
  }

  if (aptCourse) {
    await prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: aptCourse.id } },
      update: { progressPercent: 60 },
      create: { userId: user.id, courseId: aptCourse.id, progressPercent: 60 },
    });
  }

  // 4. Seed Daily Activity Data for Heatmap & 30-Day Line Charts
  console.log('Seeding 30-day activity logs for GitHub Heatmap & Charts...');
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Simulate realistic learning activity with higher activity on recent days
    const isRestDay = i % 5 === 0 && i > 10;
    const minutes = isRestDay ? 0 : Math.floor(35 + Math.sin(i) * 25 + (30 - i) * 2.5);
    const lessons = isRestDay ? 0 : Math.max(1, Math.floor(minutes / 28));
    const quizzes = isRestDay ? 0 : (i % 3 === 0 ? 1 : 0);

    await prisma.dailyActivity.upsert({
      where: { userId_date: { userId: user.id, date: dateStr } },
      update: {
        minutesSpent: Math.max(10, minutes),
        lessonsCompleted: lessons,
        quizzesTaken: quizzes,
        score: quizzes > 0 ? 85 : 0,
      },
      create: {
        userId: user.id,
        date: dateStr,
        minutesSpent: Math.max(10, minutes),
        lessonsCompleted: lessons,
        quizzesTaken: quizzes,
        score: quizzes > 0 ? 85 : 0,
      },
    });
  }

  // 5. Seed Sample Quiz Attempts
  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      category: 'PROGRAMMING',
      topic: 'Python Foundations & Data Structures',
      score: 9,
      totalQuestions: 10,
      percentage: 90.0,
      weakTopics: JSON.stringify(['Generators & Yield']),
      wrongAnswers: JSON.stringify([{ question: 'What is the memory benefit of a Python generator?', yourAnswer: 'Faster CPU execution', correctAnswer: 'Lazy evaluation saves memory by yielding items one at a time' }]),
    },
  });

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      category: 'AI_ML',
      topic: 'Machine Learning & Loss Functions',
      score: 8,
      totalQuestions: 10,
      percentage: 80.0,
      weakTopics: JSON.stringify(['Overfitting vs Regularization (L1/L2)']),
      wrongAnswers: JSON.stringify([{ question: 'What does L1 Lasso regularization do?', yourAnswer: 'Squares the weights', correctAnswer: 'Adds absolute value penalty, producing sparse weights' }]),
    },
  });

  // 6. Seed Sample Roadmap Progress
  await prisma.roadmapProgress.upsert({
    where: { userId_roadmapSlug: { userId: user.id, roadmapSlug: 'ai-ml-engineer' } },
    update: {
      completedNodes: JSON.stringify(['python-basics', 'linear-algebra', 'eda-pandas', 'sklearn-models']),
      progressPercent: 45.0,
    },
    create: {
      userId: user.id,
      roadmapSlug: 'ai-ml-engineer',
      completedNodes: JSON.stringify(['python-basics', 'linear-algebra', 'eda-pandas', 'sklearn-models']),
      progressPercent: 45.0,
    },
  });

  // 7. Seed Sample Resume
  await prisma.resume.upsert({
    where: { id: 'demo-alex-resume' },
    update: {},
    create: {
      id: 'demo-alex-resume',
      userId: user.id,
      title: 'Alex Johnson - Software & ML Fresher Resume',
      targetRole: 'Software Developer / AI Engineer',
      templateId: 'modern-ats',
      resumeData: JSON.stringify({
        personal: {
          fullName: 'Alex Johnson',
          email: 'student@btech.edu',
          phone: '+91 98765 43210',
          location: 'Hyderabad, India',
          linkedin: 'https://linkedin.com/in/alex-johnson-demo',
          github: 'https://github.com/alexjohnson-tech',
        },
        summary: 'Proactive 3rd-year B.Tech CSE student with strong foundations in Python, C++, Data Structures, and Machine Learning. Built end-to-end fullstack AI platforms and demonstrated 90%+ accuracy in predictive models.',
        education: [
          {
            institution: 'National Institute of Technology',
            degree: 'B.Tech in Computer Science & Engineering',
            year: '2023 - 2027',
            cgpa: '8.8 / 10.0',
          }
        ],
        skills: ['Python', 'C++', 'JavaScript', 'SQL', 'FastAPI', 'Next.js', 'PyTorch', 'Scikit-Learn', 'Git', 'Docker'],
        projects: [
          {
            title: 'AI-Powered Placement & Curriculum Analytics Platform',
            technologies: 'Next.js, Node.js, Prisma SQLite, Gemini AI',
            bullets: [
              'Developed an intelligent learning OS serving 50+ programming courses and B.Tech branch roadmaps.',
              'Integrated ATS resume parser and real-time quiz assessment engine with instant feedback.',
            ]
          }
        ],
        certifications: ['DeepLearning.AI Machine Learning Specialization', 'HackerRank Problem Solving (5-Star)'],
      }),
    },
  });

  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
