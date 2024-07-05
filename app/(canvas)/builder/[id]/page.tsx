'use client'
import React, { useContext, useCallback, useEffect, useMemo, use, useState } from 'react';
import SidePanel from '@/components/ui/SidePanel';
import projectContext from '@/context/chatbotContext';
import { LoaderCircle, LoaderPinwheel } from 'lucide-react';
import { useParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, useReactFlow, Node, Edge, OnNodesChange, OnEdgesChange, Connection, EdgeChange, NodeChange, useNodes } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatBotCom from '@/components/customNodes/ChatBotCom';
import { nanoid } from 'nanoid';
import Logo from '@/components/Logo';
import RightSideBar from '@/components/ui/RightSideBar';
import SidebarContext from '@/context/RightSideBarContext';

export default function App() {
  const { getPreviousData, project, isSyncLoading, setProject, setIsStoredInDb, storeChangesInDb } = useContext(projectContext);
  const { isSidebarActive, setIsSidebarActive } = useContext(SidebarContext)
  const params = useParams<{ id: string }>();

  const reactFlowInstance = useReactFlow();


  // State to manage nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  //cache data for project that will be stored
  const [variables, setVariables] = useState([])
  const [aiPrompt, setAiPrompt] = useState([])
  const [aiModel, setAiModel] = useState("")
  const nodeTypes = useMemo(() => ({
    chatbotCommand: (props: any) => <ChatBotCom {...props} removeNode={removeNode} nodes={nodes} />
  }), [setNodes, project]);

  useEffect(() => {
    async function fetchData() {
      const data = await getPreviousData(params.id);
      console.log(data, "get previous data")
      setNodes(data.nodes);
      setEdges(data.edges);
      setVariables(data.variables)
      setAiPrompt(data.aiPrompts)
      setAiModel(data.aiModel)
      // const currentNode = nodes.filter((node:object)=> (node.id !== 'Group-22Zl'))
      // console.log("nodes",nodes,"currentNode",currentNode,"id",id)
    }
    fetchData();
    return () => {
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

  const addNode = useCallback((type: string, label: string, initialDatagram: object) => {
    setIsStoredInDb(false);
    const uniqueName = `Group-${nanoid(4)}`;
    let data;

    if (type === 'user') {
      data = {
        nodeName: uniqueName,
        isStaticMessage: false,
        user: initialDatagram,
      };
    } else if (type === 'message') {
      data = {
        nodeName: uniqueName,
        isStaticMessage: true,
        message: initialDatagram,
      };
    } else if (type === 'ai') {
      data = {
        nodeName: uniqueName,
        isStaticMessage: false,
        ai: initialDatagram,
      };
    }

    const { x, y, zoom } = reactFlowInstance.getViewport();
    const position = {
      x: (window.innerWidth / 2 - x) / zoom - 250,
      y: (window.innerHeight / 2 - y) / zoom - 150,
    };

    const newNode = {
      id: uniqueName,
      type: 'chatbotCommand',
      position: position,
      data: data,
    };

    setNodes((nds) => [...nds, newNode]);
    console.log("Node added:", newNode);
  }, [reactFlowInstance, setNodes, setIsStoredInDb]);


  const removeNode = useCallback((id: string) => {
    setIsStoredInDb(false);
    setIsSidebarActive(false)
    setNodes((nds) => nds.filter((node) => node.id !== id));

    console.log("Node removed:", id);
  }, [setProject, setIsStoredInDb]);


  const onConnect = (params: any) => {
    setEdges((eds) => addEdge(params, eds))

  }


  // handleNodeChange
  function handleNodeChange<OnNodesChange>(changes: NodeChange[]) {
    setIsStoredInDb(false)
    onNodesChange(changes)
  }
  // handleEdgeChange
  function handleEdgeChange<OnEdgesChange>(changes: EdgeChange[]) {
    setIsStoredInDb(false)
    onEdgesChange(changes)
  }



  useEffect(() => {
    console.log("connectet", nodes, edges);
  }, [edges])


  // JSX boundry
  if (isSyncLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center flex-col'>

        <LoaderPinwheel width={30} height={30} className='animate-spin text-gray-600' />
        <p className='text-16  font-semibold text-gray-600'>Setting Up Builder!</p>

      </div>
    );
  }



  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodeChange}
        onEdgesChange={handleEdgeChange}
        onConnect={onConnect}
      >
        <Background />
        <div className='flex items-center w-full h-full'>
          <SidePanel
            nodes={nodes}
            setNodes={setNodes}
            addNode={addNode}
            syncChangesToContext={syncChangesToContext}
            aiModel={aiModel}
            aiPrompt={aiPrompt}
            variables={variables}
            setAiModel={setAiModel}
            setAiPrompt={setAiPrompt}
            setVariables={setVariables}
          />
          {
            isSidebarActive ? <RightSideBar /> : null
          }
        </div>

      </ReactFlow>
    </div>
  );
}
