import { createNode } from './nodeFactory';

export const NoteNode = createNode({
  title: '📝 Note',
  color: '#84cc16',

  initState: {
    note: '',
  },

  getFields: (state, set) => [
    {
      name: 'note',
      label: 'Content',
      type: 'textarea',
      value: state.note,
      onChange: set('note'),
    },
  ],

  getHandles: () => [],
});