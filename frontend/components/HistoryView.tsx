import React from 'react';
import { FullInterviewScorecard } from '../types/interview';
import { History, Award, Calendar, ArrowRight, Trash2, Sparkles } from 'lucide-react';

interface HistoryViewProps {
  pastScorecards: FullInterviewScorecard[];
  onSelectScorecard: (scorecard: FullInterviewScorecard) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  pastScorecards,
  onSelectScorecard,
  onClearHistory,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            <span>Past Candidate Interviews & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review multi-agent scorecards and historical candidate performance</p>
        </div>

        {pastScorecards.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {pastScorecards.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Past Sessions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete a multi-agent AI panel interview to save scorecards and performance analytics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastScorecards.map((sc, i) => (
            <div
              key={i}
              onClick={() => onSelectScorecard(sc)}
              className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold">{sc.companyName || 'ExaScale'}</span>
                <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Score: {sc.overallScore}/100
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {sc.candidateName}
                </h3>
                <p className="text-xs text-slate-400">{sc.targetRole}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {sc.createdAt || 'Recent'}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  View Scorecard <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
