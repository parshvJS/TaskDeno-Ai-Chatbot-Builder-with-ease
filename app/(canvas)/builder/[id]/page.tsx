"use client"
import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import SidePanel from '@/components/ui/SidePanel';
import projectContext from '@/context/chatbotContext';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatBotCom from '@/components/customNodes/ChatBotCom';

const initialNodes = [
  { id: '1', position: { x: 500, y: 50 }, data: { label: 'Start' },type:'chatbotCommand' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const nodeTypes = useMemo(() => ({ chatbotCommand: ChatBotCom }), []);

  const { getPreviousData, project, isSyncLoading } = useContext(projectContext);
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


  if (isSyncLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <LoaderCircle width={60} height={60} className='animate-spin' />
        <p className='text-24 text-gray-600 font-semibold'>Loading Your Project!</p>
      </div>
    );
  }

  return (

    <div
      style={{ width: '100vw', height: '100vh' }}

    >
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
          <SidePanel />
        </div>
      </ReactFlow>
    </div>
  )    
}
