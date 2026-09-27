import React from 'react';
import { ActiveTab } from '../types/interview';
import { Bot, Play, LayoutDashboard, Code, FileText, History, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasActiveSession: boolean;
  onStartNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveSession,
  onStartNew,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Single element wordmark) */}
        <div 
          onClick={() => setActiveTab('setup')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              PanelAI
              <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Multi-Agent
              </span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'setup'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Interview Tracks
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            Live Panel
            {hasActiveSession && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('scorecard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'scorecard'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Scorecards
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Past Sessions
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'customizer'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Agent Customizer
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            Configure Interview
          </button>
        </div>

      </div>
    </header>
  );
};
