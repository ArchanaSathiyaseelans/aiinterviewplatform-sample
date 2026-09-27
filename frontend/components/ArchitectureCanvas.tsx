import React, { useState } from 'react';
import { ArchitectureNode, ArchitectureConnection } from '../types/interview';
import { Network, Plus, Trash2, Send, Server, Database, Zap, Layers, Globe, Shield } from 'lucide-react';

interface ArchitectureCanvasProps {
  initialNodes?: string[];
  onSubmitDiagramToPanel: (nodes: ArchitectureNode[], connections: ArchitectureConnection[]) => void;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  initialNodes = ['CDN Edge', 'API Gateway', 'Node.js Service', 'Redis Cache', 'PostgreSQL DB'],
  onSubmitDiagramToPanel,
}) => {
  const [nodes, setNodes] = useState<ArchitectureNode[]>([
    { id: '1', type: 'cdn', label: 'CDN Edge', x: 40, y: 100 },
    { id: '2', type: 'gateway', label: 'API Gateway', x: 220, y: 100 },
    { id: '3', type: 'service', label: 'App Service Cluster', x: 400, y: 100 },
    { id: '4', type: 'cache', label: 'Redis L2 Cache', x: 400, y: 220 },
    { id: '5', type: 'database', label: 'PostgreSQL DB', x: 600, y: 100 },
  ]);

  const [connections, setConnections] = useState<ArchitectureConnection[]>([
    { id: 'c1', from: '1', to: '2', label: 'HTTPS' },
    { id: 'c2', from: '2', to: '3', label: 'gRPC' },
    { id: 'c3', from: '3', to: '4', label: 'Cache Lookup' },
    { id: 'c4', from: '3', to: '5', label: 'SQL Write' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const addNode = (type: ArchitectureNode['type'], label: string) => {
    const newNode: ArchitectureNode = {
      id: Date.now().toString(),
      type,
      label,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setConnections(connections.filter((c) => c.from !== id && c.to !== id));
  };

  const handleDrag = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    // Basic position update simulation
    const canvas = e.currentTarget.parentElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 120, e.clientX - rect.left - 50));
    const y = Math.max(20, Math.min(rect.height - 60, e.clientY - rect.top - 20));

    setNodes(nodes.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const getNodeIcon = (type: ArchitectureNode['type']) => {
    switch (type) {
      case 'cdn': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'gateway': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'service': return <Server className="w-4 h-4 text-indigo-400" />;
      case 'cache': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'database': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'queue': return <Layers className="w-4 h-4 text-rose-400" />;
      default: return <Server className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono font-semibold text-slate-200">
          <Network className="w-4 h-4 text-indigo-400" />
          <span>Interactive System Architecture Canvas</span>
        </div>

        {/* Node Palette Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => addNode('gateway', 'API Gateway')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 border border-slate-700 shrink-0"
          >
            <Plus className="w-3 h-3 text-purple-400" /> + Gateway
          </button>
          <button
            onClick={() => addNode('service', 'Microservice')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 border border-slate-700 shrink-0"
          >
            <Plus className="w-3 h-3 text-indigo-400" /> + Service
          </button>
          <button
            onClick={() => addNode('cache', 'Redis Cache')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 border border-slate-700 shrink-0"
          >
            <Plus className="w-3 h-3 text-amber-400" /> + Cache
          </button>
          <button
            onClick={() => addNode('database', 'Database Cluster')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 border border-slate-700 shrink-0"
          >
            <Plus className="w-3 h-3 text-emerald-400" /> + DB
          </button>
          <button
            onClick={() => addNode('queue', 'Kafka Queue')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono flex items-center gap-1 border border-slate-700 shrink-0"
          >
            <Plus className="w-3 h-3 text-rose-400" /> + Queue
          </button>
        </div>

        <button
          onClick={() => onSubmitDiagramToPanel(nodes, connections)}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          Submit Diagram to Panel
        </button>
      </div>

      {/* Interactive Visual Canvas Area */}
      <div className="relative flex-1 min-h-[350px] bg-slate-950 p-6 overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* SVG Connections Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 60;
            const y1 = fromNode.y + 25;
            const x2 = toNode.x + 60;
            const y2 = toNode.y + 25;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(99, 102, 241, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="3" fill="#818cf8" />
              </g>
            );
          })}
        </svg>

        {/* Nodes Grid */}
        <div className="relative w-full h-full z-10">
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              onMouseDown={(e) => handleDrag(node.id, e)}
              onClick={() => setSelectedNodeId(node.id)}
              className={`absolute cursor-move p-3 rounded-xl bg-slate-900 border shadow-lg flex items-center gap-2.5 select-none transition-shadow ${
                selectedNodeId === node.id
                  ? 'border-indigo-500 shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                {getNodeIcon(node.type)}
              </div>
              <span className="text-xs font-mono font-semibold text-slate-100">{node.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="text-slate-600 hover:text-rose-400 p-0.5 ml-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Topology: {nodes.length} Components, {connections.length} System Streams</span>
        <span className="text-indigo-400">Drag nodes to position architecture</span>
      </div>

    </div>
  );
};
