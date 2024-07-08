'use client'
import React, { useContext, useCallback, useEffect, useMemo, use, useState } from 'react';
import SidePanel from '@/components/ui/SidePanel';
import projectContext from '@/context/chatbotContext';
import { LoaderCircle, LoaderPinwheel } from 'lucide-react';
import { useParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, useReactFlow, Node, Edge, OnNodesChange, OnEdgesChange, Connection, EdgeChange, NodeChange, useNodes, StraightEdge, StepEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import ChatBotCom from '@/components/customNodes/ChatBotCom';
import { nanoid } from 'nanoid';
import RightSideBar from '@/components/ui/RightSideBar';
import SidebarContext from '@/context/RightSideBarContext';
import { useToast } from '@/components/ui/use-toast';

export default function App() {
  const { getPreviousData, project, isSyncLoading, setProject, setIsStoredInDb, storeChangesInDb } = useContext(projectContext);
  const { isSidebarActive, setIsSidebarActive, sidebar } = useContext(SidebarContext)
  const params = useParams<{ id: string }>();

  const reactFlowInstance = useReactFlow();


  // State to manage nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  //cache data for project that will be stored
  const [variables, setVariables] = useState([])
  const [aiPrompt, setAiPrompt] = useState([])
  const [aiModel, setAiModel] = useState("")

  // toast
  const { toast } = useToast()

  const nodeTypes = useMemo(() => ({
    chatbotCommand: (props: any) => <ChatBotCom {...props} removeNode={removeNode} nodes={nodes} />
  }), [setNodes, project]);

  // gets previous user data that user have created
  useEffect(() => {
    async function fetchData() {
      const data = await getPreviousData(params.id);
      console.log("page:: GetPreviousData", data);

      setNodes(data.nodes);
      setEdges(data.edges);
      setVariables(data.variables)
      setAiPrompt(data.aiPrompts)
      setAiModel(data.aiModel)
      // const currentNode = nodes.filter((node:object)=> (node.id !== 'Group-22Zl'))

    }
    fetchData();
    return () => {
      setProject({})

    }
  }, [params.id])

  // sync sidebar data to nodes
  useEffect(() => {
    const filteredNode = nodes.filter((node) => node.id !== sidebar.activeNodeId)
    const changedNode = sidebar.currentNode;
    const newNodes = [...filteredNode, changedNode]
    console.log("Page::useEffect::sidebar changed so node changed", newNodes);
    setNodes(newNodes)
  }, [sidebar])

  async function syncChangesToContext() {

    setProject((prevProject: any) => ({
      ...prevProject,
      nodes: nodes,
      edges: edges,
      variables: variables,
      aiPrompt: aiPrompt,
      aiModel: aiModel
    }));
  }

  const addNode = useCallback((type: string, label: string, initialDatagram: object) => {
    setIsStoredInDb(false);
    const uniqueName = `Group-${nanoid(4)}`;
    let data;
    let emptyUser = {
      type: "",
      variable: ""
    }
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
        user: emptyUser
      };
    } else if (type === 'ai') {
      data = {
        nodeName: uniqueName,
        isStaticMessage: false,
        ai: initialDatagram,
        user: emptyUser
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
    console.log("Page::addNode::data is", data);

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, setNodes, setIsStoredInDb]);


  const removeNode = useCallback((id: string) => {
    setIsStoredInDb(false);
    setIsSidebarActive(false)
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [setProject, setIsStoredInDb]);


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
  const onConnect = (params: Connection) => {
    const { source, target } = params;

    // Check if the target node already has an outgoing edge
    if (nodes.find(node => node.id === source && edges.some(edge => edge.source === source))) {
      toast({
        title: "Can't connect this node",
        description: "One node can only have one output,use conditions to create more that one output connections ! ",
        variant: "destructive",
      })
      return;
    }

    // Add the edge if conditions are met
    setEdges((prevEdges) => addEdge({ ...params, type: "smoothstep", animated: true, className: "border-2 border-gray-300" }, prevEdges));
  };


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
        fitView
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
            isSidebarActive && <RightSideBar
              variables={variables}
              setVariables={setVariables}
            />
          }
        </div>

      </ReactFlow>
    </div>
  );
}
