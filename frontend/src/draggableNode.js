// // draggableNode.js
export const DraggableNode = ({ type, label, color = '#6366f1' }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      style={{ borderTop: `3px solid ${color}` }}
      className="cursor-grab bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150 select-none min-w-[80px]"
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </div>
  );
};
  