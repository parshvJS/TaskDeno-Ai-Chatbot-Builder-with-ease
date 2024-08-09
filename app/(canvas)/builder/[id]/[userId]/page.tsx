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
import { StarterNode } from '@/components/customNodes/StarterNode';
import { setupDevBundler } from 'next/dist/server/lib/router-utils/setup-dev-bundler';
import axios from 'axios';

export default function App() {
  const { getPreviousData, project, isSyncLoading, setProject, setIsStoredInDb, storeChangesInDb } = useContext(projectContext);
  const { isSidebarActive, setIsSidebarActive, sidebar } = useContext(SidebarContext)
  const params = useParams<{ id: string }>();
  const [isPublished, setIsPublished] = useState(project.isPublished)
  const [isPublishLoading, setIsPublishLoading] = useState(false)

  useEffect(()=>{
    console.log(isPublished,"chained 999999999999999999999")
  },[isPublished])

  useEffect(()=>{
    console.log('iiiiiiiiiiiiiiiii',project.isPublished,'client',isPublished);
    
    setIsPublished(project.isPublished)
  },[project.isPublished])

  const reactFlowInstance = useReactFlow();


  // State to manage nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([
    {
      id: "start101",
      type: "startNode",
      data: {
        label: "Start"
      },
      position: {
        x: 518,
        y: 246
      }
    }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  //cache data for project that will be stored
  const [variables, setVariables] = useState([])
  const [aiPrompt, setAiPrompt] = useState([])
  const [aiModel, setAiModel] = useState("")

  // toast
  const { toast } = useToast()

  const nodeTypes = useMemo(() => ({
    chatbotCommand: (props: any) => <ChatBotCom {...props} removeNode={removeNode} nodes={nodes} />,
    startNode: (props: any) => <StarterNode {...props} />
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

  // 

  async function syncChangesToContext() {
    const tempTest = {
      nodes: nodes,
      edges: edges,
      variables: variables,
      aiPrompt: aiPrompt,
      aiModel: aiModel
    }

    console.log("Page::syncChangesToContext::data is", tempTest);

    setProject((prevProject: any) => ({
      ...prevProject,
      nodes: nodes,
      edges: edges,
      variables: variables,
      aiPrompts: aiPrompt,
      aiModel: aiModel
    }));
  }

  const addNode = useCallback((type: string, label: string, initialDatagram: object) => {
    setIsStoredInDb(false);
    setIsPublished(false)
   
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
        ai: {
          type: "text",
          content: "",
          variable: ""
        }
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
    setIsPublished(false)

    setIsSidebarActive(false);
    // Remove the node by filtering out the node with the matching id
    setNodes((nds) => nds.filter((node) => node.id !== id));
    // Remove any edges connected to the node
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setIsStoredInDb, setIsSidebarActive, setNodes, setEdges]);


  // handleNodeChange
  function handleNodeChange<OnNodesChange>(changes: NodeChange[]) {
    setIsStoredInDb(false)


    onNodesChange(changes)
  }
  // handleEdgeChange
  function handleEdgeChange<OnEdgesChange>(changes: EdgeChange[]) {
    setIsStoredInDb(false)


    console.log("edge is being deleted", changes);

    onEdgesChange(changes)
  }

  const onConnect = (params) => {
    const { source } = params;

    const sourceHasOutgoingEdge = edges.some(edge => edge.source === source);
    if (sourceHasOutgoingEdge) {
      toast({
        title: "Cannot add edge",
        description: "This node already has an output. Nodes can only have one output edge.",
        variant: "destructive"
      });
      return;
    }
    setEdges((prevEdges) => addEdge({ ...params, type: "smoothstep", animated: true, className: "border-2 border-gray-300" }, prevEdges));
  };

  async function handlePublish() {
    try {

      await syncChangesToContext()
      setIsPublishLoading(true)
      const response = await axios.post('/api/saveExecutionMap', {
        projectId: project.project_id,
        nodes: project.nodes,
        edges: project.edges
      })
      console.log(response.data, response.data.success, response.data.statuscode, "0000000000000000000000000000000000000000000000");

      if (response.data.success == false || response.data.statuscode == 400 || response.data.statuscode == 404) {
        console.log("777777777777772727272");
       

        toast({
          title: "Can't Publish your Project !",
          description: response?.data?.message || "",
          variant: "destructive"
        })
      }
      else {
        setIsPublished(true)
        setProject((prevValues) => {
          return {
            ...prevValues,
            isPublished:true
          }
        })
        toast({
          title: "Published!",
          description: response.data.message || "",
          variant: "success"
        })
      }
    
    } catch (error: any) {
      toast({
        title: "Can't Publish your Project !",
        description: error.message,
        variant: "destructive"
      })

      throw new Error(error.message)

    } finally {
      setIsPublishLoading(false)
    }
  }
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
            setIsPublished={setIsPublished}
            isPublished={isPublished}
            setIsPublishLoading={setIsPublishLoading}
            isPublishLoading={isPublishLoading}
            handlePublish={handlePublish}
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
