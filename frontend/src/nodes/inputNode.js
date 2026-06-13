// // inputNode.js

import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const InputNode = createNode({
  title: 'Input',
  color: '#0ea5e9',

  initState: {
    inputName: 'input_1',
    inputType: 'Text',
  },

  getFields: (state, set) => [
    {
      name: 'inputName',
      label: 'Name',
      type: 'text',
      value: state.inputName,
      onChange: set('inputName'),
    },
    {
      name: 'inputType',
      label: 'Type',
      type: 'select',
      value: state.inputType,
      onChange: set('inputType'),
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' },
      ],
    },
  ],

  getHandles: (id) => [
    {
      id: `${id}-value`,
      type: 'source',
      position: Position.Right,
    },
  ],
});