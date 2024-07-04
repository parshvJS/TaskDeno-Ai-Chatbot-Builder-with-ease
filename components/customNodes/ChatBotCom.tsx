'use client'
import { Handle, Position } from 'reactflow';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useState } from 'react';
import projectContext from '@/context/chatbotContext';

export default function ChatBotCom({
    id,
    removeNode,
    nodes
}: {
    id: string
    removeNode: (id: string | number) => void,
    nodes: []
}) {
    const { project } = useContext(projectContext)
    const [currNode, setCurrNode] = useState({})
    useEffect(() => {
        if (nodes.length !== 0) {
            const currentNode = nodes.filter((node: object) => (node.id == id))
            console.log("nodes", nodes, "currentNode", currentNode, "id", id)
            setCurrNode(currentNode[0])
            
        }
        else {
            console.log("not");

        }
    }, [nodes, project])
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Handle type="target" position={Position.Top} id='b' />
                    <div className='p-2 w-[300px] h-[170px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-md  hover:border-gray-400'>
                        {/* node name */}

                        <Input defaultValue={currNode?.data?.nodeName + 'sdfsd' || "uuuuu"} className='bg-gray-100 border-none p-0 m-0 w-full h-fit focus:border-gray-200 focus:outline-none rounded-sm font-medium ' placeholder="Enter Unique Name" />

                        {/* Ai */}

                        <div className='flex gap-2 mt-2'>
                            <Image
                                src={'/icons/bot.svg'}
                                width={20}
                                height={20}
                                alt="bot"
                            />
                            <p className='font-medium text-12'>{currNode?.data?.message?.type || currNode?.data?.ai?.type || "AI"}</p>
                        </div>

                        <section className='flex flex-col w-full h-[30px] rounded-sm bg-white-1 my-2'>
                            {/* {showUserBlock()} */}
                        </section>




                        {/* User Input */}
                        <div className='flex gap-2 mt-2'>
                            <Image
                                src={'/icons/uInput.svg'}
                                width={18}
                                height={18}
                                alt="bot"
                            />
                            <p className='font-medium text-12'>{currNode?.data?.user?.type || "User Input"}</p>
                        </div>
                        <section className='flex flex-col w-full h-[30px] rounded-sm bg-white-1 my-2'>
                            {/* {showAiblock()} */}
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