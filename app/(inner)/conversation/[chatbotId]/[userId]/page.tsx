'use client'
import { Button } from '@/components/ui/button'
import Chat from '@/components/ui/Chat'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { timeAgo } from '@/lib/helper'
import axios from 'axios'
import { BrainCog, CircleUser, LoaderPinwheel } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
    const [allChatData, setAllChatData] = useState([])
    const [chatMessages, setChatMessages] = useState([])
    const [activeChatName, setActiveChatName] = useState("")
    const [aiSummery, setAiSummery] = useState("")
    const [activeLeadsField, setActiveLeadsField] = useState({})
    const [isChatPanelLoading, setIsChatPanelLoading] = useState(true)
    const [isMessagePanelLoading, setIsMessagePanelLoading] = useState(false)
    const [activeChatPanel, setActiveChatPanel] = useState(-1)
    const [paginationNum, setPaginationNum] = useState(1)
    const [isChatEmpty, setIsChatEmpty] = useState(false)
    const params: { chatbotId: string, userId: string } = useParams()
    const { toast } = useToast()

    async function getChatPanelData() {
        try {
            setIsChatPanelLoading(true)
            const chatData = await axios.post('/api/getAllconversations', {
                projectId: params.chatbotId,
                paginationNum: paginationNum
            })
            console.log(chatData, "is chat bot panel data!!!")
            if (!chatData.data.success) {
                toast({
                    title: "Can't load Chats!",
                    description: "Error",
                    variant: "destructive"
                })
            }

            if (chatData.data.data.length == 0) {
                setIsChatEmpty(true)
                return;
            }

            setAllChatData(chatData.data.data)
        } catch (error: any) {
            toast({
                title: "Can't Load Conversation",
                description: error.message,
                variant: "destructive"
            })

        } finally {
            setIsChatPanelLoading(false)
        }
    }

    useEffect(() => {
        getChatPanelData()
    }, [paginationNum])

    useEffect(() => {
        async function fetchData() {
            if (activeChatPanel == -1) {
                return
            }
            console.log(activeChatPanel, "is active chat panel")
            try {
                setIsMessagePanelLoading(true)
                const conversation = await axios.post('/api/getChatFromConversation', {
                    projectId: params.chatbotId,
                    InstanceId: activeChatPanel
                })
                setChatMessages(conversation.data.data.conversation);
                setAiSummery(conversation.data.data.aiSummery);
                setActiveChatName(conversation.data.data.nickname.replace("_", " "));
                setActiveLeadsField(conversation.data.data.leadInfo);
                console.log(conversation.data.data.conversation, "is conversation data")
            } catch (error: any) {
                toast({
                    title: "Can't Load Chat",
                    description: error.message,
                    variant: "destructive"
                })

            } finally {
                setIsMessagePanelLoading(false)
            }
        }
        fetchData()
    }, [activeChatPanel])

    function handleActiveConversation(index: number) {
        setActiveChatPanel(allChatData[index].instanceId);
    }
    return (
        <div className='w-full h-full flex'>
            <ScrollArea className='w-1/4  h-screen'>
                <div className='h-14 flex items-center p-4'>
                    <p className='font-semibold text-xl capitalize'>Conversation</p>
                </div>
                <Separator className='bg-yellow-2' />

                {
                    isChatEmpty ? (
                        <div className='flex flex-col justify-center items-center h-full mt-[20%]'>
                            <Image
                                src={'/images/no-pro-illu.png'}
                                alt='ideas'
                                width={210}
                                height={210}
                            />
                            <h1 className='font-bold text-xl mx-5 text-center '>You Dont Have Any Conversations Right Not</h1>
                        </div>
                    ) : (
                        isChatPanelLoading ? (
                            <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
                                <LoaderPinwheel
                                    className='animate-spin'
                                    width={25}
                                    height={25}
                                />
                                <p className='text-gray-1 font-semibold'>Loading conversatiosn</p>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center '>
                                {
                                    allChatData && allChatData.map((chat, index) => {
                                        const isActive = chat.instanceId == activeChatPanel;
                                        return <div key={index} onClick={() => handleActiveConversation(index)} className={`w-full p-3 hover:bg-yellow-50 cursor-pointer ${isActive ? "bg-yellow-100" : ""}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image
                                                    src={'/icons/user-icon.svg'}
                                                    width={30}
                                                    height={30}
                                                    alt='user'
                                                    color='#000'
                                                />
                                                <div className=''>

                                                    <p className='text-sm capitalize font-normal'>{chat?.nickname.replace("_", " ") || `User Chat #${index}`}</p>
                                                    <p className='text-xs text-gray-600'>{timeAgo(chat.createdAt)}</p>

                                                </div>
                                            </div>
                                        </div>
                                    })
                                }

                            </div>
                        )
                    )
                }
                <div className='flex justify-between items-center w-full p-4'>
                    <Button onClick={()=>setPaginationNum(paginationNum-1)}>Previous</Button>
                    <Button onClick={()=>setPaginationNum(paginationNum+1)}>Next</Button>
                </div>
            </ScrollArea >
            <Separator orientation="vertical" className='bg-yellow-2' />
            <ScrollArea className='w-[50%] h-full flex justify-center items-center'>
                {
                    activeChatPanel === -1 ? (
                        <div className='flex justify-center items-center w-full h-full flex-col'>
                            <Image
                                src='/icons/chat-illu.svg'
                                width={650}
                                height={400}
                                alt="chatbot"
                                className='max-w-full max-h-full mt-[20%]'
                            />
                            <p className="text-center text-gray-500">Select chat to see conversation</p>
                        </div>
                    ) : (
                        <div>
                            {
                                isMessagePanelLoading ? (
                                    <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
                                        <LoaderPinwheel
                                            className='animate-spin'
                                            width={25}
                                            height={25}
                                        />
                                        <p className='text-gray-1 font-semibold'>Loading Chat History</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className='h-14 flex items-center p-4'>
                                            <p className='font-semibold text-base capitalize'>{activeChatName}</p>
                                        </div>
                                        <Separator className='bg-yellow-2' />

                                        <Chat
                                            conversation={chatMessages}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </ScrollArea>

            <Separator orientation="vertical" className='bg-yellow-2' />
            <ScrollArea className='w-[25%] h-full flex justify-center items-center'>

                {
                    activeChatPanel === -1 ? (
                        <div className='flex justify-center items-center w-full h-full flex-col'>
                            <Image
                                src='/icons/ai-dig-deeper-illu.svg'
                                width={650}
                                height={400}
                                alt="chatbot"
                                className='max-w-full max-h-full mt-[50%]'
                            />
                            <p className="text-center text-gray-500">AI Dig Deeper Menu will appear here</p>
                        </div>
                    ) : (

                        isMessagePanelLoading ? (
                            <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
                                <LoaderPinwheel
                                    className='animate-spin'
                                    width={25}
                                    height={25}
                                />
                                <p className='text-gray-1 font-semibold'>Loading Chat History</p>
                            </div>
                        ) : (
                            <div>
                                <div className='h-14 flex items-center p-4'>
                                    <p className='font-semibold text-lg capitalize'>Conversation Dig Deeper</p>
                                </div>
                                <Separator className='bg-yellow-2' />

                                <div className='flex items-center justify-center gap-7 mt-[10%] flex-col p-4'>
                                    <Image
                                        src={'/images/male-user.png'}
                                        width={190}
                                        height={190}
                                        alt='user'
                                    />
                                    <div className='rounded-md border-2 border-gray-200 bg-gray-100 p-3 '>
                                        <div className='flex gap-1 items-center'>
                                            <BrainCog size={14} />
                                            <p className='font-medium text-sm'>AI Summery</p>
                                        </div>
                                        <div className='mt-2'>
                                            <p className='text-sm text-gray-600 font-normal'>{aiSummery}</p>
                                        </div>
                                    </div>
                                    <div className='mt-2 w-full flex flex-col gap-2'>
                                        {
                                            Object?.entries(activeLeadsField || {}).map(([key, value]: [string, any], index: number) => {
                                                return (
                                                    <div>
                                                        <div key={index} className="w-full flex gap-2 items-center justify-between">
                                                            <span className="font-medium">{key}</span>
                                                            <span className="font-light">{value}</span>
                                                        </div>
                                                        <Separator className='bg-gray-200 mt-2' />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }
            </ScrollArea>

        </div >
    )
}

export default page