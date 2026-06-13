import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const APINode = createNode({
  title: '🌐 API Call',
  color: '#06b6d4',

  initState: {
    url: '',
    method: 'GET',
  },

  getFields: (state, set) => [
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      value: state.method,
      onChange: set('method'),
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      value: state.url,
      onChange: set('url'),
    },
  ],

  getHandles: (id) => [
    {
      id: `${id}-input`,
      type: 'target',
      position: Position.Left,
    },
    {
      id: `${id}-response`,
      type: 'source',
      position: Position.Right,
      style: { top: '33%' },
    },
    {
      id: `${id}-error`,
      type: 'source',
      position: Position.Right,
      style: { top: '66%' },
    },
  ],
});