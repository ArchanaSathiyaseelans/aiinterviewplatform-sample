import React, { useState } from 'react';
import { AgentProfile, CandidateContext, InterviewTrack } from '../types/interview';
import { PRESET_TRACKS } from '../data/defaultAgents';
import { 
  Layers, Cpu, Brain, ShieldAlert, Kanban, 
  Sparkles, User, Building, FileText, Check, 
  Sliders, ArrowRight, ShieldCheck, Zap, Upload, Code
} from 'lucide-react';

interface SetupViewProps {
  agents: AgentProfile[];
  onStartSession: (context: CandidateContext, track?: InterviewTrack) => void;
  isLoading: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({
  agents,
  onStartSession,
  isLoading,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<InterviewTrack>(PRESET_TRACKS[0]);
  const [candidateName, setCandidateName] = useState<string>('Alex Chen');
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack Engineer');
  const [targetLevel, setTargetLevel] = useState<string>('Senior');
  const [companyName, setCompanyName] = useState<string>('ExaScale Systems');
  const [jobDescription, setJobDescription] = useState<string>(PRESET_TRACKS[0].sampleJobDescription);
  const [resumeText, setResumeText] = useState<string>(
    'Experienced Full-Stack Engineer with 6+ years in TypeScript, React, Node.js, and PostgreSQL. Built distributed caching layers with Redis and deployed Kubernetes workloads on AWS.'
  );
  const [strictnessMode, setStrictnessMode] = useState<'encouraging' | 'standard' | 'rigorous'>('standard');
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(agents.map((a) => a.id));

  const handleSelectTrack = (track: InterviewTrack) => {
    setSelectedTrack(track);
    setTargetRole(track.title);
    setTargetLevel(track.roleLevel);
    setJobDescription(track.sampleJobDescription);
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      if (selectedAgentIds.length <= 1) return; // Must have at least 1 agent
      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
    } else {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    }
  };

  const handleLaunch = () => {
    const context: CandidateContext = {
      fullName: candidateName || 'Candidate',
      targetRole: targetRole || 'Software Engineer',
      targetLevel: targetLevel || 'Senior',
      companyName: companyName || 'Tech Company',
      jobDescription,
      resumeText,
      strictnessMode,
      selectedAgentIds,
    };
    onStartSession(context, selectedTrack);
  };

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Kanban': return <Kanban className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 p-8 md:p-10 overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI Panel Candidate Evaluation Engine</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Multi-Agent Panel <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              AI Interview Platform
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Experience cross-examination interviews conducted concurrently by specialized AI Agents. 
            Evaluate technical architecture, STAR behavioral principles, pragmatic product trade-offs, and security resilience in real-time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Voice Speech (Gemini TTS)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Code & System Design Workspace</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Agent Consensus Scorecards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Track Selector Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100">1. Select Interview Track</h2>
            <p className="text-xs text-slate-400">Choose a predefined role benchmark or customize below</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESET_TRACKS.map((track) => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {getTrackIcon(track.iconName)}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  {track.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{track.roleLevel}</span>
                  <span>~{track.estimatedMinutes}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate & Context Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Candidate & Role details */}
        <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">2. Candidate & Target Context</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Candidate Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Alex Chen"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Company</label>
              <div className="relative">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. ExaScale Systems"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Seniority Level</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Junior">Junior Engineer</option>
                <option value="Mid">Mid-Level Engineer</option>
                <option value="Senior">Senior Engineer</option>
                <option value="Staff / Principal">Staff / Principal Architect</option>
                <option value="Lead / Management">Engineering Manager / Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Job Description / Key Requirements</span>
              <span className="text-[11px] text-slate-500 font-normal">AI agents tailor questions to this spec</span>
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              placeholder="Paste job description or requirements here..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Candidate Resume / Background Summary</span>
              <span className="text-[11px] text-indigo-400 font-normal flex items-center gap-1">
                <Upload className="w-3 h-3" /> Pre-loaded
              </span>
            </label>
            <textarea
              rows={3}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              placeholder="Paste resume or background experience..."
            />
          </div>
        </div>

        {/* Right 1 Column: Panel Agents Selector & Rigor */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-display font-bold text-slate-100">3. Multi-Agent Panel</h2>
            </div>

            {/* Agent Checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Active Panel Evaluators</span>
              {agents.map((agent) => {
                const isChecked = selectedAgentIds.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-slate-950 border-slate-700'
                        : 'bg-slate-950/40 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{agent.name}</h4>
                        <span className={`text-[10px] font-mono ${agent.colorTheme.badgeText}`}>
                          {agent.styleBadge}
                        </span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rigor Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Interview Strictness Level</span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setStrictnessMode('encouraging')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    strictnessMode === 'encouraging' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Encouraging
                </button>
                <button
                  type="button"
                  onClick={() => setStrictnessMode('standard')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    strictnessMode === 'standard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setStrictnessMode('rigorous')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    strictnessMode === 'rigorous' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hardcore
                </button>
              </div>
            </div>
          </div>

          {/* Launch CTA */}
          <button
            onClick={handleLaunch}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Initializing Multi-Agent Panel...
              </span>
            ) : (
              <>
                <span>Launch Multi-Agent Panel Interview</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
