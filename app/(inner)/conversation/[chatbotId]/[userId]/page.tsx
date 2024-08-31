'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Chat from '@/components/ui/Chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { timeAgo } from '@/lib/helper';
import axios from 'axios';
import { BrainCog, LoaderPinwheel } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ChatData {
  instanceId: string;
  nickname: string;
  createdAt: string;
}

interface ConversationData {
  conversation: any[];
  aiSummery: string;
  nickname: string;
  leadInfo: Record<string, any>;
}

function Page() {
  const [allChatData, setAllChatData] = useState<ChatData[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [activeChatName, setActiveChatName] = useState('');
  const [aiSummery, setAiSummery] = useState('');
  const [activeLeadsField, setActiveLeadsField] = useState<Record<string, any>>({});
  const [isChatPanelLoading, setIsChatPanelLoading] = useState(true);
  const [isMessagePanelLoading, setIsMessagePanelLoading] = useState(false);
  const [activeChatPanel, setActiveChatPanel] = useState<string | null>(null);
  const [paginationNum, setPaginationNum] = useState(1);
  const [isChatEmpty, setIsChatEmpty] = useState(false);
  const params = useParams() as { chatbotId: string; userId: string };
  const { toast } = useToast();

  async function getChatPanelData() {
    try {
      setIsChatPanelLoading(true);
      const response = await axios.post('/api/getAllconversations', {
        projectId: params.chatbotId,
        paginationNum,
      });

      const chatData = response.data;
      if (!chatData.success) {
        toast({
          title: "Can't load Chats!",
          description: 'Error',
          variant: 'destructive',
        });
        return;
      }

      if (chatData.data.length === 0) {
        setIsChatEmpty(true);
        return;
      }

      setAllChatData(chatData.data);
    } catch (error: any) {
      toast({
        title: "Can't Load Conversation",
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsChatPanelLoading(false);
    }
  }

  useEffect(() => {
    getChatPanelData();
  }, [paginationNum]);

  useEffect(() => {
    async function fetchData() {
      if (!activeChatPanel) return;

      try {
        setIsMessagePanelLoading(true);
        const response = await axios.post('/api/getChatFromConversation', {
          projectId: params.chatbotId,
          InstanceId: activeChatPanel,
        });

        const conversationData: ConversationData = response.data.data;
        setChatMessages(conversationData.conversation);
        setAiSummery(conversationData.aiSummery);
        setActiveChatName(conversationData.nickname.replace('_', ' '));
        setActiveLeadsField(conversationData.leadInfo);
      } catch (error: any) {
        toast({
          title: "Can't Load Chat",
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsMessagePanelLoading(false);
      }
    }

    fetchData();
  }, [activeChatPanel]);

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

        {isChatEmpty ? (
          <div className='flex flex-col justify-center items-center h-full mt-[20%]'>
            <Image src={'/images/no-pro-illu.png'} alt='ideas' width={210} height={210} />
            <h1 className='font-bold text-xl mx-5 text-center '>
              You Don't Have Any Conversations Right Now
            </h1>
          </div>
        ) : isChatPanelLoading ? (
          <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
            <LoaderPinwheel className='animate-spin' width={25} height={25} />
            <p className='text-gray-1 font-semibold'>Loading conversations</p>
          </div>
        ) : (
          <div className='flex flex-col items-center '>
            {allChatData &&
              allChatData.map((chat, index) => {
                const isActive = chat.instanceId === activeChatPanel;
                return (
                  <div
                    key={index}
                    onClick={() => handleActiveConversation(index)}
                    className={`w-full p-3 hover:bg-yellow-50 cursor-pointer ${
                      isActive ? 'bg-yellow-100' : ''
                    }`}
                  >
                    <div className='flex gap-2 items-center capitalize'>
                      <Avatar>
                        <AvatarFallback
                          style={{ background: 'linear-gradient(to bottom right, #F1FE02, #EBEBEA)' }}
                        >
                          {chat.nickname
                            .split('_')
                            .map((word: string) => word.charAt(0))
                            .join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className=''>
                        <p className='text-sm capitalize font-normal'>
                          {chat.nickname.replace('_', ' ') || `User Chat #${index}`}
                        </p>
                        <p className='text-xs text-gray-600'>{timeAgo(chat.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div className='flex justify-between items-center w-full p-4'>
          <Button onClick={() => setPaginationNum(paginationNum - 1)}>Previous</Button>
          <Button onClick={() => setPaginationNum(paginationNum + 1)}>Next</Button>
        </div>
      </ScrollArea>
      <Separator orientation='vertical' className='bg-yellow-2' />
      <ScrollArea className='w-[50%] h-full flex justify-center items-center'>
        {!activeChatPanel ? (
          <div className='flex justify-center items-center w-full h-full flex-col'>
            <Image
              src='/icons/chat-illu.svg'
              width={650}
              height={400}
              alt='chatbot'
              className='max-w-full max-h-full mt-[20%]'
            />
            <p className='text-center text-gray-500'>Select chat to see conversation</p>
          </div>
        ) : isMessagePanelLoading ? (
          <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
            <LoaderPinwheel className='animate-spin' width={25} height={25} />
            <p className='text-gray-1 font-semibold'>Loading Chat History</p>
          </div>
        ) : (
          <div>
            <div className='h-14 flex items-center p-4'>
              <p className='font-semibold text-base capitalize'>{activeChatName}</p>
            </div>
            <Separator className='bg-yellow-2' />

            <Chat conversation={chatMessages} />
          </div>
        )}
      </ScrollArea>

      <Separator orientation='vertical' className='bg-yellow-2' />
      <ScrollArea className='w-[25%] h-full flex justify-center items-center'>
        {!activeChatPanel ? (
          <div className='flex justify-center items-center w-full h-full flex-col'>
            <Image
              src='/icons/ai-dig-deeper-illu.svg'
              width={650}
              height={400}
              alt='chatbot'
              className='max-w-full max-h-full mt-[50%]'
            />
            <p className='text-center text-gray-500'>AI Dig Deeper Menu will appear here</p>
          </div>
        ) : isMessagePanelLoading ? (
          <div className='flex justify-center items-center h-full flex-col mt-[50%]'>
            <LoaderPinwheel className='animate-spin' width={25} height={25} />
            <p className='text-gray-1 font-semibold'>Loading Chat History</p>
          </div>
        ) : (
          <div>
            <div className='h-14 flex items-center p-4'>
              <p className='font-semibold text-lg capitalize'>Conversation Dig Deeper</p>
            </div>
            <Separator className='bg-yellow-2' />

            <div className='flex items-center justify-center gap-7 mt-[10%] flex-col p-4'>
              <Image src={'/images/male-user.png'} width={190} height={190} alt='user' />
              <div className='flex flex-col items-center justify-center'>
                <p className='font-medium text-sm text-gray-500'>User Name</p>
                <p className='font-semibold text-sm text-black'>{activeChatName}</p>
              </div>
              <div className='grid grid-cols-3 gap-4 justify-center mt-4'>
                {Object.entries(activeLeadsField).map(([key, value]) => (
                  <div key={key} className='flex flex-col items-center justify-center'>
                    <p className='font-medium text-sm text-gray-500'>{key}</p>
                    <p className='font-semibold text-sm text-black'>{value}</p>
                  </div>
                ))}
              </div>
              <div className='flex items-center justify-center mt-5'>
                <Button>
                  <BrainCog className='mr-2 h-4 w-4' /> Ai Dig Deeper
                </Button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default Page;
