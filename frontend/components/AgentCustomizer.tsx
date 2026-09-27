import React, { useState } from 'react';
import { AgentProfile } from '../types/interview';
import { Settings, Bot, Volume2, ShieldCheck, Sparkles, Save } from 'lucide-react';

interface AgentCustomizerProps {
  agents: AgentProfile[];
  onUpdateAgents: (updatedAgents: AgentProfile[]) => void;
}

export const AgentCustomizer: React.FC<AgentCustomizerProps> = ({
  agents,
  onUpdateAgents,
}) => {
  const [editingAgents, setEditingAgents] = useState<AgentProfile[]>(agents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);

  const activeAgent = editingAgents.find((a) => a.id === selectedAgentId) || editingAgents[0];

  const handleUpdateField = (field: keyof AgentProfile, value: any) => {
    setEditingAgents(
      editingAgents.map((a) => (a.id === selectedAgentId ? { ...a, [field]: value } : a))
    );
  };

  const handleSave = () => {
    onUpdateAgents(editingAgents);
    alert('Agent system prompts and configurations saved.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>AI Panel Agent Customizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure agent personalities, evaluation focus areas, system prompts, and Gemini voice personas</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Agent Selector Column */}
        <div className="space-y-3">
          {editingAgents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/40'
                }`}
              >
                <img
                  src={agent.avatarUrl}
                  alt={agent.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{agent.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{agent.title}</p>
                  <span className={`inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${agent.colorTheme.badgeBg} ${agent.colorTheme.badgeText}`}>
                    {agent.styleBadge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Agent Editor */}
        <div className="md:col-span-2 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <img
              src={activeAgent.avatarUrl}
              alt={activeAgent.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-100">{activeAgent.name}</h2>
              <p className="text-xs text-slate-400">{activeAgent.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agent Full Name</label>
              <input
                type="text"
                value={activeAgent.name}
                onChange={(e) => handleUpdateField('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gemini TTS Voice Name</label>
              <select
                value={activeAgent.voiceName}
                onChange={(e) => handleUpdateField('voiceName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="Zephyr">Zephyr (Deep, Authoritative Tech)</option>
                <option value="Kore">Kore (Warm, Empathetic Culture)</option>
                <option value="Puck">Puck (Direct, Dynamic Executive)</option>
                <option value="Fenrir">Fenrir (Analytical, Sharp Security)</option>
                <option value="Charon">Charon (Calm, Precise SRE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personality & Demeanor</label>
            <input
              type="text"
              value={activeAgent.personality}
              onChange={(e) => handleUpdateField('personality', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agent System Prompt Directive</label>
            <textarea
              rows={4}
              value={activeAgent.systemPrompt}
              onChange={(e) => handleUpdateField('systemPrompt', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
