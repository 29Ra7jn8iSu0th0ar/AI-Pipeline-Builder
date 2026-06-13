import { Handle, Position } from 'reactflow';

export const BaseNode = ({ id, data, title, color = '#6366f1', fields = [], handles = [] }) => {
  return (
    <div
      className="rounded-lg shadow-md border border-gray-350 bg-white min-w-[160px] overflow-visible"
      style={{ borderTop: `3px solid ${color}` }}
    >
      {/* Header */}
      <div
        className="px-2 py-1.5 flex items-center justify-between"
        // style={{ borderBottom: '1px solid #f1f5f9' }}
        style={{ borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[8px] font-mono text-gray-300 bg-gray-50 px-1 py-0.5 rounded ml-2">
          {id}
        </span>
      </div>

      {/* Body */}
      <div className="px-2 py-1.5 flex flex-col gap-1.5">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-0.5">
            <label className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="text-[10px] border border-gray-200 rounded-md px-1.5 py-1 bg-gray-50 text-gray-700 focus:outline-none cursor-pointer"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                rows={2}
                className="text-[10px] border border-gray-200 rounded-md px-1.5 py-1 bg-gray-50 text-gray-700 focus:outline-none resize-none"
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="text-[10px] border border-gray-200 rounded-md px-1.5 py-1 bg-gray-50 text-gray-700 focus:outline-none"
              />
            )}
          </div>
        ))}

        {/* Static content */}
        {data?.content && (
          <p className="text-[10px] text-gray-500 italic">{data.content}</p>
        )}
      </div>

      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            width: 8,
            height: 8,
            backgroundColor: color,
            border: '2px solid white',
            boxShadow: '0 0 0 1px ' + color,
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};