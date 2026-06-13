// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  future: [],
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },


  addNode: (node) => {
    set({
      history: [...get().history, { nodes: get().nodes, edges: get().edges }],
      future: [],
      nodes: [...get().nodes, node],
    });
  },

  // onNodesChange: (changes) => {
  //   set({
  //     nodes: applyNodeChanges(changes, get().nodes),
  //   });
  // },

  onNodesChange: (changes) => {
    const positionChange = changes.some(
      (c) => c.type === 'position' && c.dragging === false
    );
    if (positionChange) {
      set({
        history: [...get().history, { nodes: get().nodes, edges: get().edges }],
        future: [],
        nodes: applyNodeChanges(changes, get().nodes),
      });
    } else {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    }
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      history: [...get().history, { nodes: get().nodes, edges: get().edges }],
      future: [],
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.Arrow,
          height: '20px',
          width: '20px',
          color: '#6366f1',
        },
      }, get().edges),
    });
  },

  undo: () => {
    set((state) => {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        nodes: previous.nodes,
        edges: previous.edges,
        history: state.history.slice(0, -1),
        future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        nodes: next.nodes,
        edges: next.edges,
        history: [...state.history, { nodes: state.nodes, edges: state.edges }],
        future: state.future.slice(1),
      };
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
