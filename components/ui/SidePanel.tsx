'use client'
import React, { useContext, useState } from 'react';
import { Panel } from 'reactflow';
import Logo from '../Logo';
import projectContext from '@/context/chatbotContext';
import { ArrowLeft, Check, Dot, Flame, Loader, Save, ScanSearch } from 'lucide-react';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { giveResponse, toggleBarItems, UserInput } from '@/constants/constants';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SideLabel from './SideLabel';

const SidePanel = ({ addNode }:any) => {
  const router = useRouter();
  const { project, isSyncLoading, isStoredInDb,storeChangesInDb,syncing } = useContext(projectContext);
  const [activeState, setActiveState] = useState(0);

  const redirectToHome = () => {
    router.push('/mydenos');
  };

  const getStatus = () => {
    if (syncing) {
      return (
        <div className='flex items-center p-2 gap-2'>
          <Loader width={20} height={20} className=' animate-spin' />
          <p className='font-semibold text-black'>Syncing with database</p>
        </div>
      )
    } else if (isStoredInDb) {
      return (
        <div className='flex items-center p-2 gap-2'>
          <Check width={20} height={20} className='text-green-500' />
          <p className='font-semibold text-green-500'>Saved</p>
        </div>
      )
    } else if (!isStoredInDb) {
      return (
        <div className='flex items-center p-2 gap-2'>
          <Dot size={28} className='text-yellow-6' />
          <p className='font-semibold text-yellow-500'>Draft</p>
        </div>
      )
    }
  }

  const showSidePanel = (index:number) => {
    switch (index) {
      case 0:
        return (
          <div className='w-full h-[80%] slim-border bg-white-1 p-2'>
            <SideLabel
              label='Status'
              imgUrl='/icons/run.svg'
              helpText='Check Saved status of chatbot '
            />
            <div className='flex flex-col w-full slim-border bg-gray-100 mb-5'>
              <p>{getStatus()}</p>
            </div>
            <SideLabel
              label='Deploy'
              imgUrl='/icons/deploy.svg'
              helpText='Deployment of the chatbot '
            />
            <div className='grid grid-cols-1 gap-2'>
              <div>
                <Button className='bg-black flex justify-start slim-border w-full gap-2 hover:bg-gray-500'>
                  <Flame width={20} height={20} className='text-white-1 ' />
                  <p className='font-medium text-white-1'>Deploy & Publish</p>
                </Button>
              </div>
              <div>
                <Button variant={"ghost"} className='bg-gray-100 flex justify-start slim-border w-full gap-2'>
                  <ScanSearch width={20} height={20} />
                  <p className='font-medium '>Preview Chatbot </p>
                </Button>
              </div>
              <div>
                <Button onClick={storeChangesInDb} variant={"ghost"} className='bg-gray-100 flex justify-start slim-border w-full gap-2'>
                  <Save width={20} height={20} />
                  <p className='font-medium'>Save</p>
                </Button>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className='w-full h-[80%] slim-border bg-white-1 p-2'>
            <SideLabel
              label='User Input'
              imgUrl='/icons/uInput.svg'
              helpText='Use these blocks to take input from the user'
            />
            <div className='h-fit mb-6 grid grid-cols-2 gap-2'>
              {UserInput.map((item, index) => (
                <div key={index} className='bg-gray-100 rounded-sm' onClick={() => addNode('input', item.label)}>
                  <div className='flex gap-2 bg-gray-100 p-2 rounded-sm'>
                    <Image
                      alt={item.label}
                      src={item.imgUrl}
                      width={16}
                      height={16}
                    />
                    <p className='font-medium text-14 capitalize'>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <SideLabel
              label='AI Output'
              imgUrl='/icons/chatbot.svg'
              helpText='Use this block to create response from AI'
            />
            <div className='h-fit mb-6 grid grid-cols-2 gap-2'>
              {giveResponse.map((item, index) => (
                <div key={index} className='flex gap-2 bg-gray-100 p-2 rounded-sm' onClick={() => addNode('output', item.label)}>
                  <Image
                    alt={item.label}
                    src={item.imgUrl}
                    width={16}
                    height={16}
                  />
                  <p className='font-medium text-14 capitalize'>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className='flex flex-col w-full h-full gap-2'>
      <Panel position="top-left">
        <Logo />
      </Panel>
      <Panel position='bottom-left' className='w-[25%] h-[90%] flex flex-col gap-2'>
        <div className='p-2 gap-2 w-full h-[8%] bg-white-1 rounded-md slim-border flex items-center'>
          <Button variant={"ghost"} onClick={redirectToHome} size={"icon"} className='w-[40px] h-[40px]'>
            <ArrowLeft />
          </Button>
          <p className='font-medium text-16 capitalize'>{project.project_name || "AI Builder"}</p>
        </div>
        <div className='w-full h-[80%] flex gap-2 zoom-in-75'>
          <div className='flex flex-col gap-2 slim-border rounded-sm bg-white-1 w-[60px] h-[270px] p-1 justify-center items-center fade-in-20'>
            {toggleBarItems.map((item, index) => {
              const isActive = index === activeState;
              return (
                <TooltipProvider delayDuration={10} key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"ghost"} size={"icon"} className={cn('w-[40px] h-[40px]', { "bg-gray-200": isActive })} onClick={() => setActiveState(isActive ? -1 : index)}>
                        <Image
                          src={item.imgUrl}
                          width={20}
                          height={20}
                          alt={item.label}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side='left' className='bg-gray-200'>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          <div className='w-full h-full'>
            {showSidePanel(activeState)}
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default SidePanel;
