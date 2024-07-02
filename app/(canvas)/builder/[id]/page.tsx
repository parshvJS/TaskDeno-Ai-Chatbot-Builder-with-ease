'use client'
import React, { useContext, useCallback, useEffect, useMemo } from 'react';
import SidePanel from '@/components/ui/SidePanel';
import projectContext from '@/context/chatbotContext';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Panel, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatBotCom from '@/components/customNodes/ChatBotCom';

const initialNodes = [
  {
    "id": "input-1",
    "type": "chatbotCommand",
    "position": {
      "x": 768,
      "y": 396
    },
    "data": {
      "label": "Text"
    }
  },
  {
    "id": "input-2",
    "type": "chatbotCommand",
    "position": {
      "x": 347.5,
      "y": 396
    },
    "data": {
      "label": "Text"
    }
  }
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(() => ({ chatbotCommand: (props: any) => <ChatBotCom {...props} removeNode={removeNode} /> }), []);

  const { getPreviousData, project, isSyncLoading, debounceSync, setProject } = useContext(projectContext);
  const params = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    getPreviousData(params.id);
  }, []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  // Function to add a new node
  const addNode = useCallback((type, label) => {
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const position = {
      x: x + window.innerWidth / 2 / zoom + (-250),
      y: y + window.innerHeight / 2 / zoom + (-150),
    };
    const newNode = {
      id: `${type}-${nodes.length + 1}`,
      type: 'chatbotCommand',
      position: position,
      data: { label: label },
    };
    setNodes((nds) => [...nds, newNode]);
    setProject((prevNodes: any) => ({
      ...prevNodes,
      nodes: [...prevNodes.nodes, newNode],
    }));
  }, [nodes, setNodes]);

  const removeNode = useCallback((id: any) => {
    console.log("got", id, "removing");

    setProject(
      (prevNodes: any) => {
        console.log(prevNodes, "is processing");

        return prevNodes.nodes?.filter((node: any) => node.id !== id)
      }
    );
    console.log("removed", nodes);
  }, [project]);



  if (isSyncLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <LoaderCircle width={60} height={60} className='animate-spin' />
        <p className='text-24 text-gray-600 font-semibold'>Loading Your Project!</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <div className='flex items-center w-full h-full'>
          <SidePanel addNode={addNode} />
        </div>
      </ReactFlow>
    </div>
  )
}
