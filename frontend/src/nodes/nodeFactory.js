import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const createNode = (config) => {
  const {
    title,
    color = '#1C2536',
    initState = {},
    getFields,
    getHandles,
  } = config;

  return function NodeComponent({ id, data }) {
    const [state, setState] = useState(() => {
      const initial = {};
      Object.keys(initState).forEach((key) => {
        initial[key] = data?.[key] ?? initState[key];
      });
      return initial;
    });

    const set = (key) => (value) =>
      setState((prev) => ({ ...prev, [key]: value }));

    const fields = getFields ? getFields(state, set) : [];
    const handles = getHandles ? getHandles(id, state) : [];

    return (
      <BaseNode
        id={id}
        data={data}
        title={title}
        color={color}
        fields={fields}
        handles={handles}
      />
    );
  };
};