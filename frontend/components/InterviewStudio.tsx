import React, { useState, useEffect, useRef } from 'react';
import { 
  AgentProfile, CandidateContext, TranscriptMessage, 
  CodeReviewComment, ArchitectureNode, ArchitectureConnection 
} from '../types/interview';
import { CodeWorkspace } from './CodeWorkspace';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { 
  Play, Pause, Mic, MicOff, Send, Code, Network, 
  MessageSquare, Volume2, Sparkles, AlertCircle, 
  CheckCircle, ArrowRight, Clock, Award, ShieldAlert, Zap
} from 'lucide-react';

interface InterviewStudioProps {
  agents: AgentProfile[];
  context: CandidateContext;
  transcript: TranscriptMessage[];
  activeAgentId: string;
  isProcessing: boolean;
  onSendCandidateAnswer: (answerText: string, codeSnippet?: string) => Promise<void>;
  onRequestCodeReview: (code: string, language: string) => Promise<any>;
  onFinalizeInterview: () => void;
  onRequestTtsAudio: (text: string, voiceName: string) => Promise<string | null>;
}

export const InterviewStudio: React.FC<InterviewStudioProps> = ({
  agents,
  context,
  transcript,
  activeAgentId,
  isProcessing,
  onSendCandidateAnswer,
  onRequestCodeReview,
  onFinalizeInterview,
  onRequestTtsAudio,
}) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'transcript' | 'code' | 'architecture'>('transcript');
  const [candidateInput, setCandidateInput] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(145);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [candidateCode, setCandidateCode] = useState<string>('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!candidateInput.trim() && !candidateCode.trim()) return;
    const textToSend = candidateInput.trim() || 'Submitted candidate response.';
    setCandidateInput('');
    await onSendCandidateAnswer(textToSend, candidateCode || undefined);
  };

  const handlePlayAgentSpeech = async (msgId: string, text: string, voiceName: string) => {
    if (playingAudioId === msgId && audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
      return;
    }

    try {
      setPlayingAudioId(msgId);
      const audioBase64 = await onRequestTtsAudio(text, voiceName);
      if (audioBase64) {
        const audioUrl = `data:audio/wav;base64,${audioBase64}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setPlayingAudioId(null);
        } else {
          const newAudio = new Audio(audioUrl);
          audioRef.current = newAudio;
          newAudio.play();
          newAudio.onended = () => setPlayingAudioId(null);
        }
      } else {
        setPlayingAudioId(null);
      }
    } catch (e) {
      console.error('Audio playback error:', e);
      setPlayingAudioId(null);
    }
  };

  const activeSpeakingAgent = agents.find((a) => a.id === activeAgentId) || agents[0];
  const lastDebateMessage = transcript.slice().reverse().find((m) => m.isInterAgentDebate);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl">
        
        {/* Left: Candidate Info & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-indigo-400">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{context.fullName}</span>
              <span className="text-xs text-slate-400 font-normal">→ {context.targetRole} ({context.companyName})</span>
            </h2>
          </div>
        </div>

        {/* Center: Workspace Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveWorkspaceTab('transcript')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeWorkspaceTab === 'transcript'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Transcript</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeWorkspaceTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Workspace</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeWorkspaceTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>System Design Canvas</span>
          </button>
        </div>

        {/* Right: End & Finalize */}
        <button
          onClick={onFinalizeInterview}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all"
        >
          <Award className="w-4 h-4 text-rose-400" />
          <span>Finalize Scorecard</span>
        </button>

      </div>

      {/* Multi-Agent Panel Video Grid (4 Evaluator Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const isActiveSpeaker = agent.id === activeAgentId;
          return (
            <div
              key={agent.id}
              className={`relative rounded-2xl p-4 bg-slate-900 border transition-all overflow-hidden ${
                isActiveSpeaker
                  ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                  : 'border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Agent Portrait Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                <img
                  src={agent.avatarUrl}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Animated Audio Waveform Overlay if Speaking */}
                {isActiveSpeaker && isProcessing && (
                  <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px] flex items-center justify-center gap-1">
                    <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-10 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-8 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                  </div>
                )}

                {/* Speaker Status Pill */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono flex items-center gap-1.5 text-slate-200">
                  <span className={`w-2 h-2 rounded-full ${isActiveSpeaker ? 'bg-indigo-400 animate-ping' : 'bg-slate-600'}`} />
                  <span>{isActiveSpeaker ? 'Speaking' : 'Listening'}</span>
                </div>
              </div>

              {/* Agent Title & Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{agent.name}</h3>
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${agent.colorTheme.badgeBg} ${agent.colorTheme.badgeText}`}>
                    {agent.title.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{agent.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inter-Agent Debate Banner (Shown when panel cross-examines) */}
      {lastDebateMessage && lastDebateMessage.debateData && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Inter-Agent Panel Cross-Examination: "{lastDebateMessage.debateData.topic}"
            </span>
            <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Live Debate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {lastDebateMessage.debateData.dialogue.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300 font-mono text-[11px]">{d.speakerName}:</span>
                <p className="text-slate-300 italic">"{d.message}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Studio Content Body */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Workspace Switcher Content */}
        {activeWorkspaceTab === 'code' ? (
          <CodeWorkspace
            initialCode={candidateCode}
            language="typescript"
            onCodeSubmitToPanel={async (codeText) => {
              setCandidateCode(codeText);
              setActiveWorkspaceTab('transcript');
              await onSendCandidateAnswer(`Here is my implementation in the code workspace:`, codeText);
            }}
            onRequestAiReview={onRequestCodeReview}
          />
        ) : activeWorkspaceTab === 'architecture' ? (
          <ArchitectureCanvas
            onSubmitDiagramToPanel={async (nodes, conns) => {
              const summary = `System Architecture Diagram submitted with ${nodes.length} components (${nodes.map((n) => n.label).join(', ')}).`;
              setActiveWorkspaceTab('transcript');
              await onSendCandidateAnswer(summary);
            }}
          />
        ) : (
          /* Live Transcript Stream */
          <div className="flex flex-col h-[520px] bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            
            {/* Messages Container */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {transcript.map((msg) => {
                const isUser = msg.speakerId === 'user';
                const agent = agents.find((a) => a.id === msg.speakerId);

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src={agent?.avatarUrl || activeSpeakingAgent.avatarUrl}
                        alt={msg.speakerName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 mt-1"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div className={`max-w-2xl rounded-2xl p-4 space-y-2 border ${
                      isUser
                        ? 'bg-indigo-600/20 border-indigo-500/30 text-slate-100 rounded-tr-none'
                        : 'bg-slate-950 border-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 gap-4">
                        <span className="font-bold text-slate-200">{msg.speakerName}</span>
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {!isUser && agent && (
                            <button
                              onClick={() => handlePlayAgentSpeech(msg.id, msg.content, agent.voiceName)}
                              className="p-1 rounded hover:bg-slate-800 text-indigo-400 transition-colors"
                              title="Listen to Agent Voice"
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === msg.id ? 'text-emerald-400 animate-pulse' : ''}`} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      {/* Code snippet inside transcript message if provided */}
                      {msg.codeSnippet && (
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-indigo-300">
                          <pre>{msg.codeSnippet}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-3 text-xs text-indigo-400 font-mono">
                  <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  <span>Panel evaluating answer & synthesizing response...</span>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Candidate Response Input Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <textarea
                  rows={2}
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your answer to the panel... (Press Enter to send)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isMicActive ? 'bg-rose-600/20 border-rose-500/40 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Microphone Toggle"
                  >
                    {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={isProcessing || (!candidateInput.trim() && !candidateCode.trim())}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span>Tip: Switch to "Code Workspace" or "System Design Canvas" to illustrate your answer visually.</span>
                <span className="text-indigo-400">Panel Active: {agents.length} Evaluators</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
