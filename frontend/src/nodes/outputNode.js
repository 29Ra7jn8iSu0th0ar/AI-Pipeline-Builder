// // outputNode.js

import { createNode } from './nodeFactory';
import { Position } from 'reactflow';

export const OutputNode = createNode({
  title: 'Output',
  color: '#10b981',

  initState: {
    outputName: 'output_1',
    outputType: 'Text',
  },

  getFields: (state, set) => [
    {
      name: 'outputName',
      label: 'Name',
      type: 'text',
      value: state.outputName,
      onChange: set('outputName'),
    },
    {
      name: 'outputType',
      label: 'Type',
      type: 'select',
      value: state.outputType,
      onChange: set('outputType'),
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' },
      ],
    },
  ],

  getHandles: (id) => [
    {
      id: `${id}-value`,
      type: 'target',
      position: Position.Left,
    },
  ],
});
