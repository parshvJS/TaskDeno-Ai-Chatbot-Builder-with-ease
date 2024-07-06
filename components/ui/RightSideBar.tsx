import React, { useContext, useState } from 'react';
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
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { useToast } from './use-toast';

function RightSideBar({ variables, setVariables }: any) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const { sidebar, setSidebar, setIsSidebarActive } = useContext(SidebarContext);
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const { toast } = useToast()
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
                        <Tabs defaultValue="account" className="w-full rounded-none">
                            <TabsList className='w-full bg-gray-200 rounded-none'>
                                <TabsTrigger value="account" className='w-1/2'>Chatbot</TabsTrigger>
                                <TabsTrigger value="password" className='w-1/2'>User</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">Make changes to your account here.</TabsContent>
                            <TabsContent value="password">
                                <div className='p-2'>
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
                                                        <CommandList>
                                                            {variables.map((variable) => (
                                                                <CommandItem
                                                                    key={variable}
                                                                    value={variable}
                                                                    onSelect={(currentValue) => {
                                                                        setValue(currentValue === value ? "" : currentValue);
                                                                        setOpen(false);
                                                                    }}
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
                            </TabsContent>
                        </Tabs>
                    </section>
                </div>
            </div>
        </Panel>
    );
}

export default RightSideBar;
