// // textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const updateNodeInternals = useUpdateNodeInternals(id);
  const textareaRef = useRef(null);

  // ── Part 3A: extract {{ variable }} names ──
  useEffect(() => {
    const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    const found = [];
    let match;
    while ((match = regex.exec(currText)) !== null) {
      const varName = match[1].trim();
      if (!found.includes(varName)) {
        found.push(varName);
      }
    }
    setVariables(found);
  }, [currText]);

  // ── Part 3A: update node internals AFTER variables state updates ──
  // setTimeout ensures ReactFlow has finished its own render cycle
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateNodeInternals(id);
    }, 0);
    return () => clearTimeout(timeout);
  }, [variables, id, updateNodeInternals]);

  // ── Part 3B: auto-resize textarea height ──
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // ── dynamic width based on longest line ──
  const lines = currText.split('\n');
  const longestLine = Math.max(...lines.map((l) => l.length), 10);
  const dynamicWidth = Math.max(200, Math.min(500, longestLine * 8 + 40));

  const color = '#f59e0b';

  return (
    <div
      className="rounded-xl shadow-lg border border-gray-200 bg-white overflow-visible"
      style={{ width: dynamicWidth, borderTop: `4px solid ${color}` }}
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Text
          </span>
        </div>
        <span className="text-[9px] font-mono text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded">
          {id}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 flex flex-col gap-2">
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Text
        </label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          rows={1}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700 focus:outline-none resize-none overflow-hidden w-full"
        />

        {/* Variable tags */}
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {variables.map((v) => (
              <span key={v}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: '#fef3c7',
                  borderColor: '#f59e0b',
                  color: '#92400e',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic handles left */}
      {variables.map((varName, index) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${((index + 1) / (variables.length + 1)) * 100}%`,
            width: 10,
            height: 10,
            backgroundColor: color,
            border: '2px solid white',
            boxShadow: `0 0 0 1px ${color}`,
          }}
        />
      ))}

      {/* Static output handle right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: 10,
          height: 10,
          backgroundColor: color,
          border: '2px solid white',
          boxShadow: `0 0 0 1px ${color}`,
        }}
      />
    </div>
  );
};


