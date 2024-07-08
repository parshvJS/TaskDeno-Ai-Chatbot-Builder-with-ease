import React, { useContext, useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { Panel } from 'reactflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from './input';
import SidebarContext from '@/context/RightSideBarContext';
import { cn } from '@/lib/utils';
import RightSideLabel from './RightSideLabel';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from './scroll-area';
import { useToast } from './use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { giveResponse, sentMessage, UserInput } from '@/constants/constants';
import Image from 'next/image';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"


const textModification = z.object({
    min: z.number().min(1),
    max: z.number().max(3000)
})

function RightSideBar({ variables, setVariables }: any) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const { sidebar, setSidebar, setIsSidebarActive, isSidebarActive } = useContext(SidebarContext);
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [currentDataType, setCurrentDataType] = useState("")
    const [chatbotDataType, setChatbotDataType] = useState("")
    const [chatbotVariable, setChatbotVariable] = useState("")
    const { toast } = useToast()
    const activeChatbot = sidebar?.currentNode?.data.message ? sidebar?.currentNode?.data.message : sidebar?.currentNode?.data.ai;
    const activeChatbotDatatype = sidebar?.currentNode?.data.message ? "message" : "ai";



    // set intital values for right side bar
    useEffect(() => {
        console.log("RSB::useEffect::values are", activeChatbot);
        if (sidebar.currentNode.data.user.variable
            && sidebar.currentNode.data.user.type
        ) {
            console.log("right side bar :: useEffect:: changeing defualt value");

            setCurrentDataType(sidebar.currentNode.data.user.type)
            setValue(sidebar.currentNode.data.user.variable);
        }
        if (activeChatbot) {
            const chatBotDatatype = sidebar.currentNode.data.message ? sidebar.currentNode.data.message : sidebar.currentNode.data.ai || null            
            console.log("rightSidebar::setting initital chatbot data type", chatBotDatatype);
            setChatbotDataType(chatBotDatatype.type)
            setChatbotVariable(chatBotDatatype.variable)
        }

    }, [sidebar.activeNodeId]);

    // change name of the 
    const handleChange = (e) => {
        const newName = e.target.value;
        setSidebar((prevSidebar) => ({
            ...prevSidebar,
            currentNode: {
                ...prevSidebar.currentNode,
                data: {
                    ...prevSidebar.currentNode.data,
                    nodeName: newName
                }
            }
        }));
    };

    // changes variable to state
    function handleVariableChange(currentValue: string, location: string) {
        if (location == "chatbot") {
            console.log("rightSideBar::chatbot data updated", currentValue, chatbotVariable);

            setChatbotVariable(currentValue === chatbotVariable ? "" : currentValue)
            setOpen(false);
        }
        else {
            console.log("rightSideBar::user data updated");
            setValue(currentValue === value ? "" : currentValue);
            setOpen(false);
        }

    }

    // when variable changes then this useEffect changes sidebar
    useEffect(() => {
        console.log("useEffect called");

        if (activeChatbotDatatype == "message") {
            setSidebar((prevSidebar) => ({
                ...prevSidebar,
                currentNode: {
                    ...prevSidebar.currentNode,
                    data: {
                        ...prevSidebar.currentNode.data,
                        user: {
                            type: currentDataType,
                            variable: value,
                        },
                        message: {
                            type: chatbotDataType,
                            variable: chatbotVariable
                        }

                    }
                }
            }));
        }
        else {
            setSidebar((prevSidebar) => ({
                ...prevSidebar,
                currentNode: {
                    ...prevSidebar.currentNode,
                    data: {
                        ...prevSidebar.currentNode.data,
                        user: {
                            type: currentDataType,
                            variable: value,
                        },
                        ai: {
                            type: chatbotDataType,
                            variable: chatbotVariable
                        }

                    }
                }
            }));
        }


    }, [value, currentDataType, chatbotDataType, chatbotVariable])

    function handleAddVariable() {
        const isExist = variables.includes(inputValue)
        if (isExist) {
            toast({
                title: "Can't add variable",
                description: "Variable With Same Name Already Exist !",
                variant: "destructive"
            })
        }
        else {
            const variable = inputValue.replace(" ", "_")
            setVariables((prevVariable: [{ type: string }]) => [...prevVariable, variable])
            toast({
                title: "Variable Added !",
                variant: "success"
            })
        }
    }

    function showChatbotManips(datatype: string) {
        switch (datatype) {
            case "text":
                return (
                    <RightSideLabel
                        label='Add Text To Show'
                        isOptional={true}
                        helpText='type to Show Message to user !'
                    />

                );
        }
    }

    return (
        <Panel position="top-right">
            <div className="flex justify-end items-center h-screen w-[370px]">
                <div className="w-[370px] h-[80%] slim-border bg-white-1 overflow-hidden">
                    <section className='flex justify-between items-center w-full h-[60px] bg-gray-200 px-2 py-1'>
                        <p
                            onClick={() => setShowInput(true)}
                            className={
                                cn("font-semibold text-16", {
                                    "hidden": showInput
                                })
                            }
                        >{sidebar.currentNode?.data?.nodeName}</p>
                        {showInput && <Input
                            className='font-semibold text-16'
                            defaultValue={sidebar.currentNode?.data?.nodeName}
                            onChange={handleChange}
                        />}
                        <div
                            onClick={() => setIsSidebarActive(false)}
                            className='w-10 h-10 flex justify-center items-center hover:bg-gray-300 rounded-full transition-all cursor-pointer'
                        >
                            <X />
                        </div>
                    </section>

                    <section className='w-full h-full'>
                        <Tabs defaultValue="chatbot" className="w-full rounded-none">
                            <TabsList className='w-full bg-gray-200 rounded-none'>
                                <TabsTrigger value="chatbot" className='w-1/2'>Chatbot</TabsTrigger>
                                <TabsTrigger value="user" className='w-1/2'>User</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chatbot">
                                <div className='p-3'>
                                    <div className='mb-5'>
                                        {/* chatbot */}
                                        <RightSideLabel
                                            label='Store User Response In Variable'
                                            isOptional={true}
                                            helpText='Variables hold User Response and can be used for next messages !'
                                        />
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between mt-3"
                                                >
                                                    {chatbotVariable || "Create Or Select variable..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command className='w-full'>
                                                    <ScrollArea className="h-fit w-[350px] rounded-md">
                                                        <CommandInput
                                                            placeholder="Type to Create or Search Variable..."
                                                            className='w-full'
                                                            onValueChange={(val) => setInputValue(val)}
                                                        />
                                                        <CommandEmpty>
                                                            <Button
                                                                onClick={handleAddVariable}
                                                                className='bg-gray-200 hover:bg-gray-300 '
                                                            >
                                                                <div className='flex justify-center items-center gap-2'>

                                                                    <Plus width={16} height={16} />
                                                                    <p>{`Create variable ${inputValue}`}</p>
                                                                </div>
                                                            </Button>
                                                        </CommandEmpty>
                                                        <CommandGroup className='w-full'>
                                                            <CommandList defaultValue={activeChatbot ? activeChatbot.variable : undefined}>
                                                                {variables.map((variable) => (
                                                                    <CommandItem
                                                                        key={variable}
                                                                        value={variable}
                                                                        onSelect={(value: string) => handleVariableChange(value, "chatbot")}
                                                                        className='hover:bg-gray-200'
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                chatbotVariable === variable ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        <p className='text-left w-full font-semibold text-black'>{variable}</p>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </CommandGroup>
                                                    </ScrollArea>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>


                                    <RightSideLabel
                                        label='Set Data Type'
                                        isOptional={false}
                                        helpText='Variables hold User Response and can be used for next messages !'
                                    />
                                    <Select
                                        value={chatbotDataType}
                                        onValueChange={(value: string) => setChatbotDataType(value)}>
                                        <SelectTrigger className="w-full ring-0 focus:ring-0 mt-4">
                                            <SelectValue placeholder="Select Data Type" className='text-black font-semibold ring-0 focus:ring-0' />
                                        </SelectTrigger>
                                        <SelectContent >
                                            {
                                                sidebar.currentNode.data.message ?
                                                    (sentMessage.map((input) => {
                                                        return <SelectItem
                                                            value={input.value}
                                                        >
                                                            <div className='flex gap-2'>
                                                                <Image
                                                                    src={input.imgUrl}
                                                                    width={15}
                                                                    height={15}
                                                                    alt={input.value}
                                                                />
                                                                <p>{input.label}</p>
                                                            </div>
                                                        </SelectItem>
                                                    })) : (
                                                        giveResponse.map((input) => {
                                                            return <SelectItem
                                                                value={input.value}
                                                            >
                                                                <div className='flex gap-2'>
                                                                    <Image
                                                                        src={input.imgUrl}
                                                                        width={15}
                                                                        height={15}
                                                                        alt={input.value}
                                                                    />
                                                                    <p>{input.label}</p>
                                                                </div>
                                                            </SelectItem>
                                                        }))
                                            }
                                        </SelectContent>
                                    </Select>

                                    {activeChatbot == "" && showChatbotManips(chatbotDataType)}

                                </div>
                            </TabsContent>
                            <TabsContent value="user">
                                <div className='flex flex-col gap-6 p-3'>
                                    <div>
                                        <RightSideLabel
                                            label='Store User Response In Variable'
                                            isOptional={true}
                                            helpText='Variables hold User Response and can be used for next messages !'
                                        />
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between mt-3"
                                                >
                                                    {value || "Create Or Select variable..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command className='w-full'>
                                                    <ScrollArea className="h-fit w-[350px] rounded-md">
                                                        <CommandInput
                                                            placeholder="Type to Create or Search Variable..."
                                                            className='w-full'
                                                            onValueChange={(val) => setInputValue(val)}
                                                        />
                                                        <CommandEmpty>
                                                            <Button
                                                                onClick={handleAddVariable}
                                                                className='bg-gray-200 hover:bg-gray-300 '
                                                            >
                                                                <div className='flex justify-center items-center gap-2'>

                                                                    <Plus width={16} height={16} />
                                                                    <p>{`Create variable ${inputValue}`}</p>
                                                                </div>
                                                            </Button>
                                                        </CommandEmpty>
                                                        <CommandGroup className='w-full'>
                                                            <CommandList defaultValue={sidebar?.currentNode?.data?.user?.variable}>
                                                                {variables.map((variable) => (
                                                                    <CommandItem
                                                                        key={variable}
                                                                        value={variable}
                                                                        onSelect={handleVariableChange}
                                                                        className='hover:bg-gray-200'
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                value === variable ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        <p className='text-left w-full font-semibold text-black'>{variable}</p>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </CommandGroup>
                                                    </ScrollArea>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>


                                    <div>
                                        <RightSideLabel
                                            label='Set Data Type'
                                            isOptional={false}
                                            helpText='Variables hold User Response and can be used for next messages !'
                                        />
                                        <Select
                                            value={sidebar?.currentNode?.data?.user?.type}
                                            onValueChange={(value: string) => setCurrentDataType(value)}>
                                            <SelectTrigger className="w-full ring-0 focus:ring-0 mt-4">
                                                <SelectValue placeholder="Select Data Type" className='text-black font-semibold ring-0 focus:ring-0' />
                                            </SelectTrigger>
                                            <SelectContent >
                                                {
                                                    UserInput.map((input) => {
                                                        return <SelectItem
                                                            value={input.value}
                                                        >
                                                            <div className='flex gap-2'>
                                                                <Image
                                                                    src={input.imgUrl}
                                                                    width={15}
                                                                    height={15}
                                                                    alt={input.value}
                                                                />
                                                                <p>{input.label}</p>
                                                            </div>
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    {/* {showDatatypeModifications(currentDataType)} */}
                                </div>

                            </TabsContent>
                        </Tabs>
                    </section>
                </div>
            </div>
        </Panel>
    );
}

export default RightSideBar;






// function onSubmit(values: z.infer<typeof textModification>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values)
// }

// function showDatatypeModifications(dataType: string) {
//     switch (dataType) {
//         case "custom":
//             return (
//                 <div className='flex flex-col gap-2'>
//                     <RightSideLabel
//                         label='Define Form Schema'
//                         isOptional={false}
//                         helpText='Add Maximum length that user can enter'
//                     />
//                     {
//                         dataTypeModification && dataTypeModification.map((field) => (
//                             <div>

//                             </div>
//                         ))
//                     }
//                 </div>
//             )
//     }
// }