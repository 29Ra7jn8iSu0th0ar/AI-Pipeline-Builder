// // toolbar.js

import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const nodeList = [
  { type: 'customInput', label: 'Input', color: '#0ea5e9' },
  { type: 'llm', label: 'LLM', color: '#8b5cf6' },
  { type: 'customOutput', label: 'Output', color: '#10b981' },
  { type: 'text', label: 'Text', color: '#f59e0b' },
  { type: 'filter', label: 'Filter', color: '#ef4444' },
  { type: 'apiCall', label: 'API Call', color: '#06b6d4' },
  { type: 'math', label: 'Math', color: '#7c3aed' },
  { type: 'note', label: 'Note', color: '#84cc16' },
  { type: 'condition', label: 'Condition', color: '#f97316' },
];

const selector = (state) => ({
  undo: state.undo,
  redo: state.redo,
  history: state.history,
  future: state.future,
});

export const PipelineToolbar = () => {
  const { undo, redo, history, future } = useStore(selector, shallow);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">

      {/* Top row — nodes label + undo/redo */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nodes
          </span>
        </div>

        {/* Undo / Redo buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={history.length === 0}
            title="Undo"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: history.length > 0 ? '#6366f1' : '#e2e8f0',
              color: history.length > 0 ? '#6366f1' : '#9ca3af',
              backgroundColor: history.length > 0 ? '#eef2ff' : '#f9fafb',
            }}
          >
            ↩ Undo
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: future.length > 0 ? '#6366f1' : '#e2e8f0',
              color: future.length > 0 ? '#6366f1' : '#9ca3af',
              backgroundColor: future.length > 0 ? '#eef2ff' : '#f9fafb',
            }}
          >
            Redo ↪
          </button>
        </div>
      </div>

      {/* Node buttons */}
      <div className="flex flex-wrap gap-2">
        {nodeList.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.label}
            color={node.color}
          />
        ))}
      </div>
    </div>
  );
};


