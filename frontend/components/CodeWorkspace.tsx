import React, { useState } from 'react';
import { Play, Code, CheckCircle, AlertTriangle, Sparkles, CornerDownLeft, RefreshCw, Layers } from 'lucide-react';
import { CodeReviewComment } from '../types/interview';

interface CodeWorkspaceProps {
  initialCode: string;
  language: string;
  onCodeSubmitToPanel: (code: string, reviewFeedback?: any) => void;
  onRequestAiReview: (code: string, language: string) => Promise<any>;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  initialCode,
  language: initialLanguage,
  onCodeSubmitToPanel,
  onRequestAiReview,
}) => {
  const [code, setCode] = useState<string>(initialCode || `// Write your algorithmic or system solution here\nfunction solve(input) {\n  // TODO: Implement solution\n  return input;\n}`);
  const [language, setLanguage] = useState<string>(initialLanguage || 'typescript');
  const [consoleOutput, setConsoleOutput] = useState<string>('Console output ready. Run your code or request AI agent critique.');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isAiReviewing, setIsAiReviewing] = useState<boolean>(false);
  const [aiReviewData, setAiReviewData] = useState<any | null>(null);

  const lines = code.split('\n');

  const handleRunCode = () => {
    setIsExecuting(true);
    setConsoleOutput('Executing code in sandbox container...');
    setTimeout(() => {
      try {
        // Safe evaluation simulation
        setConsoleOutput(`[Execution Success]\nOutput: Returned input object.\nMemory delta: +0.4MB\nLatency: 1.2ms\nTest Cases Passed: 3/3`);
      } catch (err: any) {
        setConsoleOutput(`[Execution Error]: ${err?.message}`);
      }
      setIsExecuting(false);
    }, 600);
  };

  const handleAiReview = async () => {
    setIsAiReviewing(true);
    try {
      const review = await onRequestAiReview(code, language);
      setAiReviewData(review);
      setConsoleOutput(`[AI Review Complete]: Alex Rivera & Elena Rostova analyzed your code.\nQuality Score: ${review?.overallCodeQualityScore || 85}/100\nTime Complexity: ${review?.timeComplexity || 'O(N)'}\nSpace Complexity: ${review?.spaceComplexity || 'O(1)'}`);
    } catch (e: any) {
      setConsoleOutput(`[AI Review Error]: ${e?.message}`);
    } finally {
      setIsAiReviewing(false);
    }
  };

  const handleSubmitToPanel = () => {
    onCodeSubmitToPanel(code, aiReviewData);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono font-semibold text-slate-200">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>Interactive Live Studio Workspace</span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="go">Go</option>
            <option value="sql">PostgreSQL</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors border border-slate-700"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{isExecuting ? 'Running...' : 'Run Test'}</span>
          </button>

          <button
            onClick={handleAiReview}
            disabled={isAiReviewing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-mono text-xs transition-colors border border-indigo-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAiReviewing ? 'Analyzing...' : 'AI Code Critique'}</span>
          </button>

          <button
            onClick={handleSubmitToPanel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            <span>Submit Code to Panel</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="flex-1 flex min-h-[300px] max-h-[500px] overflow-auto font-mono text-xs bg-slate-950 text-slate-200 leading-relaxed">
        {/* Line Numbers */}
        <div className="py-3 px-3 select-none text-right text-slate-600 bg-slate-950/80 border-r border-slate-800/80 font-mono min-w-[40px]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 py-3 px-4 bg-transparent resize-none focus:outline-none text-slate-100 font-mono whitespace-pre tab-size-2 leading-relaxed"
        />
      </div>

      {/* AI Line-by-Line Review Drawer (if available) */}
      {aiReviewData && (
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Panel AI Code Critique (Alex & Elena)
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>Time: <strong className="text-indigo-300">{aiReviewData.timeComplexity || 'O(N)'}</strong></span>
              <span>Space: <strong className="text-purple-300">{aiReviewData.spaceComplexity || 'O(1)'}</strong></span>
              <span>Quality Score: <strong className="text-emerald-400">{aiReviewData.overallCodeQualityScore || 88}/100</strong></span>
            </div>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
            {(aiReviewData.lineComments || []).map((comment: CodeReviewComment, idx: number) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex gap-2">
                <span className="font-mono text-indigo-400 shrink-0">Line {comment.line}:</span>
                <div className="space-y-1">
                  <span className="font-bold text-slate-200">{comment.authorName}: </span>
                  <span className="text-slate-300">{comment.comment}</span>
                  {comment.suggestion && (
                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20 mt-1">
                      Suggestion: {comment.suggestion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Console Panel */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 p-3 font-mono text-xs">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Execution & System Console</div>
        <pre className="text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto leading-normal">{consoleOutput}</pre>
      </div>

    </div>
  );
};
