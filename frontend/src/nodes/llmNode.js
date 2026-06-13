// // llmNode.js

import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const LLMNode = createNode({
  title: 'LLM',
  color: '#8b5cf6',

  initState: {},

  getFields: () => [],

  getHandles: (id) => [
    {
      id: `${id}-system`,
      type: 'target',
      position: Position.Left,
      style: { top: '33%' },
    },
    {
      id: `${id}-prompt`,
      type: 'target',
      position: Position.Left,
      style: { top: '66%' },
    },
    {
      id: `${id}-response`,
      type: 'source',
      position: Position.Right,
    },
  ],
});