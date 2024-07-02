'use client'
import projectContext from '@/context/chatbotContext';
import { useCallback, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Input } from "@/components/ui/input"
import { nodeSchema } from '@/schema/nodeSchema';
import { z } from 'zod';
import Image from 'next/image';
const handleStyle = { left: 10 };

export default function ChatBotCom({
    id,
    userInputType,
    aiResponse,
    removeNode
}: {
    id: string
    userInputType: string,
    aiResponse: string,
    removeNode:(id:string | number)=>void
}) {

    const { project, debounceSync, setProject } = useContext(projectContext)

    function onSubmit(values: z.infer<typeof nodeSchema>) {
        console.log(values)
    }



    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Handle type="target" position={Position.Top} id='b' />
                    <div className='p-2 w-[300px] h-[170px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-md  hover:border-gray-400'>
                        {/* node name */}

                        <Input defaultValue={`Group # ${(Math.floor(Math.random() * 1000)) + 1}`} className='bg-gray-100 border-none p-0 m-0 w-full h-fit focus:border-gray-200 focus:outline-none rounded-sm font-medium ' placeholder="Enter Unique Name" />

                        {/* Ai */}

                        <div className='flex gap-2 mt-2'>
                            <Image
                                src={'/icons/bot.svg'}
                                width={20}
                                height={20}
                                alt="bot"
                            />
                            <p className='font-medium text-12'>AI</p>
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
                            <p className='font-medium text-12'>User Input</p>
                        </div>
                        <section className='flex flex-col w-full h-[30px] rounded-sm bg-white-1 my-2'>
                            {/* {showAiblock()} */}
                        </section>
                    </div>
                    <Handle type="source" position={Position.Bottom} id="a" />

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