import { Handle, Position, useReactFlow } from 'reactflow';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import SidebarContext from '@/context/RightSideBarContext';
import { cn } from '@/lib/utils';

// Define the types for your node and sidebar context if not already defined
interface NodeData {
    data?: {
        nodeName?: string;
        message?: {
            type?: string;
        };
        ai?: {
            type?: string;
        };
        user?: {
            type?: string;
        };
    };
}

interface SidebarContextType {
    isSidebarActive: boolean;
    setIsSidebarActive: (active: boolean) => void;
    setSidebar: (sidebar: { activeNodeId: string; currentNode: NodeData }) => void;
    sidebar: {
        activeNodeId: string;
        currentNode: NodeData;
    };
}

export default function ChatBotCom({
    id,
    removeNode,
    nodes
}: {
    id: string;
    removeNode: (id: string | number) => void;
    nodes: NodeData[]; // Adjusted type here
}) {
    const { isSidebarActive, setIsSidebarActive, setSidebar, sidebar } = useContext(SidebarContext) as SidebarContextType;
    const [currNode, setCurrNode] = useState<NodeData>({});
    const { getNode } = useReactFlow();
    const [awake, setAwake] = useState(false);

    useEffect(() => {
        if (sidebar.activeNodeId === id) {
            const currentNode = sidebar.currentNode;
            console.log("nodeType::useEffect::sidebar changed so nodeType change", currentNode);
            setCurrNode(currentNode);
        }
    }, [sidebar, id]);

    useEffect(() => {
        const currentNode = getNode(id);
        console.log("nodeType::useEffect::initial values setting", currentNode);
        setCurrNode(currentNode || {});
    }, [getNode, id]);

    function handleRightSideBar() {
        setAwake(!awake);
        const currentNode = getNode(id);
        setCurrNode(currentNode || {});
        setSidebar({
            activeNodeId: id,
            currentNode: currentNode || {}
        });
        setIsSidebarActive(true);
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Handle type="target" position={Position.Top} id='b' />
                    <div
                        onClick={handleRightSideBar}
                        className={cn(
                            'p-2 w-[260px] h-[190px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400',
                            { "border-black 2s linear infinite border-2": (sidebar.activeNodeId === id) }
                        )}
                    >
                        {/* node name */}
                        <p className='font-medium text-14 mb-2'>{currNode?.data?.nodeName}</p>
                        {/* <Input defaultValue={currNode?.data?.nodeName} className='bg-gray-100 border-none p-0 m-0 w-full h-fit focus:border-gray-200 focus:outline-none rounded-sm font-medium ' placeholder="Enter Unique Name" /> */}

                        {/* Ai */}
                        <div className='p-1 rounded-sm'>
                            <div className='flex gap-2'>
                                {
                                    currNode?.data?.message?.type ?
                                        <Image
                                            src={'/icons/chat.svg'}
                                            width={16}
                                            height={16}
                                            alt="bot"
                                        /> :
                                        <Image
                                            src={'/icons/bot.svg'}
                                            width={20}
                                            height={20}
                                            alt="bot"
                                        />
                                }
                                <p className='font-medium text-12'>Chatbot</p>
                            </div>

                            <section className='flex w-full h-[30px] rounded-sm bg-white-1 my-2 items-center'>
                                <Image
                                    src={'/icons/edgeOver.svg'}
                                    width={18}
                                    height={18}
                                    alt="type"
                                    className='ml-1 mr-0 p-0 text-gray-1'
                                />
                                <p className='font-medium ml-2 text-12 capitalize'>
                                    {currNode?.data?.message?.type || currNode?.data?.ai?.type || "Select"}
                                </p>
                            </section>
                        </div>

                        {/* User Input */}
                        <div className='flex gap-2 mt-2'>
                            <Image
                                src={'/icons/uInput.svg'}
                                width={18}
                                height={18}
                                alt="user"
                            />
                            <p className='font-medium text-12'>User</p>
                        </div>
                        <section className='flex w-full h-[30px] rounded-sm bg-white-1 my-2 items-center'>
                            <Image
                                src={'/icons/edgeOver.svg'}
                                width={18}
                                height={18}
                                alt="type"
                                className='ml-1 mr-0 p-0 text-gray-1'
                            />
                            <p className='font-medium ml-2 text-12 capitalize'>
                                {currNode?.data?.user?.type || "Select"}
                            </p>
                        </section>
                    </div>
                    <Handle type="source" position={Position.Bottom} id="a" className='w-2 h-2 text-yellow-4' />
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem className='flex gap-2 items-center' onClick={() => removeNode(id)}>
                        <Image
                            src={'/icons/delete.svg'}
                            width={16}
                            height={16}
                            alt='delete'
                        />
                        <p className='text-red-600 font-semibold'>Delete</p>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    );
}
