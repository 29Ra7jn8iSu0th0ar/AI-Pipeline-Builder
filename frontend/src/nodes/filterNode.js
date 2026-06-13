import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const FilterNode = createNode({
  title: '🔍 Filter',
  color: '#ef4444',

  initState: {
    condition: 'contains',
    keyword: '',
  },

  getFields: (state, set) => [
    {
      name: 'condition',
      label: 'Condition',
      type: 'select',
      value: state.condition,
      onChange: set('condition'),
      options: [
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does Not Contain' },
        { value: 'starts_with', label: 'Starts With' },
        { value: 'ends_with', label: 'Ends With' },
      ],
    },
    {
      name: 'keyword',
      label: 'Keyword',
      type: 'text',
      value: state.keyword,
      onChange: set('keyword'),
    },
  ],

  getHandles: (id) => [
    {
      id: `${id}-input`,
      type: 'target',
      position: Position.Left,
    },
    {
      id: `${id}-true`,
      type: 'source',
      position: Position.Right,
      style: { top: '33%' },
    },
    {
      id: `${id}-false`,
      type: 'source',
      position: Position.Right,
      style: { top: '66%' },
    },
  ],
});

