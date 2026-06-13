// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------


import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';

import 'reactflow/dist/style.css';
// add these imports at the top with the others
import { FilterNode } from './nodes/filterNode';
import { APINode } from './nodes/apiNode';
import { MathNode } from './nodes/mathNode';
import { NoteNode } from './nodes/noteNode';
import { ConditionNode } from './nodes/conditionNode';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// update nodeTypes object
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  apiCall: APINode,
  math: MathNode,
  note: NoteNode,
  condition: ConditionNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    return (
  <>
    <div
      ref={reactFlowWrapper}
      style={{ width: '100vw', height: '70vh' }}
      className="bg-gray-50"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        fitView
      >
        <Background
          color="#e2e8f0"
          gap={gridSize}
          variant="dots"
        />
        <Controls className="shadow-lg rounded-lg" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'customInput': return '#0ea5e9';
              case 'llm': return '#8b5cf6';
              case 'customOutput': return '#10b981';
              case 'text': return '#f59e0b';
              case 'filter': return '#ef4444';
              case 'apiCall': return '#06b6d4';
              case 'math': return '#7c3aed';
              case 'note': return '#84cc16';
              case 'condition': return '#f97316';
              default: return '#6366f1';
            }
          }}
          className="shadow-lg rounded-lg border border-gray-200"
        />
      </ReactFlow>
    </div>
  </>
);
}

