import { Injectable } from '@angular/core';
import {
  ArchitectureNode,
  ErpStageItem,
  ExperienceItem,
  MobileFeatureItem,
  PaymentStageItem,
  ProjectItem,
  SkillCategoryGroup,
  WorldId
} from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  readonly profile = {
    name: 'Rishu Katiyar',
    role: 'Full Stack Developer',
    experienceYears: '2+',
    tagline: 'I build modern web, mobile, and cloud software systems.',
    primaryStack: ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'Azure'],
    additionalStack: ['Ionic', 'Capacitor', 'Dapper', 'Firebase', 'Three.js', 'GSAP', 'Docker', 'GitHub Actions', 'CI/CD', 'AWS', 'SCSS'],
    website: 'https://rishukatiyar.pp.ua',
    websiteDisplay: 'rishukatiyar.pp.ua',
    github: 'https://github.com/rishukatiyar001',
    linkedin: 'https://www.linkedin.com/in/rishu-katiyar-086757233/',
    email: 'rishukatiyar001@gmail.com',
    location: 'India',
    availability: 'Open to High-Impact Engineering Roles',
    summary: 'Full Stack Developer with 2+ years of hands-on production experience designing, engineering, and scaling resilient web applications, cross-platform mobile apps, and enterprise backends. Specialized in Angular, ASP.NET Core, C#, SQL Server, and Microsoft Azure, with deep expertise in payment integrations, ERP/meter billing workflows, and modern cloud deployment pipelines.'
  };

  readonly worlds: Array<{ id: WorldId; label: string; number: string; icon: string; description: string }> = [
    { id: 'workspace', label: 'WORKSTATION', number: '01', icon: 'terminal', description: 'Central developer command center & primary workstation' },
    { id: 'architecture', label: 'ARCHITECTURE', number: '02', icon: 'layers', description: 'Interactive end-to-end full stack architecture flow' },
    { id: 'erp', label: 'ERP / SMART GRID', number: '03', icon: 'zap', description: 'Living digital smart city & automated meter billing engine' },
    { id: 'payments', label: 'PAYMENTS', number: '04', icon: 'shield-check', description: 'Cryptographic payment gateway & deep-link tunnel' },
    { id: 'mobile', label: 'MOBILE ENGINE', number: '05', icon: 'smartphone', description: 'Cross-platform Ionic & Capacitor device ecosystem' },
    { id: 'cloud', label: 'CLOUD & DEVOPS', number: '06', icon: 'cloud', description: 'Docker, GitHub Actions CI/CD & Azure deployment telemetry' },
    { id: 'projects', label: 'PROJECT UNIVERSE', number: '07', icon: 'grid', description: 'Nine featured production & engineering systems' },
    { id: 'skills', label: 'SKILLS CONSTELLATION', number: '08', icon: 'cpu', description: 'Curated technical competency matrix & stack breakdown' },
    { id: 'experience', label: 'EXPERIENCE', number: '09', icon: 'clock', description: 'Chronological timeline of enterprise engineering delivery' },
    { id: 'contact', label: 'COMMUNICATIONS', number: '10', icon: 'send', description: 'Direct contact terminal, social links & resume download' }
  ];

  readonly projects: ProjectItem[] = [
    {
      id: 'erp-meter-billing',
      title: 'ERP & Smart Meter Billing System',
      subtitle: 'Enterprise Smart Grid Energy Meter & Consumer Billing Suite',
      category: 'Enterprise / Smart Grid',
      technologies: ['Angular', 'Ionic', 'Capacitor', 'ASP.NET Core', 'Dapper', 'SQL Server', 'Azure'],
      description: 'End-to-end automated smart energy meter billing and consumer recharge platform. Consumes telemetry readings from smart electric meters, calculates dynamic tariff structures, generates automated monthly statements, and powers real-time consumer mobile recharges via unified customer and admin portals.',
      role: 'Full Stack Developer — architected the customer portal, developed high-throughput Dapper stored procedure integrations, implemented automated billing calculation pipelines, and built cross-platform mobile recharge views.',
      architectureHighlights: [
        'High-performance SQL Server stored procedures tuned with Dapper for microsecond tariff calculations',
        'Dual portal architecture: web management console (Angular) and customer self-service app (Ionic / Capacitor)',
        'Resilient payment and recharge verification with immediate meter quota updating',
        'Role-based authorization and granular billing ledger audit logs'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      liveUrl: 'https://rishukatiyar.pp.ua',
      status: 'Production',
      color: '#00eaff'
    },
    {
      id: 'icici-payment-integration',
      title: 'ICICI Payment Gateway Integration',
      subtitle: 'Cryptographic Transaction Engine with HMAC SHA256 & Deep Linking',
      category: 'FinTech / Payments',
      technologies: ['ASP.NET Core', 'C#', 'HMAC SHA256', 'Angular', 'Ionic', 'Capacitor', 'SQL Server'],
      description: 'Production-grade financial payment gateway integration for ICICI bank. Implements strict HMAC SHA256 cryptographic payload signing, request hashing, double-entry transaction ledgering, asynchronous webhooks/callbacks verification, and seamless mobile deep linking back into Android and iOS native wrappers.',
      role: 'Backend & Mobile Integration Lead — built the C# cryptographic signing pipeline, idempotent webhook handling, transaction reconciliation worker, and Capacitor deep-linking listener.',
      architectureHighlights: [
        'Cryptographic HMAC SHA256 signature generation & tamper validation for merchant payloads',
        'Idempotent callback controller preventing duplicate debit/credit race conditions',
        'Mobile deep link dispatch (myapp://payment-result) across Android and iOS Capacitor runtimes',
        'Encrypted transaction parameter storage with full audit traceability'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Production',
      color: '#7c3cff'
    },
    {
      id: 'online-course-platform',
      title: 'Online Course & Learning Platform',
      subtitle: 'Comprehensive E-Learning Management & Video Streaming Hub',
      category: 'Full Stack Web',
      technologies: ['Angular', 'TypeScript', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'Azure Blob'],
      description: 'Scalable e-learning portal facilitating course discovery, interactive lesson progression, video streaming, quizzes, and digital certificate issuing. Engineered with modular Angular frontend components and a robust ASP.NET Core REST backend.',
      role: 'Full Stack Developer — built responsive course player interfaces, user progress tracking microservices, and secure media token delivery.',
      architectureHighlights: [
        'Modular lazy-loaded Angular architecture with reactive RxJS state management',
        'Secure video asset delivery using timed SAS tokens via Azure Blob Storage',
        'Student completion tracking and real-time quiz assessment scoring engine'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Featured',
      color: '#00ffa3'
    },
    {
      id: 'taskmanager-pro',
      title: 'TaskManager Pro',
      subtitle: 'Collaborative Kanban & Workflow Orchestration System',
      category: 'Productivity / Utility',
      technologies: ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'SCSS'],
      description: 'High-efficiency sprint management and workflow tracking platform featuring drag-and-drop Kanban boards, team swimlanes, deadline prioritization, and real-time task status updates across multi-department teams.',
      role: 'Lead Developer — built the interactive drag-drop interface, optimized SQL querying for multi-member workspace permissions, and implemented notification triggers.',
      architectureHighlights: [
        'Optimistic UI state updates for instant drag-and-drop user feedback',
        'Hierarchical project permissions (Admin, Member, Reviewer, Guest)',
        'Lightweight REST API with Dapper data access layer for high-speed queries'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Completed',
      color: '#ffd000'
    },
    {
      id: 'ecommerce-platform',
      title: 'Full Stack E-Commerce Platform',
      subtitle: 'Scalable Multi-Category Online Retail Application',
      category: 'Full Stack Web',
      technologies: ['Angular', 'ASP.NET Core', 'C#', 'SQL Server', 'SCSS', 'Docker'],
      description: 'End-to-end modern digital retail application featuring structured catalog navigation, multifaceted search and filtering, reactive cart state, checkout order lifecycle, and merchant administration dashboard.',
      role: 'Full Stack Developer — engineered client-side cart stores, checkout form validation, inventory synchronization API, and SQL transaction handling.',
      architectureHighlights: [
        'ACID-compliant order placement using database transactions to prevent inventory overselling',
        'Client-side cart persistence with server reconciliation upon customer authentication',
        'Docker containerized deployment ready for staging and production hosting'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Completed',
      color: '#ff4d6d'
    },
    {
      id: 'portfolio-builder-3d',
      title: '3D Interactive Developer OS Portfolio',
      subtitle: 'Cinematic WebGL & Three.js Developer Laboratory',
      category: 'Full Stack Web',
      technologies: ['Angular', 'Three.js', 'TypeScript', 'GSAP', 'SCSS', 'SSR / SSG'],
      description: 'An original 3D digital laboratory and workstation built specifically to showcase real full stack engineering capabilities. Features programmatic 3D procedural scenes, smooth GSAP camera choreography, WebGL lighting, real-time particle streams, and SSR safety.',
      role: 'Sole Architect & Creative Developer — designed the 3D procedural models, camera orchestration system, responsive touch controls, and high-speed recruiter shortcut mode.',
      architectureHighlights: [
        'Zero external heavy 3D model dependencies — built using procedural Three.js geometries for instant load times',
        'Full Angular SSR / SSG compatibility with strict platform browser guards',
        'Device capability detection with dynamic DPR and particle tier throttling'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      liveUrl: 'https://rishukatiyar.pp.ua',
      status: 'Live',
      color: '#00eaff'
    },
    {
      id: 'fake-news-classification',
      title: 'Fake News Classification Engine',
      subtitle: 'NLP Text Analysis & Misinformation Detector',
      category: 'AI / Machine Learning',
      technologies: ['Python', 'Scikit-Learn', 'TF-IDF', 'NLP', 'Pandas'],
      description: 'Natural Language Processing pipeline that evaluates news article authenticity. Preprocesses textual data via tokenization, stopword removal, and TF-IDF vectorization, followed by supervised classification algorithms to flag misleading journalism.',
      role: 'ML Developer — built the data cleaning pipeline, extracted feature vectors, trained PassiveAggressive and Logistic Regression models, and evaluated precision/recall metrics.',
      architectureHighlights: [
        'TF-IDF n-gram feature extraction capturing contextual phrasing nuances',
        'Over 93% classification accuracy on benchmark validation datasets',
        'Exportable model inference script ready for integration into web services'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Completed',
      color: '#a78bfa'
    },
    {
      id: 'credit-card-fraud-detection',
      title: 'Credit Card Fraud Detection',
      subtitle: 'High-Precision Financial Anomaly Detection System',
      category: 'AI / Machine Learning',
      technologies: ['Python', 'Scikit-Learn', 'Imbalanced-Learn', 'SMOTE', 'Random Forest'],
      description: 'Machine learning system designed to detect fraudulent credit card transactions within extremely imbalanced datasets. Utilizes SMOTE oversampling and ensemble models to maximize fraud recall while minimizing false positives for legitimate cardholders.',
      role: 'ML Engineer — implemented exploratory data analysis, class imbalance mitigation via SMOTE, hyperparameter optimization, and ROC-AUC evaluation.',
      architectureHighlights: [
        'SMOTE technique addressing severe 99.8% to 0.2% class distribution imbalance',
        'Optimized decision threshold minimizing financial fraud leakage risk',
        'Confusion matrix optimization focused on high recall and minimal false alarms'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Completed',
      color: '#fb7185'
    },
    {
      id: 'movie-recommendation-system',
      title: 'Movie Recommendation System',
      subtitle: 'Personalized Collaborative & Content-Based Cinema Engine',
      category: 'AI / Machine Learning',
      technologies: ['Python', 'Cosine Similarity', 'Pandas', 'NumPy', 'Flask'],
      description: 'Personalized cinema discovery engine combining content-based metadata filtering (genres, cast, keywords) and collaborative user rating similarity matrices to suggest tailored titles.',
      role: 'Developer — engineered similarity distance functions, feature encoding matrices, and rapid recommendation retrieval algorithms.',
      architectureHighlights: [
        'Cosine similarity calculation across multi-dimensional feature embeddings',
        'Fast top-N recommendation matrix lookups',
        'Modular scoring allowing blended weighting between genres and past user rating history'
      ],
      githubUrl: 'https://github.com/rishukatiyar001',
      status: 'Completed',
      color: '#38bdf8'
    }
  ];

  readonly architectureNodes: ArchitectureNode[] = [
    {
      id: 'client',
      tier: 1,
      name: 'Client Application Layer',
      technology: 'Angular 14-21 & Ionic / Capacitor',
      category: 'Frontend & Mobile',
      description: 'High-performance Single Page Applications (Angular) and cross-platform native wrappers (Ionic / Capacitor for Android & iOS). Features responsive component architecture, reactive RxJS data streams, and offline caching.',
      howUsedByRishu: 'Rishu develops responsive enterprise interfaces, consumer customer portals, and field agent utility apps with shared TypeScript models and strict type safety.',
      color: '#dd0031',
      requestOrder: 1,
      responseOrder: 7,
      codeSnippet: `// Angular Service / Client Request\nthis.http.post<ApiResponse<BillSummary>>('/api/billing/calculate', payload)\n  .pipe(\n    map(res => res.data),\n    catchError(this.handleError)\n  );`
    },
    {
      id: 'api-gateway',
      tier: 2,
      name: 'ASP.NET Core Web API',
      technology: 'ASP.NET Core / C# (.NET 8/9)',
      category: 'API & Gateway',
      description: 'RESTful API controllers providing secure endpoints, rate limiting, request validation, JWT authentication, and standardized JSON responses.',
      howUsedByRishu: 'Designs REST APIs with clean dependency injection, attribute-based routing, global exception handling middleware, and CORS security policies.',
      color: '#512bd4',
      requestOrder: 2,
      responseOrder: 6,
      codeSnippet: `[ApiController]\n[Route("api/[controller]")]\n[Authorize]\npublic class MeterBillingController : ControllerBase {\n  private readonly IBillingService _billingService;\n  public MeterBillingController(IBillingService svc) => _billingService = svc;\n}`
    },
    {
      id: 'business-logic',
      tier: 3,
      name: 'Business Logic & Domain Layer',
      technology: 'C# Clean Architecture Services',
      category: 'Core Logic',
      description: 'Encapsulates complex business rules, dynamic tariff calculations, cryptographic verification (HMAC SHA256), and transaction validation.',
      howUsedByRishu: 'Implements business rules independently from UI and database concerns, enabling comprehensive unit testing and easy maintenance.',
      color: '#00d9ff',
      requestOrder: 3,
      responseOrder: 5,
      codeSnippet: `public async Task<BillResult> ProcessMeterTariffAsync(MeterReading reading) {\n  var tariff = await _tariffRepo.GetActiveTariffAsync(reading.MeterType);\n  var calculatedUnits = Math.Max(0, reading.CurrentKwh - reading.PreviousKwh);\n  return tariff.ApplyCalculation(calculatedUnits);\n}`
    },
    {
      id: 'data-access',
      tier: 4,
      name: 'Data Access Layer (Dapper ORM)',
      technology: 'Dapper Micro-ORM & ADO.NET',
      category: 'Data Access',
      description: 'High-performance object-relational mapping utilizing Dapper for direct SQL execution, microsecond query hydration, and parameterized queries.',
      howUsedByRishu: 'Leverages Dapper for performance-critical smart grid telemetry pipelines and high-volume billing runs where EF overhead must be avoided.',
      color: '#ffd000',
      requestOrder: 4,
      responseOrder: 4,
      codeSnippet: `using var connection = new SqlConnection(_connectionString);\nvar sql = "EXEC sp_ProcessSmartMeterRecharge @MeterId, @Amount, @TxnHash";\nreturn await connection.QuerySingleAsync<RechargeResult>(sql, new { MeterId, Amount, TxnHash });`
    },
    {
      id: 'database',
      tier: 5,
      name: 'Relational Database Layer',
      technology: 'Microsoft SQL Server',
      category: 'Persistence',
      description: 'Enterprise relational database storing normalized schemas, meter telemetry logs, customer ledgers, transaction records, and stored procedures.',
      howUsedByRishu: 'Designs indexed tables, complex analytical views, ACID transaction scripts, and stored procedures optimized for high concurrency.',
      color: '#cc292b',
      requestOrder: 5,
      responseOrder: 3,
      codeSnippet: `CREATE PROCEDURE sp_GenerateMonthlyBill\n  @ConsumerId INT, @BillingMonth DATE\nAS BEGIN\n  SET NOCOUNT ON;\n  BEGIN TRANSACTION;\n    -- Automated Tariff & Surcharge Calculation\n  COMMIT TRANSACTION;\nEND;`
    },
    {
      id: 'cloud-infrastructure',
      tier: 6,
      name: 'Cloud Infrastructure',
      technology: 'Microsoft Azure (App Services, SQL, Blob)',
      category: 'Cloud Services',
      description: 'Managed enterprise cloud hosting providing auto-scaling web apps, Azure SQL Managed Databases, secure Key Vaults, and Blob storage.',
      howUsedByRishu: 'Configures application settings, manages connection strings securely in Azure, and monitors health telemetry via Application Insights.',
      color: '#0078d4',
      requestOrder: 6,
      responseOrder: 2,
      codeSnippet: `// Azure Application Telemetry & Configuration\nbuilder.Services.AddApplicationInsightsTelemetry();\nbuilder.Configuration.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());`
    },
    {
      id: 'devops-ci-cd',
      tier: 7,
      name: 'DevOps & Deployment Pipeline',
      technology: 'Docker, GitHub Actions, CI/CD',
      category: 'DevOps',
      description: 'Automated continuous integration and continuous deployment pipelines validating test suites, building Docker images, and deploying to staging/production.',
      howUsedByRishu: 'Authors GitHub Actions workflows that trigger on pull requests, run linting and compilation checks, and automate container builds.',
      color: '#2ea44f',
      requestOrder: 7,
      responseOrder: 1,
      codeSnippet: `name: Deploy to Azure\non: [push]\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: dotnet build --configuration Release\n      - run: ng build --configuration production`
    }
  ];

  readonly skillCategories: SkillCategoryGroup[] = [
    {
      category: 'Frontend Development',
      tagline: 'Modern, reactive & performant user interfaces',
      color: '#00eaff',
      skills: [
        { name: 'Angular (14-21)', category: 'Frontend', roleInStack: 'Primary Single Page Application Framework, Component Architecture & Signals', highlight: true },
        { name: 'TypeScript', category: 'Frontend', roleInStack: 'Strict static typing, interfaces, decorators & compile-time safety', highlight: true },
        { name: 'JavaScript (ES6+)', category: 'Frontend', roleInStack: 'Modern ECMAScript paradigms, async/await, closures, prototypes' },
        { name: 'HTML5 & Semantic Markup', category: 'Frontend', roleInStack: 'Accessible document structure, ARIA standards & SEO foundation' },
        { name: 'SCSS / CSS3', category: 'Frontend', roleInStack: 'BEM methodology, custom properties, responsive grid & flex layouts', highlight: true },
        { name: 'RxJS', category: 'Frontend', roleInStack: 'Reactive asynchronous event handling, pipeable operators & state streams' }
      ]
    },
    {
      category: 'Backend & APIs',
      tagline: 'Robust, scalable & secure enterprise web services',
      color: '#7c3cff',
      skills: [
        { name: 'ASP.NET Core', category: 'Backend', roleInStack: 'High-throughput Web APIs, dependency injection, middleware pipelines', highlight: true },
        { name: 'C# (.NET 8/9)', category: 'Backend', roleInStack: 'Modern object-oriented architecture, LINQ, async task programming', highlight: true },
        { name: 'RESTful Web APIs', category: 'Backend', roleInStack: 'Stateless endpoints, standard HTTP verbs, status codes & Swagger docs' },
        { name: 'Dapper Micro-ORM', category: 'Backend', roleInStack: 'Ultra-fast SQL query execution and stored procedure mapping', highlight: true },
        { name: 'Entity Framework Core', category: 'Backend', roleInStack: 'Code-first migrations, DbContext modeling & relationship handling' },
        { name: 'HMAC SHA256 Cryptography', category: 'Backend', roleInStack: 'Secure payload signing and cryptographic payment verification' }
      ]
    },
    {
      category: 'Database Systems',
      tagline: 'Reliable, normalized & high-concurrency data storage',
      color: '#ff4d6d',
      skills: [
        { name: 'Microsoft SQL Server', category: 'Database', roleInStack: 'Primary relational enterprise database, T-SQL scripting & transactions', highlight: true },
        { name: 'Stored Procedures', category: 'Database', roleInStack: 'Complex business calculations, high-volume batch processing', highlight: true },
        { name: 'Views & Complex Joins', category: 'Database', roleInStack: 'Analytical queries, aggregated billing ledgers & report generation' },
        { name: 'Database Indexing & Tuning', category: 'Database', roleInStack: 'Execution plan analysis, index optimization & query performance' },
        { name: 'SQLite', category: 'Database', roleInStack: 'Lightweight local mobile persistence for offline-first synchronization' }
      ]
    },
    {
      category: 'Mobile Engineering',
      tagline: 'Cross-platform applications for iOS & Android devices',
      color: '#00ffa3',
      skills: [
        { name: 'Ionic Framework', category: 'Mobile', roleInStack: 'Adaptive UI components delivering native look & feel across platforms', highlight: true },
        { name: 'Capacitor', category: 'Mobile', roleInStack: 'Native hardware bridge for Camera, Geolocation, Storage & Deep Links', highlight: true },
        { name: 'Android Builds', category: 'Mobile', roleInStack: 'Android Studio packaging, permissions, APK/AAB builds & release configs' },
        { name: 'Firebase', category: 'Mobile', roleInStack: 'Push notifications (FCM), cloud messaging & analytics integration', highlight: true },
        { name: 'Deep Linking', category: 'Mobile', roleInStack: 'Custom URL schemes and payment callback transitions into mobile views' }
      ]
    },
    {
      category: 'Cloud & DevOps',
      tagline: 'Modern automated deployment, containerization & hosting',
      color: '#38bdf8',
      skills: [
        { name: 'Microsoft Azure', category: 'Cloud & DevOps', roleInStack: 'App Service hosting, Azure SQL Database, Blob storage & Application Insights', highlight: true },
        { name: 'Docker', category: 'Cloud & DevOps', roleInStack: 'Application containerization, reproducible development & staging environments', highlight: true },
        { name: 'GitHub Actions', category: 'Cloud & DevOps', roleInStack: 'Automated CI/CD build, test & deployment pipelines', highlight: true },
        { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', roleInStack: 'Automated releases with zero-downtime staging slots' },
        { name: 'AWS (Foundations)', category: 'Cloud & DevOps', roleInStack: 'Core cloud storage, compute instances & architectural concepts' }
      ]
    },
    {
      category: '3D & Creative Engineering',
      tagline: 'Interactive web experiences, motion & WebGL graphics',
      color: '#ffd000',
      skills: [
        { name: 'Three.js', category: '3D & Creative', roleInStack: 'WebGL scene generation, camera management, custom geometries & materials', highlight: true },
        { name: 'GSAP (GreenSock)', category: '3D & Creative', roleInStack: 'High-performance timeline choreography, camera pathing & UI transitions', highlight: true },
        { name: 'Interactive Canvas', category: '3D & Creative', roleInStack: 'Procedural particle systems, raycasting & pointer parallax effects' },
        { name: 'Angular SSR / SSG 3D', category: '3D & Creative', roleInStack: 'Safe platform browser runtime separation for SEO-friendly 3D apps' }
      ]
    }
  ];

  readonly experience: ExperienceItem[] = [
    {
      period: '2024 — Present',
      role: 'Full Stack Developer',
      companyOrContext: 'Smart Grid & Enterprise Application Engineering',
      location: 'India',
      summary: 'Engineering end-to-end full stack web, mobile, and cloud software systems powering smart meter billing, automated consumer portals, and secure banking payment gateway integrations.',
      highlights: [
        'Architected and implemented critical modules for smart grid meter billing platform using Angular, Ionic, ASP.NET Core, and SQL Server.',
        'Engineered ICICI payment gateway integration with HMAC SHA256 cryptographic verification, idempotent webhook handling, and mobile deep links.',
        'Developed high-performance SQL Server stored procedures and integrated Dapper ORM to accelerate high-volume billing tariff calculations.',
        'Built cross-platform consumer recharge mobile applications with Ionic and Capacitor, including camera scanning, local persistence, and push notifications.',
        'Configured CI/CD automated deployment workflows via GitHub Actions and maintained cloud services in Microsoft Azure.'
      ],
      keyStack: ['Angular', 'ASP.NET Core', 'C#', 'SQL Server', 'Ionic', 'Capacitor', 'Dapper', 'Azure', 'Docker']
    },
    {
      period: '2023 — 2024',
      role: 'Full Stack & Software Engineer',
      companyOrContext: 'Web Application Development & Digital Systems',
      location: 'India',
      summary: 'Developed modern web applications, RESTful microservices, and database models across educational, task management, and retail domains.',
      highlights: [
        'Created responsive single-page web applications with Angular and TypeScript, establishing reusable UI component design systems.',
        'Built clean-architecture ASP.NET Core REST APIs with dependency injection, authorization guards, and automated Swagger documentation.',
        'Designed normalized SQL Server database schemas, indexes, and transactional queries for e-commerce and collaborative task management platforms.',
        'Explored machine learning anomaly detection pipelines (Fraud Detection & Fake News Classification) using Python and Scikit-Learn.'
      ],
      keyStack: ['Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'SCSS', 'Git', 'Python']
    }
  ];

  readonly erpStages: ErpStageItem[] = [
    {
      id: 'erp-meter',
      step: 1,
      name: 'Electric Meter Telemetry Ingestion',
      subtitle: 'Smart Grid Hardware Readings & Pulse Ingest',
      technology: 'Smart Grid IoT Hardware & Modbus Firmware',
      flowRole: 'Continuous reading of active energy (kWh), instantaneous voltage, power factor, and tamper status',
      description: 'Physical digital electric meters deployed at consumer premises transmitting periodic encrypted energy packets to substation collectors.',
      technicalDetails: [
        'Measures cumulative active import kWh, reactive power, and phase voltages',
        'Transmits heartbeat telemetry at configurable 15-minute sync intervals',
        'Detects magnetic tamper, neutral disturbance, and reverse power flow flags'
      ],
      codeOrSchema: `// Ingested Meter Telemetry Packet\n{\n  "meterSerial": "MTR-IND-884920",\n  "timestamp": "2026-09-28T09:30:00Z",\n  "cumulativeKwh": 1428.65,\n  "voltagePhaseA": 234.2,\n  "powerFactor": 0.98,\n  "tamperFlag": 0\n}`,
      color: '#00ffa3'
    },
    {
      id: 'erp-data',
      step: 2,
      name: 'IoT Data Pipeline & Validation Queue',
      subtitle: 'High-Throughput Stream Buffering & Checksums',
      technology: 'Azure Service Bus & Ingestion Queues',
      flowRole: 'High-throughput stream buffering, packet checksum validation, and monotonic energy integrity check',
      description: 'Ingests thousands of concurrent meter telemetry events, validates schema contracts, and buffers incoming traffic to protect downstream APIs.',
      technicalDetails: [
        'Validates meter serial checksums and monotonic energy consumption increases',
        'Decouples high-frequency telemetry bursts from persistence tier',
        'Guarantees at-least-once message delivery with dead-letter queue routing'
      ],
      codeOrSchema: `// Ingestion Contract Validation\nif (packet.CumulativeKwh < previousReading.CumulativeKwh) {\n  throw new MeterAnomalyException("Negative consumption delta detected");\n}`,
      color: '#00eaff'
    },
    {
      id: 'erp-api',
      step: 3,
      name: 'ASP.NET Core Ingestion & Collector API',
      subtitle: 'Endpoint Authorization & Pipeline Orchestration',
      technology: 'ASP.NET Core 8 / C# REST API & Minimal APIs',
      flowRole: 'Mutual TLS endpoint authorization, rate limiting, and business validation orchestration',
      description: 'Secure backend API controllers processing telemetry data, authenticating meter gateway certificates, and invoking tariff calculation services.',
      technicalDetails: [
        'Mutual TLS and token-based gateway authentication',
        'High-speed async pipeline processing requests in under 2ms',
        'Emits Prometheus/OpenTelemetry metrics for telemetry ingestion health'
      ],
      codeOrSchema: `[HttpPost("telemetry/ingest")]\n[Authorize(Policy = "SmartMeterGateway")]\npublic async Task<IActionResult> IngestTelemetry([FromBody] MeterReadingDto dto) {\n  var result = await _meterService.RecordReadingAsync(dto);\n  return Ok(new { success = true, readingId = result.Id });\n}`,
      color: '#7c3cff'
    },
    {
      id: 'erp-database',
      step: 4,
      name: 'SQL Server & Dapper High-Speed Ledger',
      subtitle: 'Microsecond Hydration & ACID Ledger Storage',
      technology: 'Microsoft SQL Server & Dapper Micro-ORM',
      flowRole: 'High-performance ACID relational storage, time-series tables, and stored procedures',
      description: 'Optimized relational schema storing immutable meter consumption histories, consumer tariff assignments, and transactional recharge ledgers.',
      technicalDetails: [
        'Partitioned tables by billing cycle and geographic substation zone',
        'Dapper parameterized queries executing microsecond batch inserts',
        'ACID-compliant stored procedures guaranteeing zero ledger discrepancy'
      ],
      codeOrSchema: `// Dapper Micro-ORM Execution\nusing var conn = new SqlConnection(_connStr);\nvar sql = "EXEC sp_RecordMeterTelemetry @MeterSerial, @CumulativeKwh, @ReadTime";\nawait conn.ExecuteAsync(sql, new { dto.MeterSerial, dto.CumulativeKwh, dto.ReadTime });`,
      color: '#ffd000'
    },
    {
      id: 'erp-billing',
      step: 5,
      name: 'Dynamic Tariff & Statement Calculation Engine',
      subtitle: 'Multi-Slab Computation & Statement Generation',
      technology: 'C# Domain Logic & SQL Server Stored Procedures',
      flowRole: 'Automated multi-slab tariff calculation, surcharges, and monthly PDF statements',
      description: 'Core financial calculation engine evaluating consumed units against time-of-day tariffs, commercial vs domestic slabs, and generating itemized consumer bills.',
      technicalDetails: [
        'Dynamic tiered slabs: 0-100 kWh, 101-300 kWh, 301+ kWh progressive rates',
        'Peak hour tariff surcharges and solar feed-in credit deductions',
        'Automated scheduled monthly billing runs with discrepancy flags'
      ],
      codeOrSchema: `public decimal CalculateBill(decimal units, TariffProfile tariff) {\n  decimal total = tariff.FixedCharge;\n  foreach (var slab in tariff.Slabs) {\n    if (units <= 0) break;\n    var slabUnits = Math.Min(units, slab.MaxUnits);\n    total += slabUnits * slab.RatePerKwh;\n    units -= slabUnits;\n  }\n  return total;\n}`,
      color: '#ff4d6d'
    },
    {
      id: 'erp-payment',
      step: 6,
      name: 'Consumer Mobile Recharge & Payment Settlement',
      subtitle: 'Omnichannel Web/Mobile Recharge & Instant Quota Sync',
      technology: 'Angular Web Portal, Ionic / Capacitor App & ICICI Gateway',
      flowRole: 'Prepaid balance recharge, online payment settlement, and real-time quota crediting',
      description: 'Omnichannel consumer interface allowing users to view energy consumption trends, recharge prepaid meter balances, and receive instant quota top-ups.',
      technicalDetails: [
        'Seamless payment gateway integration with instant status callback',
        'Immediate meter balance top-up signal transmitted to physical smart meter',
        'Push notifications and SMS receipts sent upon successful transaction'
      ],
      codeOrSchema: `// Consumer Recharge Dispatch\nasync rechargePrepaidMeter(meterId: string, amount: number) {\n  const res = await this.paymentService.initiateICICIPayment(meterId, amount);\n  if (res.status === 'SUCCESS') {\n    await this.meterService.refreshQuota(meterId);\n  }\n}`,
      color: '#38bdf8'
    }
  ];

  readonly paymentStages: PaymentStageItem[] = [
    {
      id: 'pay-request',
      order: 1,
      stage: 'REQUEST',
      name: 'Order Initialization & Payload Assembly',
      subtitle: 'Angular / Ionic client initiating payment request',
      technicalRole: 'Client initiates checkout with unique merchant order ID, amount, and customer metadata',
      protocolOrAlgorithm: 'HTTPS POST / JSON Contract',
      description: 'The consumer requests a smart meter recharge. The frontend validates the input and sends a request to the ASP.NET Core backend to create an authorized payment transaction.',
      parameters: [
        { key: 'merchantTxnId', value: 'TXN-2026-981240', note: 'Unique client order identifier' },
        { key: 'meterSerial', value: 'MTR-IND-884920', note: 'Smart meter destination' },
        { key: 'amount', value: '1450.00', note: 'Recharge amount in INR' },
        { key: 'currency', value: 'INR', note: 'ISO 4217 standard' }
      ],
      codeExample: `// Angular / Ionic Service\nconst req = {\n  merchantTxnId: 'TXN-2026-981240',\n  meterSerial: 'MTR-IND-884920',\n  amount: 1450.00\n};\nthis.http.post<PaymentInitResponse>('/api/payments/initiate', req);`,
      color: '#00eaff'
    },
    {
      id: 'pay-hash',
      order: 2,
      stage: 'HASH',
      name: 'HMAC SHA256 Cryptographic Signing',
      subtitle: 'Server-side tamper-proof payload hash generation',
      technicalRole: 'Backend generates digital cryptographic signature using private merchant secret key',
      protocolOrAlgorithm: 'HMAC-SHA256 (Hash-based Message Authentication Code)',
      description: 'To guarantee payload integrity and prevent merchant or amount tampering, the ASP.NET Core backend concatenates parameters and hashes them using HMAC SHA256 with the merchant secret key.',
      parameters: [
        { key: 'algorithm', value: 'HMACSHA256', note: 'FIPS 198-1 standard' },
        { key: 'rawString', value: 'MERCHANT_ID|TXN-2026-981240|1450.00|INR|SALT', note: 'Piped delimiter order' },
        { key: 'signatureHash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', note: 'Hex-encoded digest (demo)' },
        { key: 'secretStorage', value: 'Azure Key Vault (Never exposed to client)', note: 'Zero-trust security' }
      ],
      codeExample: `// C# ASP.NET Core Hash Generation\npublic static string ComputeHmacSha256(string payload, string secret) {\n  using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));\n  var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));\n  return Convert.ToHexString(hashBytes).ToLower();\n}`,
      color: '#7c3cff'
    },
    {
      id: 'pay-gateway',
      order: 3,
      stage: 'PAYMENT',
      name: 'ICICI Bank Hosted Gateway Redirection',
      subtitle: 'Secure bank portal transaction checkout',
      technicalRole: 'Redirects payer to bank checkout with encrypted signature validation',
      protocolOrAlgorithm: '3D Secure 2.0 / UPI / NetBanking / Cards',
      description: 'Client browser or mobile in-app browser opens the bank portal. ICICI verifies the merchant signature hash before allowing consumer to enter card, net banking, or UPI credentials.',
      parameters: [
        { key: 'gatewayUrl', value: 'https://payment.icicibank.com/smartcheckout/pay', note: 'Bank hosted page' },
        { key: 'authMode', value: '3D Secure OTP / UPI Intent', note: 'Two-factor authentication' },
        { key: 'signatureCheck', value: 'VERIFIED_VALID', note: 'Hash match confirmed' }
      ],
      color: '#38bdf8'
    },
    {
      id: 'pay-transaction',
      order: 4,
      stage: 'TRANSACTION',
      name: 'Banking Core Authorization & Ledger Capture',
      subtitle: 'Bank settles transaction & generates bank reference',
      technicalRole: 'Bank core banking system executes fund capture and issues unique bank transaction reference',
      protocolOrAlgorithm: 'ISO 8583 Banking Switch & Ledger Debit',
      description: 'Bank debits consumer account, issues authorization code, and logs successful financial settlement into bank audit registers.',
      parameters: [
        { key: 'bankRefNumber', value: 'ICICI-TXN-2026-994120', note: 'Bank reference ID' },
        { key: 'status', value: 'SUCCESS_CAPTURED', note: 'Settlement state' },
        { key: 'authCode', value: 'AUTH-892144', note: 'Network authorization code' }
      ],
      color: '#ffd000'
    },
    {
      id: 'pay-callback',
      order: 5,
      stage: 'CALLBACK',
      name: 'Asynchronous Webhook & Tamper Verification',
      subtitle: 'Server-to-server callback with signature verification',
      technicalRole: 'ASP.NET Core callback controller verifies returned signature and idempotently commits ledger',
      protocolOrAlgorithm: 'HTTPS Webhook / Idempotent Lock',
      description: 'ICICI servers send an asynchronous server-to-server webhook containing transaction outcome and response HMAC. The backend recomputes the hash to ensure no MITM tampering before updating the database.',
      parameters: [
        { key: 'endpoint', value: '/api/payments/icici-callback', note: 'Webhook controller' },
        { key: 'responseHash', value: 'VERIFIED_SIGNATURE', note: 'Server validation' },
        { key: 'idempotencyKey', value: 'IDEMP-TXN-2026-981240', note: 'Prevents double credit' }
      ],
      codeExample: `// C# ASP.NET Core Webhook Controller\n[HttpPost("icici-callback")]\npublic async Task<IActionResult> HandleCallback([FromForm] CallbackPayload payload) {\n  if (!ValidateSignature(payload)) return BadRequest("Invalid hash signature");\n  await _paymentService.ReconcileTransactionAsync(payload);\n  return Ok("SUCCESS");\n}`,
      color: '#00ffa3'
    },
    {
      id: 'pay-result',
      order: 6,
      stage: 'RESULT',
      name: 'Mobile Deep Link & Meter Quota Credit',
      subtitle: 'Deep link into Capacitor app & meter quota activation',
      technicalRole: 'Dispatches native OS deep link (Android Intent / iOS Universal Link) and updates meter balance',
      protocolOrAlgorithm: 'myapp://recharge/result & Android/iOS App Links',
      description: 'The mobile runtime catches the deep link URI (`myapp://payment-result?status=success&txnId=...`), switches the UI back into the native app, and displays success receipt while IoT service credits the smart meter.',
      parameters: [
        { key: 'androidScheme', value: 'android.intent.action.VIEW (myapp://)', note: 'AndroidManifest intent-filter' },
        { key: 'iosScheme', value: 'Universal Links / Associated Domains', note: 'Apple App Site Association' },
        { key: 'meterCredit', value: '+500 kWh Credited Instantly', note: 'Smart grid quota sync' }
      ],
      color: '#4dffb5'
    }
  ];

  readonly mobileFeatures: MobileFeatureItem[] = [
    {
      id: 'mob-camera',
      name: 'Camera & Barcode OCR Scanner',
      category: 'Hardware & Plugins',
      technology: '@capacitor/camera & Barcode Scanner',
      description: 'Hardware camera integration for scanning physical meter QR codes, serial barcodes, and capturing photo audit proof during maintenance inspections.',
      implementationDetail: 'Uses Capacitor Camera plugin with high-resolution photo capture, automatic flashlight toggle, and fast client-side image compression.',
      codeSnippet: `const image = await Camera.getPhoto({\n  quality: 85,\n  allowEditing: false,\n  resultType: CameraResultType.Base64,\n  source: CameraSource.Camera\n});`,
      color: '#00eaff'
    },
    {
      id: 'mob-geolocation',
      name: 'Geolocation GPS Dispatch Radar',
      category: 'Hardware & Plugins',
      technology: '@capacitor/geolocation',
      description: 'Real-time GPS coordinate acquisition enabling automated field technician dispatch, proximity meter routing, and geofenced service validation.',
      implementationDetail: 'Queries device GPS sensors with high-accuracy mode enabled, calculating distance to nearest electric substation or reported meter fault.',
      codeSnippet: `const coordinates = await Geolocation.getCurrentPosition({\n  enableHighAccuracy: true,\n  timeout: 10000\n});\nconsole.log(coordinates.coords.latitude, coordinates.coords.longitude);`,
      color: '#7c3cff'
    },
    {
      id: 'mob-sqlite',
      name: 'SQLite Encrypted Offline Vault',
      category: 'Data & Storage',
      technology: '@capacitor-community/sqlite',
      description: 'Local relational database operating on Android and iOS devices allowing technicians to record hundreds of readings with zero cellular coverage.',
      implementationDetail: 'Maintains encrypted offline SQLite tables. Automatically queues inserts and executes bidirectional sync with Azure SQL when connectivity resumes.',
      codeSnippet: `await db.execute(\`\n  CREATE TABLE IF NOT EXISTS offline_readings (\n    id TEXT PRIMARY KEY, meterId TEXT, kwh REAL, synced INT\n  );\n\`);`,
      color: '#ffd000'
    },
    {
      id: 'mob-firebase',
      name: 'Firebase Cloud Messaging (FCM) & Push',
      category: 'Cloud & Messaging',
      technology: '@capacitor/push-notifications & Firebase Admin',
      description: 'Direct push notification delivery alerting consumers to newly generated monthly bills, low prepaid balance warnings, and instant payment confirmations.',
      implementationDetail: 'Registers device FCM tokens on app startup, handles background notification payloads, and routes taps directly to relevant billing views.',
      codeSnippet: `await PushNotifications.addListener('pushNotificationReceived', notification => {\n  console.log('Push received: ', notification.title, notification.body);\n});`,
      color: '#00ffa3'
    },
    {
      id: 'mob-android',
      name: 'Android Native Platform Runtime',
      category: 'Native OS Runtimes',
      technology: 'Android Studio, Kotlin, Gradle, Android 14+ Target',
      description: 'Production Android APK / AAB packaging with tuned AndroidManifest.xml permissions, splash screens, adaptive icons, and foreground services.',
      implementationDetail: 'Configures ProGuard minification, hardware acceleration, Android keystore release signing, and scoped storage compatibility.',
      color: '#3ddc84'
    },
    {
      id: 'mob-ios',
      name: 'iOS Native Platform Runtime',
      category: 'Native OS Runtimes',
      technology: 'Apple Xcode, Swift, CocoaPods, iOS 17+ Target',
      description: 'Native Apple iOS workspace configuration with strict Info.plist privacy descriptions (Camera, Location, Push), App Transport Security, and Universal Links.',
      implementationDetail: 'Builds optimized IPA archives for TestFlight distribution, handling safe-area notches, FaceID/TouchID biometrics, and Dark Mode themes.',
      color: '#38bdf8'
    }
  ];

  getProjectById(id: string): ProjectItem | undefined {
    return this.projects.find(p => p.id === id);
  }

  getArchitectureNodeById(id: string): ArchitectureNode | undefined {
    return this.architectureNodes.find(n => n.id === id);
  }

  getErpStageById(id: string): ErpStageItem | undefined {
    return this.erpStages.find(s => s.id === id);
  }

  getPaymentStageById(id: string): PaymentStageItem | undefined {
    return this.paymentStages.find(p => p.id === id);
  }

  getMobileFeatureById(id: string): MobileFeatureItem | undefined {
    return this.mobileFeatures.find(m => m.id === id);
  }
}

