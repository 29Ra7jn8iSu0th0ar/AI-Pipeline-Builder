// import { useStore } from './store';
// import { shallow } from 'zustand/shallow';

// const selector = (state) => ({
//   nodes: state.nodes,
//   edges: state.edges,
// });

// export const SubmitButton = () => {
//   const { nodes, edges } = useStore(selector, shallow);

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/pipelines/parse', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ nodes, edges }),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();

//       // ── User-friendly alert
//       alert(
//         `Pipeline Analysis Complete!\n\n` +
//         `Nodes:     ${data.num_nodes}\n` +
//         `Edges:     ${data.num_edges}\n` +
//         `Valid DAG: ${data.is_dag ? '✅ Yes' : '❌ No'}`
//       );

//     } catch (error) {
//       alert(`Error: ${error.message}\n\nMake sure the backend is running on port 8000.`);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6">
//       <button
//         onClick={handleSubmit}
//         className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center gap-2"
//       >
//         <span>▶</span>
//         <span>Run Pipeline</span>
//       </button>
//     </div>
//   );
// };





import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      alert(
        `Pipeline Analysis Complete!\n\n` +
        `Nodes:     ${data.num_nodes}\n` +
        `Edges:     ${data.num_edges}\n` +
        `Valid DAG: ${data.is_dag ? '✅ Yes' : '❌ No'}`
      );

    } catch (error) {
      alert(`Error: ${error.message}\n\nMake sure the backend is running on port 8000.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-6 py-2.5 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-80"
        style={{
          backgroundColor: isLoading ? '#818cf8' : '#4f46e5',
        }}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span>▶</span>
            <span>Run Pipeline</span>
          </>
        )}
      </button>
    </div>
  );
};