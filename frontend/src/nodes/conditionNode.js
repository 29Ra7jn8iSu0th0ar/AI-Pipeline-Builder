import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const ConditionNode = createNode({
  title: '⚡ Condition',
  color: '#f97316',

  initState: {
    operator: 'equals',
    value: '',
  },

  getFields: (state, set) => [
    {
      name: 'operator',
      label: 'Operator',
      type: 'select',
      value: state.operator,
      onChange: set('operator'),
      options: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' },
      ],
    },
    {
      name: 'value',
      label: 'Compare Value',
      type: 'text',
      value: state.value,
      onChange: set('value'),
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