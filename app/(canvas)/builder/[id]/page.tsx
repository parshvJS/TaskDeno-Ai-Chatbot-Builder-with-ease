'use client'
import React, { useContext, useCallback, useEffect, useMemo, use } from 'react';
import SidePanel from '@/components/ui/SidePanel';
import projectContext from '@/context/chatbotContext';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, useReactFlow, Node, Edge, OnNodesChange, OnEdgesChange, Connection, EdgeChange, NodeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatBotCom from '@/components/customNodes/ChatBotCom';
import { nanoid } from 'nanoid';

export default function App() {
  const { getPreviousData, project, isSyncLoading, setProject, setIsStoredInDb, storeChangesInDb } = useContext(projectContext);
  const params = useParams<{ id: string }>();

  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(() => ({
    chatbotCommand: (props: any) => <ChatBotCom {...props} removeNode={removeNode} />
  }), []);

  // State to manage nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  useEffect(() => {
   async function fetchData() {
      const data = await getPreviousData(params.id);
      setNodes(data.nodes);
      setEdges(data.edges);
    } fetchData();


    return ()=>{
      setProject({})
      console.log("i am cleaning here");
      
    }
  }, [params.id])


  async function syncChangesToContext() {
    console.log("added to project ", project, nodes, edges);

      console.log("added to project dfdf  ");
      setProject((prevProject: any) => ({
        ...prevProject,
        nodes: nodes,
        edges: edges
      }));
      
      console.log("added to project successfull");
    
  }



  const addNode = useCallback((type: string, label: string) => {
    setIsStoredInDb(false);

    const { x, y, zoom } = reactFlowInstance.getViewport();
    const position = {
      x: x + window.innerWidth / 2 / zoom - 250,
      y: y + window.innerHeight / 2 / zoom - 150,
    };
    const newNode = {
      id: `Group-${nanoid(4)}`,
      type: 'chatbotCommand',
      position: position,
      data: { label: label },
    };
    setNodes((nds) => [...nds, newNode]);
    console.log("Node added:", newNode);
  }, [reactFlowInstance, setProject, setIsStoredInDb]);

  const removeNode = useCallback((id: string) => {
    setIsStoredInDb(false);

    setNodes((nds) => nds.filter((node) => node.id !== id));

    console.log("Node removed:", id);
  }, [setProject, setIsStoredInDb]);

  if (isSyncLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <LoaderCircle width={60} height={60} className='animate-spin' />
        <p className='text-24 text-gray-600 font-semibold'>Loading Your Project!</p>
      </div>
    );
  }


  // handleNodeChange
  function handleNodeChange<OnNodesChange>(changes:NodeChange[]){
    setIsStoredInDb(false)
    onNodesChange(changes)
  }
  // handleEdgeChange
  function handleEdgeChange<OnEdgesChange>(changes:EdgeChange[]){
    setIsStoredInDb(false)
    onEdgesChange(changes)
  }


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodeChange}
        onEdgesChange={handleEdgeChange}
      >
        <Background />
        <div className='flex items-center w-full h-full'>
          <SidePanel
            addNode={addNode}
            syncChangesToContext={syncChangesToContext}
          />
        </div>
      </ReactFlow>
    </div>
  );
}
