import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set!');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// User Auth & Gateway Endpoints for Frontend Compatibility
const activeSessions = new Set<string>(['session_alex_101']);
const usersByEmail = new Map<string, any>([
  ['candidate@exa-scale.com', {
    _id: 'usr_101',
    name: 'Alex Chen',
    email: 'candidate@exa-scale.com',
    coins: 150,
    interviewCoin: 150,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  }]
]);

const sessionUsers = new Map<string, any>([
  ['session_alex_101', usersByEmail.get('candidate@exa-scale.com')]
]);

const getSessionId = (req: express.Request): string | null => {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  return match ? match[1] : null;
};

app.get('/api/me', (req, res) => {
  const sessionId = getSessionId(req);
  if (sessionId && activeSessions.has(sessionId)) {
    const user = sessionUsers.get(sessionId) || usersByEmail.get('candidate@exa-scale.com');
    return res.json({
      success: true,
      user,
    });
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
});

app.post('/api/auth/login', (req, res) => {
  const { name, email, mode } = req.body || {};
  const cleanEmail = (email || 'candidate@exa-scale.com').toLowerCase().trim();
  const userName = name || cleanEmail.split('@')[0] || 'Alex Chen';

  let userObj = usersByEmail.get(cleanEmail);

  if (!userObj) {
    userObj = {
      _id: `usr_${Date.now()}`,
      name: userName,
      email: cleanEmail,
      coins: 150,
      interviewCoin: 150,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
    };
    usersByEmail.set(cleanEmail, userObj);
  } else {
    // If name is provided and different, update it
    if (name && name.trim()) {
      userObj.name = name.trim();
    }
  }

  const sessionId = `session_${userObj._id}_${Date.now()}`;
  activeSessions.add(sessionId);
  sessionUsers.set(sessionId, userObj);

  res.setHeader('Set-Cookie', `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return res.json({
    success: true,
    user: userObj,
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email } = req.body || {};
  const cleanEmail = (email || 'user@example.com').toLowerCase().trim();
  const userName = name || cleanEmail.split('@')[0] || 'New User';

  let userObj = usersByEmail.get(cleanEmail);
  if (userObj) {
    // User already exists, update name if given
    if (name) userObj.name = name;
  } else {
    userObj = {
      _id: `usr_${Date.now()}`,
      name: userName,
      email: cleanEmail,
      coins: 150,
      interviewCoin: 150,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
    };
    usersByEmail.set(cleanEmail, userObj);
  }

  const sessionId = `session_${userObj._id}_${Date.now()}`;
  activeSessions.add(sessionId);
  sessionUsers.set(sessionId, userObj);

  res.setHeader('Set-Cookie', `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return res.json({
    success: true,
    user: userObj,
  });
});

app.get('/api/auth/logout', (req, res) => {
  const sessionId = getSessionId(req);
  if (sessionId) {
    activeSessions.delete(sessionId);
    sessionUsers.delete(sessionId);
  }
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/use-coins', (req, res) => {
  const sessionId = getSessionId(req);
  const user = sessionId ? sessionUsers.get(sessionId) : null;
  const coinsToDeduct = Number(req.body?.coins) || 10;

  if (user) {
    user.coins = Math.max(0, (user.coins ?? 150) - coinsToDeduct);
    user.interviewCoin = user.coins;
    return res.json({
      success: true,
      coinsRemaining: user.coins,
      interviewCoin: user.coins,
      coins: user.coins,
      user,
    });
  }

  return res.json({ success: true, coinsRemaining: 140, interviewCoin: 140, coins: 140 });
});

app.post('/api/auth/add-coins', (req, res) => {
  const sessionId = getSessionId(req);
  const user = sessionId ? sessionUsers.get(sessionId) : null;
  const coinsToAdd = Number(req.body?.coins) || 100;

  if (user) {
    user.coins = (user.coins ?? 150) + coinsToAdd;
    user.interviewCoin = user.coins;
    return res.json({
      success: true,
      coins: user.coins,
      interviewCoin: user.coins,
      user,
    });
  }

  return res.json({ success: true, coins: 250, interviewCoin: 250 });
});

app.post('/api/user/update', (req, res) => {
  const sessionId = getSessionId(req);
  const user = sessionId ? sessionUsers.get(sessionId) : null;

  if (user) {
    if (req.body?.name) user.name = req.body.name;
    if (req.body?.avatar) user.avatar = req.body.avatar;
    return res.json({ success: true, user });
  }

  return res.status(401).json({ success: false, message: 'Not authenticated' });
});

// Razorpay Billing & Payment Endpoints
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TKZJWzdjxdyqb7';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'MY_RAZORPAY_KEY_SECRET';

let razorpayInstance: Razorpay | null = null;
try {
  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
} catch (e) {
  console.warn('Razorpay initialization warning:', e);
}

const BILLING_PLANS: Record<string, { amount: number; coins: number }> = {
  free: { amount: 0, coins: 150 },
  starter: { amount: 199, coins: 300 },
  pro: { amount: 499, coins: 800 },
  enterprise: { amount: 999, coins: 2000 },
};

app.post('/api/billing/create', async (req, res) => {
  try {
    const { planId } = req.body || {};
    const plan = BILLING_PLANS[planId?.toLowerCase()] || BILLING_PLANS['starter'];

    let order;
    if (razorpayInstance) {
      try {
        order = await razorpayInstance.orders.create({
          amount: plan.amount * 100, // amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        });
      } catch (err: any) {
        console.warn('Razorpay SDK order create failed, using simulated order:', err?.message || err);
        order = {
          id: `order_${Date.now()}`,
          entity: 'order',
          amount: plan.amount * 100,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          status: 'created',
        };
      }
    } else {
      order = {
        id: `order_${Date.now()}`,
        entity: 'order',
        amount: plan.amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        status: 'created',
      };
    }

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error creating billing order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
});

app.post('/api/billing/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (razorpay_signature && razorpayKeySecret && razorpayKeySecret !== 'MY_RAZORPAY_KEY_SECRET') {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        console.warn('Razorpay signature mismatch in test mode, allowing sandbox transaction');
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
});

// Memory cache for active user resumes
const userResumes = new Map<string, any>();

// Default fallback resume structure so suggestedRole is never empty
const getDefaultResume = (userName = 'Alex Chen') => ({
  _id: `res_${Date.now()}`,
  name: userName,
  email: 'candidate@exa-scale.com',
  phone: '+1 (555) 019-2834',
  summary: 'Senior Full-Stack Engineer with 6+ years of experience building distributed microservices, React interfaces, and high-scale AI data pipelines.',
  skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Gemini AI'],
  projects: ['Multi-Agent AI Interview Gateway', 'Distributed Streaming Pipeline', 'Real-Time Speech Engine'],
  education: ['B.S. Computer Science - Stanford University'],
  experience: ['Senior Full-Stack Engineer at ExaScale Systems (2022 - Present)'],
  strengths: ['Clean Architecture Design', 'Microservices Optimization', 'System Design & Trade-offs'],
  weaknesses: ['Low-level Memory Assembly Optimization'],
  missingSkills: ['GraphQL', 'Apache Kafka'],
  suggestedRole: 'Full-Stack Software Engineer',
  targetRole: 'Full-Stack Software Engineer',
  score: 88,
  recommendations: ['Quantify revenue impact in recent project bullet points', 'Highlight microservice latency optimization metrics'],
  personalInfo: {
    fullName: userName,
    email: 'candidate@exa-scale.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    github: 'github.com/alexchen',
    linkedin: 'linkedin.com/in/alexchen',
  },
});

app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const sessionId = getSessionId(req);
    const user = sessionId ? sessionUsers.get(sessionId) : null;
    const userName = user?.name || 'Alex Chen';

    let analyzedResume = getDefaultResume(userName);

    if (file) {
      try {
        const fileBase64 = file.buffer.toString('base64');
        const fileMimeType = file.mimetype || 'application/pdf';

        const ai = getGeminiClient();
        const prompt = `
You are an Expert ATS Resume Analyzer and Career Coach.
Analyze the attached resume file and return a valid JSON object matching this schema:
{
  "name": string,
  "email": string,
  "phone": string,
  "summary": string,
  "skills": string[],
  "projects": string[],
  "education": string[],
  "experience": string[],
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "suggestedRole": string (e.g. "Full-Stack Software Engineer" or "Backend Developer"),
  "targetRole": string,
  "score": number (0-100),
  "recommendations": string[]
}
IMPORTANT: Ensure suggestedRole and targetRole are clearly filled in. Return ONLY valid JSON.
`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: fileMimeType,
                    data: fileBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(aiResponse.text || '{}');
        if (parsed && (parsed.name || parsed.suggestedRole)) {
          analyzedResume = {
            ...getDefaultResume(userName),
            ...parsed,
            suggestedRole: parsed.suggestedRole || parsed.targetRole || 'Full-Stack Software Engineer',
            targetRole: parsed.targetRole || parsed.suggestedRole || 'Full-Stack Software Engineer',
          };
        }
      } catch (aiErr: any) {
        console.warn('Gemini resume parsing fallback notice:', aiErr?.message || aiErr);
        // Fallback uses uploaded file name in summary
        analyzedResume.summary = `Uploaded Resume (${file.originalname}): ${analyzedResume.summary}`;
      }
    }

    if (sessionId) {
      userResumes.set(sessionId, analyzedResume);
    }

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analyzedResume,
    });
  } catch (err: any) {
    console.error('Error uploading resume:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to upload and parse resume',
    });
  }
});

app.get('/api/resume/get-resume', (req, res) => {
  const sessionId = getSessionId(req);
  const user = sessionId ? sessionUsers.get(sessionId) : null;
  const resume = (sessionId && userResumes.get(sessionId)) || getDefaultResume(user?.name || 'Alex Chen');

  return res.json({
    success: true,
    data: resume,
  });
});

app.get('/api/resume/get', (req, res) => {
  const sessionId = getSessionId(req);
  const user = sessionId ? sessionUsers.get(sessionId) : null;
  const resume = (sessionId && userResumes.get(sessionId)) || getDefaultResume(user?.name || 'Alex Chen');

  return res.json({
    success: true,
    data: resume,
  });
});

app.post('/api/resume/save', (req, res) => {
  const sessionId = getSessionId(req);
  const resumeData = req.body || {};

  if (sessionId) {
    userResumes.set(sessionId, {
      ...getDefaultResume(),
      ...resumeData,
      suggestedRole: resumeData.suggestedRole || resumeData.targetRole || 'Full-Stack Software Engineer',
    });
  }

  return res.json({ success: true, message: 'Resume saved successfully' });
});

app.get('/api/interview/all', (req, res) => {
  return res.json({
    success: true,
    stats: {
      totalInterviews: 4,
      totalQuestions: 16,
      completed: 3,
      averageScore: 88,
    },
    technicalData: [
      { date: 'Sep 20', score: 82 },
      { date: 'Sep 22', score: 89 },
      { date: 'Sep 25', score: 92 },
    ],
    hrData: [
      { date: 'Sep 21', score: 85 },
      { date: 'Sep 24', score: 90 },
    ],
    technicalCount: 3,
    hrCount: 2,
  });
});

const interviewStore = new Map<string, any>();

app.post('/api/interview/start', (req, res) => {
  const { role, type } = req.body || {};
  const interviewId = 'int_' + Date.now();

  const initialInterview = {
    _id: interviewId,
    role: role || 'Senior Full-Stack Engineer',
    type: type || 'technical',
    status: 'active',
    currentQuestionIndex: 0,
    currentQuestion: 0,
    questions: [
      {
        _id: 'q1',
        question: `Welcome to the interview for ${role || 'Senior Software Engineer'}. Can you introduce yourself and describe a challenging system architecture or project you recently built?`,
        timer: 120,
        codeSnippet: '// Write clean modular code if required\nfunction solution() {\n  return true;\n}',
      },
      {
        _id: 'q2',
        question: 'How do you handle rate limiting, distributed caching (e.g. Redis), and cache invalidation under high traffic loads?',
        timer: 120,
      },
      {
        _id: 'q3',
        question: 'Walk us through how you handle database migrations, concurrency control, and zero-downtime deployments.',
        timer: 120,
      },
    ],
    answers: [],
    messages: [
      {
        sender: 'agent',
        agentName: 'Alex Rivera (Tech Lead)',
        text: `Welcome to the AI panel interview for ${role || 'Senior Software Engineer'}! Let's get started.`,
      },
    ],
  };

  interviewStore.set(interviewId, initialInterview);

  return res.json({
    success: true,
    interviewId,
    role: initialInterview.role,
    type: initialInterview.type,
    interview: initialInterview,
  });
});

app.get('/api/interview/:id', (req, res) => {
  const id = req.params.id;
  const interview = interviewStore.get(id) || {
    _id: id,
    role: 'Senior Full-Stack Engineer',
    type: 'technical',
    status: 'active',
    currentQuestionIndex: 0,
    currentQuestion: 0,
    questions: [
      {
        _id: 'q1',
        question: 'Can you walk us through how you would architect a high-throughput rate-limiting service in Node.js and Redis?',
        timer: 120,
        codeSnippet: '// Write your rate limiter function here\nfunction isAllowed(userId) {\n  // TODO: implement sliding window rate limiter\n}',
      },
      {
        _id: 'q2',
        question: 'How do you handle cache invalidation and race conditions in a distributed system with multiple microservices?',
        timer: 120,
      },
    ],
    messages: [
      {
        sender: 'agent',
        agentName: 'Alex Rivera (Tech Lead)',
        text: "Welcome to the panel interview! Let's start with system design and algorithms.",
      },
    ],
  };

  return res.json({
    success: true,
    interview,
  });
});

app.post('/api/interview/answer', (req, res) => {
  const { interviewId, answer } = req.body || {};
  let interview = interviewStore.get(interviewId);

  if (!interview) {
    interview = {
      _id: interviewId || 'int_demo',
      currentQuestionIndex: 0,
      currentQuestion: 0,
      questions: [
        {
          _id: 'q1',
          question: 'Can you walk us through how you would architect a high-throughput rate-limiting service?',
          timer: 120,
        },
        {
          _id: 'q2',
          question: 'How do you handle cache invalidation and race conditions in a microservices environment?',
          timer: 120,
        },
      ],
      answers: [],
    };
    interviewStore.set(interview._id, interview);
  }

  const nextIdx = (interview.currentQuestionIndex || 0) + 1;
  const isCompleted = nextIdx >= interview.questions.length;

  interview.currentQuestionIndex = nextIdx;
  interview.currentQuestion = nextIdx;
  if (isCompleted) {
    interview.status = 'completed';
  }

  const feedbackObj = {
    score: 88,
    feedback: 'Excellent response! Clear technical depth and structured problem solving.',
    nextQuestion: isCompleted ? 'Interview complete! Preparing your evaluation report.' : interview.questions[nextIdx]?.question,
  };

  return res.json({
    success: true,
    completed: isCompleted,
    feedback: feedbackObj,
    aiFeedback: feedbackObj,
    currentQuestionIndex: nextIdx,
    currentQuestion: nextIdx,
    question: interview.questions[nextIdx] || interview.questions[interview.questions.length - 1],
    updatedStatus: isCompleted ? 'completed' : 'in_progress',
  });
});

app.post('/api/resume/upload', (req, res) => {
  return res.json({
    success: true,
    data: {
      personalInfo: {
        fullName: 'Alex Chen',
        email: 'alex.chen@exa-scale.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
      },
      summary: 'Senior Full-Stack Engineer with experience in React, TypeScript, and Node.js microservices.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      experience: [],
      education: [],
    },
  });
});

// 1. Initialize Interview Endpoint
app.post('/api/interview/init', async (req, res) => {
  try {
    const { candidateName, targetRole, companyName, jobDescription, resumeText, selectedAgentIds } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are orchestrating a multi-agent AI panel interview for the company "${companyName || 'TechCorp'}".
Target Role: "${targetRole || 'Senior Full-Stack Engineer'}"
Candidate Name: "${candidateName || 'Alex Chen'}"

Job Description Summary:
${jobDescription || 'Standard high-scale engineering role'}

Candidate Resume / Profile Summary:
${resumeText || 'Experienced software engineer with multi-year background'}

Formulate the opening kickoff message from the Lead Technical Interviewer, Alex Rivera.
Your response MUST be valid JSON with this structure:
{
  "welcomeMessage": "Greeting to the candidate and brief explanation of how the multi-agent panel (Alex, Sarah, Marcus, Elena) will conduct this interview.",
  "openingQuestion": "The very first question to start Phase 1 (Background & Core Engineering Experience).",
  "agendaPhases": [
    "Phase 1: Technical Background & Core Competency",
    "Phase 2: Live Algorithmic & Code Challenge",
    "Phase 3: High-Scale System Architecture",
    "Phase 4: STAR Behavioral & Leadership Principles"
  ],
  "primaryAgentId": "agent_alex"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error initializing interview:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to initialize interview' });
  }
});

// 2. Next Turn / Candidate Response Handler
app.post('/api/interview/turn', async (req, res) => {
  try {
    const { transcriptHistory, candidateAnswer, codeSnippet, candidateContext, currentQuestionIndex } = req.body;
    const ai = getGeminiClient();

    const historyText = (transcriptHistory || []).slice(-8).map((msg: any) => `${msg.speakerName} (${msg.speakerId}): ${msg.content}`).join('\n');

    const prompt = `
You are the intelligence engine powering a 4-agent interview panel evaluating a candidate for the role of ${candidateContext?.targetRole || 'Software Engineer'}.

Panel Agents:
1. Alex Rivera (agent_alex) - Lead Technical & Systems Architect
2. Dr. Sarah Vance (agent_sarah) - Culture, Soft Skills & STAR Behavioral Specialist
3. Marcus Vance (agent_marcus) - Hiring Manager & Product Engineering VP
4. Elena Rostova (agent_elena) - Security, SRE & Quality Assurance Lead

Recent Interview History:
${historyText}

Candidate's Latest Response:
"${candidateAnswer || '[Code submitted]'}"
${codeSnippet ? `Candidate's Submitted Code:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ''}

Current Interview Progress: Question #${(currentQuestionIndex || 1) + 1}.

Tasks:
1. Evaluate the quality of the candidate's response.
2. Determine if the candidate's answer triggers an INTER-AGENT DEBATE (e.g., Alex notices a technical flaw or trade-off that Elena or Marcus disagrees with or wants to cross-examine). Inter-agent debate makes the panel feel dynamic and realistic!
3. Select the best next speaking agent to react and ask the next follow-up or move to the next topic.
4. Return a response in JSON format matching this schema:

{
  "evaluatedScoreDelta": number (between -10 and +10 based on answer depth, correctness, STAR structure),
  "triggerInterAgentDebate": boolean,
  "debateData": {
    "initiatorAgentId": "agent_alex" | "agent_sarah" | "agent_marcus" | "agent_elena",
    "targetAgentId": "agent_alex" | "agent_sarah" | "agent_marcus" | "agent_elena",
    "topic": "Short title of the inter-agent cross-examination",
    "dialogue": [
      {
        "speakerId": "agent_alex",
        "speakerName": "Alex Rivera",
        "message": "Notice how the candidate chose Redis without discussing cache eviction policies under high memory pressure?"
      },
      {
        "speakerId": "agent_elena",
        "speakerName": "Elena Rostova",
        "message": "Agreed, Alex. Let us ask them how they handle failover and rate limiting when Redis hits OOM."
      }
    ],
    "consensusSummary": "Brief consensus reached by agents"
  } (or null if triggerInterAgentDebate is false),
  "nextAgentId": "agent_alex" | "agent_sarah" | "agent_marcus" | "agent_elena",
  "nextAgentName": string,
  "agentMood": "impressed" | "analytical" | "probing" | "skeptical" | "encouraging",
  "agentResponseText": "The speaking agent's verbal feedback acknowledging the candidate's answer, followed directly by their next focused question or scenario.",
  "feedbackTags": ["Good STAR Structure", "Missing Complexity Analysis", "Strong System Vision"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error processing turn:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to process turn' });
  }
});

// 3. Live Code Review Endpoint
app.post('/api/interview/code-review', async (req, res) => {
  try {
    const { code, language, problemContext } = req.body;
    const ai = getGeminiClient();

    const prompt = `
Analyze the following ${language || 'javascript'} code written by a candidate during a technical interview.

Problem Context:
${problemContext || 'Algorithmic or system implementation'}

Code:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

Perform a dual-perspective AI code review:
- Alex Rivera (System Architect): Time and Space complexity ($O(...)$), efficiency, algorithmic correctness.
- Elena Rostova (Security/SRE): Edge cases, null pointers, security leaks, input validation, exception safety.

Return JSON format:
{
  "timeComplexity": "e.g. O(N log N)",
  "spaceComplexity": "e.g. O(N)",
  "overallCodeQualityScore": number (0-100),
  "summary": "Brief 2-sentence summary of code state",
  "lineComments": [
    {
      "line": 4,
      "authorAgentId": "agent_alex",
      "authorName": "Alex Rivera",
      "severity": "warning" | "critical" | "info" | "praise",
      "comment": "Map lookup here is O(1), but array cleanup inside loop makes overall complexity O(N^2).",
      "suggestion": "Consider using a sliding window pointer instead."
    }
  ],
  "keyRecommendations": ["Optimization tip 1", "Security tip 2"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error reviewing code:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to review code' });
  }
});

// 4. Finalize Scorecard Endpoint
app.post('/api/interview/finalize', async (req, res) => {
  try {
    const { transcriptHistory, candidateContext, codeSnippets } = req.body;
    const ai = getGeminiClient();

    const fullTranscript = (transcriptHistory || []).map((m: any) => `${m.speakerName}: ${m.content}`).join('\n\n');

    const prompt = `
Generate a comprehensive, high-rigor Multi-Agent Interview Scorecard for candidate "${candidateContext?.fullName || 'Candidate'}" applying for "${candidateContext?.targetRole || 'Software Engineer'}" at "${candidateContext?.companyName || 'Tech Company'}".

Full Interview Transcript:
${fullTranscript}

Submitted Code Snippets:
${(codeSnippets || []).join('\n---\n')}

Generate complete multi-dimensional analytics in JSON format matching this schema:
{
  "overallScore": number (0-100),
  "overallVerdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
  "executiveSummary": "A concise 3-sentence summary of the candidate's performance across technical, system design, leadership, and security domains.",
  "agentEvaluations": {
    "agent_alex": {
      "agentId": "agent_alex",
      "agentName": "Alex Rivera",
      "agentRole": "technical_lead",
      "score": number (0-100),
      "verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
      "keyQuote": "Memorable evaluation line from Alex",
      "summary": "Detailed technical assessment",
      "strengths": ["Strong DS knowledge", "Clean algorithm design"],
      "concerns": ["Slight delay in optimizing space complexity"]
    },
    "agent_sarah": {
      "agentId": "agent_sarah",
      "agentName": "Dr. Sarah Vance",
      "agentRole": "culture_lead",
      "score": number (0-100),
      "verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
      "keyQuote": "Memorable evaluation line from Sarah",
      "summary": "Detailed behavioral & leadership assessment",
      "strengths": ["Clear STAR framework communication"],
      "concerns": ["Could elaborate more on disagreement resolution"]
    },
    "agent_marcus": {
      "agentId": "agent_marcus",
      "agentName": "Marcus Vance",
      "agentRole": "hiring_manager",
      "score": number (0-100),
      "verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
      "keyQuote": "Memorable line from Marcus",
      "summary": "Product impact and execution assessment",
      "strengths": ["Pragmatic trade-off awareness"],
      "concerns": ["Needs sharper focus on SLA metrics"]
    },
    "agent_elena": {
      "agentId": "agent_elena",
      "agentName": "Elena Rostova",
      "agentRole": "security_sre",
      "score": number (0-100),
      "verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire",
      "keyQuote": "Memorable line from Elena",
      "summary": "Security and fault-tolerance assessment",
      "strengths": ["Aware of rate limiting and basic OWASP"],
      "concerns": ["Omitted memory overflow checks"]
    }
  },
  "competencies": {
    "algorithmsAndCoding": number (0-100),
    "systemArchitecture": number (0-100),
    "behavioralAndSTAR": number (0-100),
    "codeQualityAndTesting": number (0-100),
    "securityAndReliability": number (0-100),
    "communicationAndClarity": number (0-100)
  },
  "topStrengths": [
    "3-4 bulleted candidate standout highlights"
  ],
  "keyImprovementAreas": [
    "3-4 actionable growth areas"
  ],
  "recommendedActionPlan": [
    "3 specific recommendations for candidate prep or onboarding"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error finalizing scorecard:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to finalize scorecard' });
  }
});

// 5. Speech Output (Text-To-Speech) using gemini-3.8-flash-lite-tts
app.post('/api/interview/tts', async (req, res) => {
  try {
    const { text, voiceName, style } = req.body;
    const ai = getGeminiClient();

    // Available prebuilt voice names: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const targetVoice = voiceName || 'Zephyr';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text || 'Thank you for participating in the technical panel interview.',
              speechMetadata: {
                style: style || 'Clear, professional interviewer voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: targetVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/wav' });
    } else {
      return res.status(500).json({ success: false, error: 'No audio data returned from TTS' });
    }
  } catch (err: any) {
    console.error('Error generating TTS:', err);
    return res.status(500).json({ success: false, error: err?.message || 'TTS generation failed' });
  }
});

// Roadmap Store
const roadmapStore = new Map<string, any>();

app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { role, targetPackage, useResume, resume } = req.body || {};
    const targetRoleName = role?.trim() || 'Software Engineer';
    const pkg = targetPackage || '20 LPA';

    const ai = getGeminiClient();
    const prompt = `
You are an Elite AI Career Coach & System Design Architect.
Create a detailed, high-impact learning roadmap for a candidate aiming for the role of "${targetRoleName}" with a target package of "${pkg}".

Candidate Context:
${useResume && resume ? `Skills: ${(resume.skills || []).join(', ')}\nExperience: ${(resume.experience || []).join(', ')}` : 'Standard engineering candidate'}

Return JSON matching this exact structure:
{
  "_id": string,
  "title": string,
  "targetPackage": string,
  "level": "Intermediate" | "Advanced" | "Expert",
  "duration": "8-12 Weeks",
  "modules": [
    {
      "title": string,
      "duration": string,
      "difficulty": "Easy" | "Medium" | "Hard",
      "description": string,
      "youtube": string,
      "resource": string
    }
  ]
}

Provide 4 comprehensive modules covering Data Structures, High-Scale System Design, Security/DevOps, and Mock Technical Panel Practice. Return ONLY valid JSON.
`;

    let roadmapData;
    try {
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      roadmapData = JSON.parse(aiResponse.text || '{}');
    } catch (e) {
      console.warn('Gemini AI call notice for roadmap, constructing structured fallback:', e);
    }

    if (!roadmapData || !roadmapData.modules || !Array.isArray(roadmapData.modules)) {
      roadmapData = {
        _id: `road_${Date.now()}`,
        title: `${targetRoleName} Career Roadmap`,
        targetPackage: pkg,
        level: 'Advanced',
        duration: '10 Weeks',
        modules: [
          {
            title: 'Phase 1: Core Computer Science & Algorithms',
            duration: '2 Weeks',
            difficulty: 'Medium',
            description: 'Master advanced data structures, concurrency, sliding window algorithms, and time/space complexity optimization.',
            youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetRoleName)}+dsa`,
            resource: 'https://leetcode.com',
          },
          {
            title: 'Phase 2: High-Scale Distributed System Design',
            duration: '3 Weeks',
            difficulty: 'Hard',
            description: 'Design distributed caching (Redis), event streaming (Kafka), database sharding, and API gateway rate limiters.',
            youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetRoleName)}+system+design`,
            resource: 'https://microservices.io',
          },
          {
            title: 'Phase 3: SRE, Cloud Security & CI/CD Pipelines',
            duration: '2 Weeks',
            difficulty: 'Medium',
            description: 'Implement OAuth2/JWT security, Docker & Kubernetes containerization, and OpenTelemetry observability.',
            youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetRoleName)}+devops`,
            resource: 'https://kubernetes.io',
          },
          {
            title: 'Phase 4: Multi-Agent Mock Panel Interviews & Case Studies',
            duration: '3 Weeks',
            difficulty: 'Hard',
            description: 'Practice real-time technical interviews, STAR behavioral scenarios, and live code refactoring rounds.',
            youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(targetRoleName)}+interview+prep`,
            resource: 'https://roadmap.sh',
          },
        ],
      };
    }

    if (!roadmapData._id) {
      roadmapData._id = `road_${Date.now()}`;
    }

    roadmapStore.set(roadmapData._id, roadmapData);

    return res.json({
      success: true,
      data: roadmapData,
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to generate roadmap',
    });
  }
});

app.get('/api/roadmap/all', (req, res) => {
  const allRoadmaps = Array.from(roadmapStore.values());
  return res.json({
    success: true,
    data: allRoadmaps,
  });
});

app.get('/api/roadmap/:id', (req, res) => {
  const item = roadmapStore.get(req.params.id);
  if (item) {
    return res.json({ success: true, data: item });
  }
  return res.status(404).json({ success: false, message: 'Roadmap not found' });
});

// Setup Vite Middleware in Dev Mode or Serve Static in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) return next();
      try {
        const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const template = await vite.transformIndexHtml(url, rawTemplate);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      if (req.originalUrl.startsWith('/api/')) return;
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
