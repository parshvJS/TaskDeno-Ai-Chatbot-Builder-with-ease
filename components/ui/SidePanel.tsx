'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Panel } from 'reactflow';
import Logo from '../Logo';
import projectContext from '@/context/chatbotContext';
import { ArrowBigDown, ArrowLeft, ArrowLeftSquare, Check, ChevronDown, Divide, Dot, Flame, Loader, Pen, Plus, Save, ScanSearch, X } from 'lucide-react';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { giveResponse, openAIModels, sentMessage, toggleBarItems, UserInput } from '@/constants/constants';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SideLabel from './SideLabel';
import { ScrollArea } from "@/components/ui/scroll-area"
import SidebarContext, { RightSideBarProvider } from '@/context/RightSideBarContext';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from './use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(15, {
    message: "Max variable length is 15 charactr"
  }),
})

const SidePanel = ({
  nodes,
  setNodes,
  addNode,
  syncChangesToContext,
  aiModel,
  aiPrompt,
  variables,
  setAiModel,
  setAiPrompt,
  setVariables }: any) => {
  const router = useRouter();
  const { project, isSyncLoading, isStoredInDb, storeChangesInDb, syncing, setIsStoredInDb } = useContext(projectContext);
  const { isSidebarActive, setIsSidebarActive } = useContext(SidebarContext)
  const [activeState, setActiveState] = useState(0);
  const [activeVariableIndex, setActiveVariableIndex] = useState(-1)
  const [changingAiPrompt, setChangingAiPrompt] = useState("")
  const { toast } = useToast();

  // shadcn form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  // shadcn form submit function
  function onSubmit(values: z.infer<typeof formSchema>) {
    const isExist = variables.includes(values.name)
    if (isExist) {
      toast({
        title: "Can't add variable",
        description: "Variable With Same Name Already Exist !",
        variant: "destructive"
      })
    }
    else {
      const variable = values.name.replace(" ", "_")
      setVariables((prevVariable: [{ type: string }]) => [...prevVariable, variable])
      toast({
        title: "Variable Added !",
        variant: "success"
      })
      setActiveState(3)
    }
  }

  function deleteVariable(index: number) {
    setVariables((prevVariables: []) => prevVariables.filter((vari: string) => (vari != variables[index])));

    form.reset()
  }

  function handleVariableInteraction(index: number) {
    setActiveVariableIndex(index);
    setActiveState(6)
  }

  function onVariableNameChange(values: z.infer<typeof formSchema>) {
    if (variables[activeVariableIndex]) {
      const newName = values.name;

      // Update the variables array
      setVariables((prevVariables: string[]) => {
        const minusVariable = prevVariables.filter((vari: string) => vari !== variables[activeVariableIndex]);
        const newVariables = [...minusVariable, newName];
        return newVariables;
      });

      // Update the nodes array
      const updatedNodes = nodes.map((node: any) => {
        if (node.data.variable === variables[activeVariableIndex]) {
          return {
            ...node,
            data: {
              ...node.data,
              variable: newName
            }
          };
        }
        return node;
      });

      // Assuming you have a function or state setter to update nodes
      setNodes(updatedNodes);

      // Reset active state and index
      setActiveState(3);
      setActiveVariableIndex(-1);
      form.reset()
    }
  }



  const redirectToHome = () => {
    router.push('/mydenos');
  };

  const getStatus = () => {
    if (syncing) {
      return (
        <div className=' bg-green flex items-center p-2 gap-2'>
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
          <p className='font-semibold text-yellow-500'>Unsaved Changes</p>
        </div>
      )
    }
  }

  // handle case 2 changes 
  const handleAIModelChange = (model: string) => {
    setIsStoredInDb(false)
    setAiModel(model)
  }
  const handleAIPromptChange = () => {
    setIsStoredInDb(false)
    console.log("i am prompts", changingAiPrompt);
    const newAiPrompt = aiPrompt;
    setAiPrompt((prevValues: []) => [...prevValues, changingAiPrompt])

  }

  const handleAIPromptDeleteChange = (index: number) => {
    setAiPrompt((prevVariables: []) => prevVariables.filter((vari: string) => (vari != aiPrompt[index])));
    setChangingAiPrompt("")
    form.reset()
  }

  const showSidePanel = (index: number) => {


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
                <Button onClick={syncChangesToContext} variant={"ghost"} className='bg-gray-100 flex justify-start slim-border w-full gap-2'>
                  <Save width={20} height={20} />
                  <p className='font-medium'>Save</p>
                </Button>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <ScrollArea className="w-full h-[80%]">

            <div className='w-full h-[80%] slim-border bg-white-1 p-2'>
              <SideLabel
                label='Sent Message'
                imgUrl='/icons/chat.svg'
                helpText='Use this blocks to sent some static message '
              />
              <div className='h-fit mb-6 grid grid-cols-2 gap-2'>
                {sentMessage.map((item, index) => (
                  <div key={index} className=' cursor-pointer flex gap-2 bg-gray-100 p-2 rounded-sm' onClick={() => addNode('message', item.label, item.initialDatagram,)}>
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
              <SideLabel
                label='User Input'
                imgUrl='/icons/uInput.svg'
                helpText='Use these blocks to take input from the user'
              />
              <div className='h-fit mb-6 grid grid-cols-2 gap-2'>
                {UserInput.map((item, index) => (
                  <div key={index} className='cursor-pointer bg-gray-100 rounded-sm' onClick={() => addNode('user', item.label, item.initialDatagram)}>
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
                  <div key={index} className='cursor-pointer flex gap-2 bg-gray-100 p-2 rounded-sm' onClick={() => addNode('ai', item.label, item.initialDatagram)}>
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
          </ScrollArea>
        );

      case 2:
        return (
          <ScrollArea className='w-full h-[80%]'>
            <div className='w-full h-[80%] slim-border bg-white-1 p-2'>
              <SideLabel
                label='AI Model'
                imgUrl='/icons/select.svg'
                helpText='Select AI Model for the chatbot'
              />
              {/* add shadcn dropdown having different openai models in it 1.gpt-3.5 gpt-4o gpt-3 turbo*/}
              <div className='w-full mb-5'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className='flex gap-2 w-[300px] slim-border bg-gray-100 p-2 justify-between'>
                      {/* text Select model with lucid react icon */}
                      <p className='font-semibold'>{aiModel || "Select Model"}</p>
                      <ChevronDown />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-[300px]' defaultValue={aiModel}>
                    <DropdownMenuLabel>Available AI Models</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                      openAIModels.map((model, index) => (
                        <DropdownMenuItem key={index} onSelect={(value: Event) => handleAIModelChange(value?.target?.innerText)} >
                          {model.label}
                        </DropdownMenuItem>
                      ))
                    }
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>





              <SideLabel
                label='AI Prompt'
                imgUrl='/icons/bot.svg'
                helpText='Add ai prompt list for the chatbot '
              />
              <div className='w-full h-[40%] mb-5 '>

                <Input className='w-full slim-border' placeholder="Ex.Be Issue Solver for user in technical way" value={changingAiPrompt} onChange={(e) => setChangingAiPrompt(e.target.value)} />

                <div className='w-full mt-5'>
                  <Button
                    onClick={() => {
                      console.log("clicked");
                      handleAIPromptChange()
                      setChangingAiPrompt("")
                    }}
                    className='w-full bg-black hover:bg-gray-600 gap-2 text-white-1 font-semibold' >
                    <Plus />
                    Add Model
                  </Button>
                </div>
                <div className='mt-5'>
                  {
                    aiPrompt.map((prompt: string, index: number) => (
                      <div key={index} className='flex gap-2 bg-gray-100 p-2 rounded-sm justify-between slim-border my-1'>
                        <p className='font-semibold text-14 capitalize w-[50%] '>{prompt.length > 40 ? prompt.slice(50) + "..." : prompt}</p>
                        <div className='flex gap-2' onClick={() => handleAIPromptDeleteChange(index)}>
                          <Image
                            src={'/icons/delete.svg'}
                            alt='delete'
                            width={15}
                            height={15}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </ScrollArea>
          // create shadcn form that have ai model selection an ai prompt adding where user can add multiple ai prompt ,add dummy function where needed

        )
      case 3:
        return (
          <ScrollArea className="w-full h-[80%]">

            <div className='w-full h-[80%] slim-border bg-white-1 p-2'>
              <SideLabel
                label='Create Variable'
                imgUrl='/icons/pencil.svg'
                helpText='Create New Variables '
              />
              <div className='w-full h-full mb-5'>
                <Button
                  onClick={() => setActiveState(5)}
                  variant={"ghost"} className='w-full bg-gray-100 gap-2' >
                  <Plus />
                  Add New Variable
                </Button>
              </div>


              <SideLabel
                label='Variables'
                imgUrl='/icons/var.svg'
                helpText='Variables are used to store chatbot response and user input  '
              />
              <div className='w-full h-full'>
                {
                  (variables && variables.length < 1) ? (
                    <div className='flex flex-col justify-center items-center'>
                      <Image
                        src={'/images/dino-wonder.png'}
                        width={120}
                        height={120}
                        alt='dino'
                      />
                      <p className='text-center font-semibold text-16'>
                        No Variables are there
                        <br />
                        create new variables!
                      </p>
                    </div>
                  ) : (
                    <div className='flex flex-col items-start justify-start gap-1'>
                      {
                        variables.map((variable: string, index: number) => (
                          <button
                            key={index}
                            className='group w-full p-2 h-[40px] bg-gray-100 rounded-sm slim-border hover:bg-gray-200 flex justify-between items-center cursor-pointer'>

                            <p className='font-semibold w-[80%] text-left' onClick={() => handleVariableInteraction(index)}
                            >{variable}</p>
                            <div className='hidden group-hover:block'>
                              <Dialog>
                                <DialogTrigger className="block hover:bg-gray-300 h-full w-full ">
                                  <Image
                                    src={'/icons/delete.svg'}
                                    alt='delete'
                                    width={15}
                                    height={15}
                                  />
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Do you really want to Delete Variable?</DialogTitle>
                                    <DialogDescription className='flex gap-5 flex-col'>
                                      <ul itemType='circle'>
                                        <li>Make Sure you are not deleting variable that is being used by ai</li>
                                        <li>That Can Break or occurpt your chatbot !</li>
                                      </ul>
                                      <div>
                                        <Button
                                          variant={"destructive"}
                                          onClick={() => deleteVariable(index)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  )
                }
              </div>


            </div>
          </ScrollArea>
        )

      case 4:
        return (
          <div className='w-full h-[40%] slim-border bg-white-1 p-2'>

          </div>
        )
      case 5:
        // create new variable

        return (
          <div className='w-full h-[80%] slim-border bg-white-1'>
            <div className='bg-gray-200 flex justify-start items-center gap-2 h-[55px] p-2 '>
              <div
                onClick={() => setActiveState(3)}
                className='w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded-lg transition-all cursor-pointer'
              >
                <ArrowLeft />
              </div>
              <p className='font-semibold text-16'>Create New Variable</p>
            </div>

            <div className='flex gap-2 items-center justify-center w-full'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>Variable Name</FormLabel>
                        <FormControl>
                          <Input className='w-full slim-border' placeholder="user_email" {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Spaces Will Be Replaced With "_"
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className='w-full h-full mt-5'>
                    <Button
                      type='submit'
                      className='w-full bg-black hover:bg-gray-600 gap-2 text-white-1 font-semibold' >
                      <Plus />
                      Create Variable
                    </Button>
                  </div>
                </form>
              </Form>


            </div>
          </div>

        )


      case 6:
        return (
          <div className='w-full h-[80%] slim-border bg-white-1'>
            <div className='flex gap-2 items-center bg-gray-200 p-2'>
              <div
                onClick={() => setActiveState(3)}
                className='w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded-lg transition-all cursor-pointer'
              >
                <ArrowLeft />
              </div>
              <p className='font-semibold '>Make Changes In Variable</p>

            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onVariableNameChange)} className="w-full p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>New variable Name</FormLabel>
                      <FormControl>
                        <Input className='w-full slim-border' placeholder={`Old : ${variables[activeVariableIndex]}`} {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Don't enter name that i already available
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className='w-full h-full mt-5'>
                  <Button
                    type='submit'
                    className='w-full bg-black hover:bg-gray-600 gap-2 text-white-1 font-semibold' >
                    <Pen width={16} height={16} />
                    Change Variable
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )
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
        <div className='w-full h-[80%] flex gap-2 zoom-in-75 '>
          <div className='flex flex-col gap-1 slim-border rounded-sm bg-white-1 w-[50px] h-[186px] p-5  justify-center items-center fade-in-20'>
            {toggleBarItems.map((item, index) => {
              const isActive = index === activeState;
              return (
                <TooltipProvider delayDuration={10} key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"ghost"} size={"icon"} className={cn('w-[40px] h-[40px]', { "bg-gray-200": isActive })} onClick={() => { setIsSidebarActive(false); setActiveState(isActive ? -1 : index) }}>
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

          {!isSidebarActive ? showSidePanel(activeState) : null}

        </div>
      </Panel>
    </div>
  );
}

export default SidePanel;
