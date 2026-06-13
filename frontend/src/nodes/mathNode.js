import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const MathNode = createNode({
  title: '🧮 Math',
  color: '#7c3aed',

  initState: {
    operation: 'add',
  },

  getFields: (state, set) => [
    {
      name: 'operation',
      label: 'Operation',
      type: 'select',
      value: state.operation,
      onChange: set('operation'),
      options: [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (-)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' },
      ],
    },
  ],

  getHandles: (id) => [
    {
      id: `${id}-a`,
      type: 'target',
      position: Position.Left,
      style: { top: '33%' },
    },
    {
      id: `${id}-b`,
      type: 'target',
      position: Position.Left,
      style: { top: '66%' },
    },
    {
      id: `${id}-result`,
      type: 'source',
      position: Position.Right,
    },
  ],
});