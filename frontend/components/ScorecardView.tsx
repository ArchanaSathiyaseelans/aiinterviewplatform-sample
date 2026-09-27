import React from 'react';
import { FullInterviewScorecard, AgentProfile } from '../types/interview';
import { 
  Award, CheckCircle, AlertTriangle, Sparkles, 
  TrendingUp, ArrowLeft, Download, Share2, 
  ShieldCheck, UserCheck, Code, Cpu, Brain, Lock
} from 'lucide-react';

interface ScorecardViewProps {
  scorecard: FullInterviewScorecard;
  agents: AgentProfile[];
  onBackToSetup: () => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({
  scorecard,
  agents,
  onBackToSetup,
}) => {
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Strong Hire':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Hire':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Weak Hire':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'No Hire':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Custom SVG Radar Chart Calculation
  const competencies = [
    { label: 'Algorithms', score: scorecard.competencies?.algorithmsAndCoding || 85 },
    { label: 'Architecture', score: scorecard.competencies?.systemArchitecture || 90 },
    { label: 'Behavioral STAR', score: scorecard.competencies?.behavioralAndSTAR || 88 },
    { label: 'Code Quality', score: scorecard.competencies?.codeQualityAndTesting || 92 },
    { label: 'Security & SRE', score: scorecard.competencies?.securityAndReliability || 84 },
    { label: 'Communication', score: scorecard.competencies?.communicationAndClarity || 91 },
  ];

  const centerX = 120;
  const centerY = 120;
  const radius = 80;

  const points = competencies.map((c, i) => {
    const angle = (Math.PI * 2 / competencies.length) * i - Math.PI / 2;
    const r = (c.score / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, labelX: centerX + (radius + 22) * Math.cos(angle), labelY: centerY + (radius + 15) * Math.sin(angle), ...c };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSetup}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interview Setup</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Scorecard report exported successfully.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => alert('Shareable evaluation link copied to clipboard.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Evaluation</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Hero Card */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest mb-1">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Multi-Agent Consensus Verdict</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              {scorecard.candidateName}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {scorecard.targetRole} · {scorecard.companyName || 'ExaScale Systems'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Overall Score</span>
              <span className="text-3xl md:text-5xl font-display font-extrabold text-indigo-400">
                {scorecard.overallScore}<span className="text-slate-600 text-xl md:text-2xl">/100</span>
              </span>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl border text-sm font-bold tracking-wide uppercase shadow-lg ${getVerdictBadge(scorecard.overallVerdict)}`}>
              {scorecard.overallVerdict}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Panel Executive Summary</h3>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
            "{scorecard.executiveSummary}"
          </p>
        </div>
      </div>

      {/* Radar Chart & Agent Verdict Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: SVG Radar Chart */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-4">
          <h3 className="text-sm font-display font-bold text-slate-100 self-start">6-Dimensional Competency Radar</h3>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg width="240" height="240" className="overflow-visible">
              {/* Concentric Circles */}
              {[0.25, 0.5, 0.75, 1].map((level, idx) => (
                <circle
                  key={idx}
                  cx={centerX}
                  cy={centerY}
                  r={radius * level}
                  fill="none"
                  stroke="rgba(51, 65, 85, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="2"
                />
              ))}

              {/* Axis Lines */}
              {competencies.map((_, i) => {
                const angle = (Math.PI * 2 / competencies.length) * i - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + radius * Math.cos(angle)}
                    y2={centerY + radius * Math.sin(angle)}
                    stroke="rgba(51, 65, 85, 0.6)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Polygon Shape */}
              <polygon
                points={polygonPath}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#818cf8"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#a5b4fc" />
                  <text
                    x={p.labelX}
                    y={p.labelY}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-300 font-semibold"
                  >
                    {p.label} ({p.score})
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right 2 Columns: Individual Agent Scorecards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(scorecard.agentEvaluations || {}).map(([id, evalData]) => {
            const agent = agents.find((a) => a.id === id) || agents[0];
            return (
              <div key={id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatarUrl}
                      alt={evalData.agentName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{evalData.agentName}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{agent.styleBadge}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-indigo-400">{evalData.score}</span>
                    <span className="text-slate-500 text-xs">/100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  "{evalData.keyQuote}"
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {evalData.summary}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Candidate Strengths & Actionable Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Strengths */}
        <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Key Candidate Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(scorecard.topStrengths || [
              'Demonstrated clean modular architecture using microservices and Redis caching',
              'Articulated trade-offs with structured STAR responses during behavioral evaluation',
              'Strong awareness of rate limiting and security headers'
            ]).map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Key Areas for Growth</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(scorecard.keyImprovementAreas || [
              'Consider explicitly discussing space complexity trade-offs before coding',
              'Elaborate on SLA monitoring and circuit breaker patterns in distributed setups',
              'Quantify business impact and revenue metrics when describing past project wins'
            ]).map((g, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
