import { AgentProfile, InterviewTrack } from '../types/interview';

// Use the exact generated image assets saved in Phase 1
import alexImg from '../assets/images/agent_alex_tech_lead_1790436465780.jpg';
import sarahImg from '../assets/images/agent_sarah_culture_1790436477776.jpg';
import marcusImg from '../assets/images/agent_marcus_hiring_mgr_1790436492936.jpg';
import elenaImg from '../assets/images/agent_elena_security_1790436512867.jpg';

export const DEFAULT_AGENTS: AgentProfile[] = [
  {
    id: 'agent_alex',
    role: 'technical_lead',
    name: 'Alex Rivera',
    title: 'Lead System Architect & Staff Engineer',
    company: 'ExaScale Cloud',
    avatarUrl: alexImg,
    voiceName: 'Zephyr',
    personality: 'Methodical, deeply analytical, loves clean code architecture, data structures, and edge case optimization.',
    focusAreas: ['Algorithms & Data Structures', 'System Design & Scalability', 'API Design & Clean Code', 'Performance Optimization'],
    colorTheme: {
      border: 'border-indigo-500/50',
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
      glow: 'shadow-indigo-500/25',
      accent: 'indigo',
    },
    styleBadge: 'Lead Technical Interviewer',
    strictness: 'standard',
    systemPrompt: `You are Alex Rivera, Lead Technical Interviewer. You focus on technical depth, algorithmic efficiency, clean code, and distributed systems architecture. Ask precise follow-up questions when code or responses miss time/space complexity or scalability considerations.`
  },
  {
    id: 'agent_sarah',
    role: 'culture_lead',
    name: 'Dr. Sarah Vance',
    title: 'Head of Organizational Culture & Behavioral Science',
    company: 'Apex Talent Labs',
    avatarUrl: sarahImg,
    voiceName: 'Kore',
    personality: 'Empathetic yet rigorous, evaluates STAR format responses, leadership alignment, active listening, and conflict management.',
    focusAreas: ['STAR Behavioral Method', 'Leadership Principles', 'Cross-functional Collaboration', 'Conflict & Disagreement Resolution'],
    colorTheme: {
      border: 'border-emerald-500/50',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      glow: 'shadow-emerald-500/25',
      accent: 'emerald',
    },
    styleBadge: 'Culture & Soft Skills Lead',
    strictness: 'standard',
    systemPrompt: `You are Dr. Sarah Vance, Culture & Behavioral Evaluator. Ask candidate about real-world team challenges, how they handle feedback, resolve technical disagreements, and demonstrate empathy and clarity.`
  },
  {
    id: 'agent_marcus',
    role: 'hiring_manager',
    name: 'Marcus Vance',
    title: 'VP of Product Engineering',
    company: 'Vanguard Enterprise',
    avatarUrl: marcusImg,
    voiceName: 'Puck',
    personality: 'Pragmatic, execution-driven, focuses on business ROI, velocity trade-offs, scope prioritization, and team output.',
    focusAreas: ['Product ROI & Business Metrics', 'Pragmatic Trade-offs', 'Delivery Velocity vs Technical Debt', 'Stakeholder Alignment'],
    colorTheme: {
      border: 'border-amber-500/50',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      glow: 'shadow-amber-500/25',
      accent: 'amber',
    },
    styleBadge: 'Hiring Manager & Executive',
    strictness: 'standard',
    systemPrompt: `You are Marcus Vance, VP of Engineering and Hiring Manager. You evaluate if the candidate understands product trade-offs, business value delivery, and can balance engineering excellence with rapid execution.`
  },
  {
    id: 'agent_elena',
    role: 'security_sre',
    name: 'Elena Rostova',
    title: 'Principal Security Architect & SRE Specialist',
    company: 'CyberShield Systems',
    avatarUrl: elenaImg,
    voiceName: 'Fenrir',
    personality: 'Sharply analytical, probing on security vulnerabilities, fault tolerance, rate limiting, and defensive engineering.',
    focusAreas: ['OWASP Top 10 & Security Vulnerabilities', 'Fault Tolerance & Disaster Recovery', 'Observability & Monitoring', 'Automated Testing Coverage'],
    colorTheme: {
      border: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-400',
      glow: 'shadow-rose-500/25',
      accent: 'rose',
    },
    styleBadge: 'Security & Reliability Specialist',
    strictness: 'standard',
    systemPrompt: `You are Elena Rostova, Security & SRE Specialist. Look for security vulnerabilities, missing input validation, unhandled exceptions, or lack of fail-safes in system design and code.`
  }
];

export const PRESET_TRACKS: InterviewTrack[] = [
  {
    id: 'track_fullstack',
    title: 'Senior Full-Stack Engineer',
    roleLevel: 'Senior',
    category: 'Full-Stack',
    description: 'Comprehensive evaluation covering frontend state management, REST/GraphQL APIs, database queries, and behavioral leadership.',
    iconName: 'Layers',
    estimatedMinutes: 25,
    sampleJobDescription: 'Seeking a Senior Full-Stack Engineer to architect high-throughput React/Node.js web applications, design PostgreSQL/Redis schemas, write resilient unit tests, and lead sprint execution.',
    defaultQuestionsCount: 4,
    featuredCodeSnippet: `// Problem: Implement an in-memory Rate Limiter class using Sliding Window Counter
class RateLimiter {
  constructor(limit = 10, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map(); // userId -> Array<timestamp>
  }

  isAllowed(userId) {
    const now = Date.now();
    // TODO: Clean up expired timestamps and return true/false
    
    return true;
  }
}`,
    architectureNodesPreset: ['Client Browser', 'API Gateway', 'Node.js App Service', 'Redis Cache', 'PostgreSQL Primary']
  },
  {
    id: 'track_system_arch',
    title: 'Staff Distributed Systems Architect',
    roleLevel: 'Staff / Principal',
    category: 'Backend Systems',
    description: 'Deep dive into distributed caching, consensus algorithms, event streaming (Kafka), database partitioning, and SLA optimization.',
    iconName: 'Cpu',
    estimatedMinutes: 30,
    sampleJobDescription: 'Looking for a Staff System Architect to design our real-time streaming data pipeline supporting 500k events/sec with sub-50ms p99 latency, zero data loss, and multi-region failover.',
    defaultQuestionsCount: 5,
    featuredCodeSnippet: `// Problem: Distributed Lock with Lease TTL renewal loop
async function acquireDistributedLock(redisClient, lockKey, ownerId, ttlMs) {
  // TODO: Implement atomic SETNX with expiration and heart-beat auto-renewal
  const result = await redisClient.set(lockKey, ownerId, 'NX', 'PX', ttlMs);
  return result === 'OK';
}`,
    architectureNodesPreset: ['CDN Edge', 'Global Load Balancer', 'Kafka Event Bus', 'Stream Processors', 'Cassandra Cluster', 'Prometheus SRE']
  },
  {
    id: 'track_ai_ml',
    title: 'Lead AI / Machine Learning Engineer',
    roleLevel: 'Lead / Management',
    category: 'Machine Learning',
    description: 'Evaluation focused on LLM fine-tuning, RAG pipelines, vector databases (Pinecone/pgvector), inference quantization, and model monitoring.',
    iconName: 'Brain',
    estimatedMinutes: 25,
    sampleJobDescription: 'Lead AI Engineer to deploy enterprise GenAI applications, optimize GPU inference pipelines, implement vector similarity search, and establish LLM evaluation benchmarks.',
    defaultQuestionsCount: 4,
    featuredCodeSnippet: `// Problem: Semantic Search Chunking with Overlap & Embedding Cache
function chunkDocument(text, maxChunkSize = 512, overlap = 64) {
  const words = text.split(/\\s+/);
  const chunks = [];
  let i = 0;
  
  while (i < words.length) {
    const chunk = words.slice(i, i + maxChunkSize).join(' ');
    chunks.push(chunk);
    i += (maxChunkSize - overlap);
  }
  return chunks;
}`
  },
  {
    id: 'track_devops_sre',
    title: 'Principal DevOps & SRE Engineer',
    roleLevel: 'Staff / Principal',
    category: 'DevOps & SRE',
    description: 'Infrastructure as Code (Terraform), Kubernetes cluster security, zero-downtime canary deployments, and incident response management.',
    iconName: 'ShieldAlert',
    estimatedMinutes: 20,
    sampleJobDescription: 'Principal SRE to maintain 99.99% uptime across Kubernetes clusters on GCP, automate CI/CD pipelines, conduct post-mortems, and harden IAM policies.',
    defaultQuestionsCount: 4
  },
  {
    id: 'track_pm_tech',
    title: 'Technical Product Manager',
    roleLevel: 'Mid',
    category: 'Product Management',
    description: 'Focuses on API spec requirements, developer experience, metric prioritization, roadmap trade-offs, and cross-functional alignment.',
    iconName: 'Kanban',
    estimatedMinutes: 20,
    sampleJobDescription: 'Seeking a Technical Product Manager for developer platform APIs. Define SLA objectives, balance technical debt refactoring with new user features, and lead user research.',
    defaultQuestionsCount: 4
  }
];
