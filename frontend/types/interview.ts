export type AgentRole = 'technical_lead' | 'culture_lead' | 'hiring_manager' | 'security_sre';

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'cross_examining' | 'evaluating';

export interface AgentProfile {
  id: string;
  role: AgentRole;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
  voiceName: string; // 'Zephyr' | 'Kore' | 'Puck' | 'Fenrir' | 'Charon'
  personality: string;
  focusAreas: string[];
  colorTheme: {
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    accent: string;
  };
  styleBadge: string;
  strictness: 'encouraging' | 'standard' | 'rigorous';
  systemPrompt: string;
}

export interface InterviewTrack {
  id: string;
  title: string;
  roleLevel: 'Junior' | 'Mid' | 'Senior' | 'Staff / Principal' | 'Lead / Management';
  category: 'Full-Stack' | 'Backend Systems' | 'Frontend Engineering' | 'Machine Learning' | 'DevOps & SRE' | 'Product Management' | 'Behavioral & Leadership';
  description: string;
  iconName: string;
  estimatedMinutes: number;
  sampleJobDescription: string;
  defaultQuestionsCount: number;
  featuredCodeSnippet?: string;
  architectureNodesPreset?: string[];
}

export interface CandidateContext {
  fullName: string;
  targetRole: string;
  targetLevel: string;
  companyName: string;
  jobDescription: string;
  resumeText: string;
  strictnessMode: 'encouraging' | 'standard' | 'rigorous';
  selectedAgentIds: string[];
}

export interface CodeFile {
  filename: string;
  language: string;
  content: string;
}

export interface CodeReviewComment {
  line: number;
  authorAgentId: string;
  authorName: string;
  severity: 'info' | 'warning' | 'critical' | 'praise';
  comment: string;
  suggestion?: string;
}

export interface InterAgentDebate {
  initiatorAgentId: string;
  targetAgentId: string;
  topic: string;
  dialogue: {
    speakerId: string;
    speakerName: string;
    message: string;
  }[];
  consensusSummary: string;
}

export interface TranscriptMessage {
  id: string;
  timestamp: string;
  speakerId: 'user' | string; // 'user' or agentId
  speakerName: string;
  speakerRole?: string;
  avatarUrl?: string;
  content: string;
  audioBase64?: string;
  codeSnippet?: string;
  isInterAgentDebate?: boolean;
  debateData?: InterAgentDebate;
  agentMood?: string;
  scoreDelta?: number; // e.g., +5 or -2
  feedbackTags?: string[];
}

export interface ArchitectureNode {
  id: string;
  type: 'client' | 'gateway' | 'service' | 'cache' | 'database' | 'queue' | 'cdn';
  label: string;
  x: number;
  y: number;
}

export interface ArchitectureConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface AgentScorecard {
  agentId: string;
  agentName: string;
  agentRole: AgentRole;
  score: number; // 0-100
  verdict: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  keyQuote: string;
  summary: string;
  strengths: string[];
  concerns: string[];
}

export interface CompetencyBreakdown {
  algorithmsAndCoding: number;
  systemArchitecture: number;
  behavioralAndSTAR: number;
  codeQualityAndTesting: number;
  securityAndReliability: number;
  communicationAndClarity: number;
}

export interface QuestionTimelineItem {
  id: string;
  questionNumber: number;
  askedByAgentId: string;
  askedByAgentName: string;
  questionText: string;
  candidateAnswerText: string;
  codeSubmitted?: string;
  aiAnalysis: {
    score: number;
    positives: string[];
    missedPoints: string[];
    idealResponseHint: string;
  };
}

export interface FullInterviewScorecard {
  sessionId: string;
  candidateName: string;
  targetRole: string;
  companyName: string;
  createdAt: string;
  durationMinutes: number;
  overallScore: number; // 0-100
  overallVerdict: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  executiveSummary: string;
  agentEvaluations: Record<string, AgentScorecard>;
  competencies: CompetencyBreakdown;
  timeline: QuestionTimelineItem[];
  topStrengths: string[];
  keyImprovementAreas: string[];
  recommendedActionPlan: string[];
}

export type ActiveTab = 'setup' | 'studio' | 'scorecard' | 'history' | 'customizer';
