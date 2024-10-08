import React, { useContext, useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Plus, Variable, X } from 'lucide-react';
import { Panel } from 'reactflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from './scroll-area';
import { useToast } from './use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { giveResponse, sentMessage, UserInput } from '@/constants/constants';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from './label';

// Define the types for props
interface RightSideBarProps {
    variables: string[];
    setVariables: React.Dispatch<React.SetStateAction<string[] >>;
}

// Define the types for sidebar context
interface SidebarContextType {
    sidebar: any;
    setSidebar: React.Dispatch<React.SetStateAction<any>>;
    setIsSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
    isSidebarActive: boolean;
}

function RightSideBar({ variables, setVariables }: RightSideBarProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const { sidebar, setSidebar, setIsSidebarActive, isSidebarActive } = useContext<SidebarContextType>(SidebarContext);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [currentDataType, setCurrentDataType] = useState<string>("");
    const [chatbotDataType, setChatbotDataType] = useState<string>("");
    const [chatbotVariable, setChatbotVariable] = useState<string>("");
    const [variableDropdownOpen, setVariableDropdownOpen] = useState<boolean>(false);
    const [variableInputValue, setVariableInputValue] = useState<string>("");
    const [textareaContent, setTextareaContent] = useState<string>("");
    const [chatbotImageUrl, setChatbotImageUrl] = useState<string>("");
    const [chatbotImageUrlValid, setChatbotImageUrlValid] = useState<boolean>(false);

    const [aiContentPrompt, setAiContentPrompt] = useState<string>("");
    const [aiVariable, setAiVariable] = useState<string>("");
    const [aiDataType, setAiDataType] = useState<string>("");
    const { toast } = useToast();

    const activeChatbot = sidebar?.currentNode?.data.message ?? sidebar?.currentNode?.data.ai;
    const activeChatbotDatatype = sidebar?.currentNode?.data.message ? "message" : "ai";

    // Set initial values for right side bar
    useEffect(() => {
        console.log("RSB::useEffect::values are", activeChatbot, sidebar);
        const userSidebar = sidebar.currentNode.data.user;
        userSidebar.type && setCurrentDataType(userSidebar.type);
        userSidebar.variable && setValue(userSidebar.variable);

        if (activeChatbotDatatype === "message") {
            const chatBotDatatype = sidebar.currentNode.data.message ?sidebar.currentNode.data.message : sidebar.currentNode.data.ai || null;
            setChatbotVariable(chatBotDatatype.variable);
            setChatbotDataType(sidebar.currentNode.data.message.type);
        } else if (activeChatbotDatatype === "ai") {
            const aiDatatype = sidebar.currentNode.data.ai ?? null;
            console.log(aiDataType, "is my-----------------");

            setAiVariable(aiDatatype.Variable);
            setAiDataType(aiDatatype.type);
            setAiContentPrompt(aiDatatype.content);
        }
    }, [sidebar.activeNodeId]);

    // Set initial values for text related content
    useEffect(() => {
        if (activeChatbotDatatype === "ai") {
            console.log("ai took over world : content,var,dt", aiContentPrompt, aiVariable, aiDataType);
            return;
        }
        if (chatbotDataType) {
            console.log("i am side bar content changer", chatbotDataType, sidebar);
            const sidebarMessage = sidebar.currentNode.data.message;
            switch (chatbotDataType) {
                case "text":
                    console.log("switch case value::text");
                    setTextareaContent(sidebarMessage.content);
                    console.log("sett completed for textArea", sidebar.currentNode.data.message.content, "hhh");
                    setChatbotImageUrl(sidebarMessage.content);
                    break;
                case "image":
                    console.log("switch case value::Image", sidebar);
                    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i;

                    if (urlPattern.test(sidebarMessage.content)) {
                        setChatbotImageUrl(sidebarMessage.content);
                        setChatbotImageUrlValid(true);
                    } else {
                        setChatbotImageUrl("");
                        setChatbotImageUrlValid(false);
                        console.warn("Invalid image URL format");
                    }
                    break;
            }
        }
    }, [chatbotDataType, sidebar.activeNodeId]);

    // Change name of the node
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setSidebar((prevSidebar:any) => ({
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

    // Changes variable to state
    function handleVariableChange(currentValue: string, location: string) {
        console.log("Location received in handleVariableChange:", location, currentValue);

        if (location === "ai") {
            console.log("AI block executing", currentValue, aiVariable);
            setAiVariable(currentValue === aiVariable ? "" : currentValue);
            setOpen(false);
        } else if (location === "chatbot") {
            console.log("Chatbot block executing", currentValue, chatbotVariable);
            setChatbotVariable(currentValue === chatbotVariable ? "" : currentValue);
            setOpen(false);
        } else {
            console.log("Else block executing");
            setValue(currentValue === value ? "" : currentValue);
            setOpen(false);
        }
    }

    function handleAddVariable() {
        const isExist = variables.includes(inputValue);
        if (isExist) {
            toast({
                title: "Can't add variable",
                description: "Variable With Same Name Already Exist !",
                variant: "destructive"
            });
        } else {
            const variable = inputValue.replace(" ", "_");
            setVariables((prevVariable) => [...prevVariable, variable]);
            toast({
                title: "Variable Added !",
                variant: "success"
            });
        }
    }

    // When variable changes then this useEffect changes sidebar
    useEffect(() => {
        if (activeChatbotDatatype === "ai") {
            console.log("i am ai taking over world", aiVariable, aiDataType, aiContentPrompt);
            setSidebar((prevSidebar:any) => ({
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
                            type: aiDataType,
                            content: aiContentPrompt,
                            variable: aiVariable
                        }
                    }
                }
            }));
            return;
        }

        console.log("useEffect called", textareaContent, chatbotDataType);
        let contentHolder = "";
        console.log("i am contentHolder 1", contentHolder);

        if (chatbotDataType) {
            switch (chatbotDataType) {
                case "text":
                    console.log("wakre");
                    contentHolder = textareaContent;
                    console.log("i am contentHolder 2", contentHolder);
                    break;
                case "image":
                    contentHolder = chatbotImageUrl;
                    break;
            }
        } else {
            console.log("i am backup here  ---------------------", activeChatbot, chatbotDataType);
            switch (activeChatbot.type) {
                case "text":
                    contentHolder = activeChatbot.content;
                    break;
                case "image":
                    contentHolder = activeChatbot.content;
                    break;
            }
        }

        setSidebar((prevSidebar:any) => ({
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
                        content: contentHolder,
                        variable: chatbotVariable
                    }
                }
            }
        }));
    }, [textareaContent, chatbotImageUrl, chatbotDataType, value, currentDataType, aiVariable, aiContentPrompt, aiDataType, sidebar.currentNode.data.message]);

    const handleTextareaChange = (e:any) => {
        const value = e.target.value;
        setTextareaContent(value);

        // Show dropdown when `{` is typed
        if (value.endsWith("{")) {
            setVariableDropdownOpen(true);
        } else {
            setVariableDropdownOpen(false);
        }
    };

    const handleVariableSelect = (variable:any) => {
        const newValue = textareaContent.replace(/\{$/, `{${variable}`);
        setTextareaContent(newValue);
        setVariableDropdownOpen(false);
    };
    const handleAiPromtSelect = (variable:any) => {
        const newValue = aiContentPrompt.replace(/\{$/, `{${variable}`);
        setAiContentPrompt(newValue);
        setVariableDropdownOpen(false);
    };

    const handleImageUrlChange = (e:any) => {
        const value = e.target.value;
        setChatbotImageUrl(value);
        console.log("image is ", value);

        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i;

        if (urlPattern.test(value)) {
            setChatbotImageUrlValid(true)
        } else {
            setChatbotImageUrlValid(false)

            console.warn("Invalid image URL format");
        }
    };

    function showChatbotManips(datatype: string, location: string) {
        if (activeChatbotDatatype == "ai") {
            return (
                <div className='mt-5 flex flex-col gap-2'>
                    <RightSideLabel
                        label='Add Text To Show'
                        isOptional={false}
                        helpText='type to Show Message to user !'
                    />
                    <Textarea
                        defaultValue={aiContentPrompt}
                        value={aiContentPrompt}
                        onChange={(e) => setAiContentPrompt(e.target.value)}
                        placeholder='Enter custom prompt for this insturctions'
                    />
                </div>
            )
        }

        switch (datatype) {
            case "text":
                return (
                    <div className='mt-5 flex flex-col gap-2'>
                        <RightSideLabel
                            label='Add Text To Show'
                            isOptional={false}
                            helpText='type to Show Message to user !'
                        />
                        <div className='w-full'>
                            <Popover open={variableDropdownOpen} onOpenChange={setVariableDropdownOpen}>
                                <PopoverTrigger asChild>
                                    <Textarea
                                        defaultValue={textareaContent}
                                        value={textareaContent}
                                        onChange={handleTextareaChange}
                                        placeholder='Enter Your Text or use { To insert variables'
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <ScrollArea className="h-fit w-[350px] rounded-md">
                                        <Command className='w-full'>
                                            <CommandInput
                                                placeholder="Type to Create or Search Variable..."
                                                className='w-full'
                                                onValueChange={(val) => setVariableInputValue(val)}
                                            />
                                            <CommandEmpty>
                                                No variables found.
                                            </CommandEmpty>
                                            <CommandGroup className='w-full'>
                                                <CommandList>

                                                    {variables.map((variable: string) => (
                                                        <CommandItem
                                                            key={variable}
                                                            value={variable}
                                                            onSelect={() => handleVariableSelect(variable)}
                                                            className='hover:bg-gray-200'
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    variableInputValue === variable ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <p className='text-left w-full font-semibold text-black'>{variable}</p>
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </CommandGroup>
                                        </Command>
                                    </ScrollArea>

                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                );

            case "image":
                return (
                    <div className='flex flex-col gap-2 mt-5'>
                        <RightSideLabel
                            label='Enter Image Url'
                            isOptional={false}
                            helpText='Enter Image url that need to be showed'
                        />
                        <Input
                            defaultValue={textareaContent}
                            value={chatbotImageUrl}
                            onChange={handleImageUrlChange}
                            placeholder='Add Image url you want to show'
                        />
                        {
                            chatbotImageUrl && chatbotImageUrlValid ?
                                <Image
                                    src={chatbotImageUrl}
                                    width={650}
                                    height={150}
                                    alt='userImage'
                                    className='rounded-sm slim-border border-black'
                                /> :
                                <p className='font-semibold text-14'>Enter Image Url To See Preview</p>
                        }
                    </div>
                )
            case "phone":
                return (
                    <div className='mt-5 flex flex-col gap-2'>
                        <RightSideLabel
                            label='Add Phone Number To Show'
                            isOptional={false}
                            helpText='type to Show Message to user !'
                        />
                        <div className='w-full'>
                            <Input
                                defaultValue={textareaContent}
                                value={textareaContent}
                                onChange={handleTextareaChange}
                                placeholder='Insert Phone Number To Show'
                            />
                        </div>
                    </div>
                )
            case "number":
                return (
                    <div className='mt-5 flex flex-col gap-2'>
                        <RightSideLabel
                            label='Add Number To Show'
                            isOptional={false}
                            helpText='type to Show Message to user !'
                        />
                        <div className='w-full'>
                            <Input
                                defaultValue={textareaContent}
                                value={textareaContent}
                                onChange={handleTextareaChange}
                                placeholder='Insert Number To Show'
                            />
                        </div>
                    </div>
                )
            case "email":
                return (
                    <div className='mt-5 flex flex-col gap-2'>
                        <RightSideLabel
                            label='Add Email To Show'
                            isOptional={false}
                            helpText='type to Show Message to user !'
                        />
                        <div className='w-full'>
                            <Input
                                defaultValue={textareaContent}
                                value={textareaContent}
                                onChange={handleTextareaChange}
                                placeholder='Insert Email Address To Show'
                            />
                        </div>
                    </div>
                )
            case "default":
                return (
                    <div>dfsdf</div>
                )
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

                                {activeChatbotDatatype == "ai" ?
                                    <div className='p-3'>
                                        <RightSideLabel
                                            label='Store Response In Variable'
                                            isOptional={true}
                                            helpText='Variables hold User Response and can be used for next messages !'
                                        />
                                        <Popover open={open} onOpenChange={setOpen} >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between mt-3"
                                                >
                                                    {aiVariable || "Create Or Select variable..."}
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
                                                            <CommandList defaultValue={aiVariable ? aiVariable : undefined}>
                                                                {variables.map((variable) => (
                                                                    <CommandItem
                                                                        key={variable}
                                                                        value={variable}
                                                                        onSelect={(value: string) => handleVariableChange(value, "ai")}
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

                                        <div className='mt-5'>
                                            <RightSideLabel
                                                label='Add Data Type Of AI'
                                                isOptional={true}
                                                helpText='Which Type of data should AI respond'
                                            />
                                            <Select
                                                defaultValue={aiDataType}
                                                value={aiDataType}
                                                onValueChange={(value: string) => setAiDataType(value)}>
                                                <SelectTrigger className="w-full ring-0 focus:ring-0 mt-4">
                                                    <SelectValue placeholder="Select Data Type" className='text-black font-semibold ring-0 focus:ring-0' />
                                                </SelectTrigger>
                                                <SelectContent >

                                                    {giveResponse.map((input) => {
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
                                            <div className='mt-5'>
                                                <Label>AI Prompt For this message</Label>

                                                <div className='w-full'>
                                                    <Popover open={variableDropdownOpen} onOpenChange={setVariableDropdownOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Textarea
                                                                defaultValue={aiContentPrompt}
                                                                value={aiContentPrompt}
                                                                onChange={(e) => {
                                                                    handleTextareaChange(e)
                                                                    setAiContentPrompt(e.target.value)
                                                                }}
                                                                placeholder='Enter Your Text or use { To insert variables'
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <ScrollArea className="h-fit w-[350px] rounded-md">
                                                                <Command className='w-full'>
                                                                    <CommandInput
                                                                        placeholder="Type to Create or Search Variable..."
                                                                        className='w-full'
                                                                        onValueChange={(val) => setVariableInputValue(val)}
                                                                    />
                                                                    <CommandEmpty>
                                                                        No variables found.
                                                                    </CommandEmpty>
                                                                    <CommandGroup className='w-full'>
                                                                        <CommandList>

                                                                            {variables.map((variable: string) => (
                                                                                <CommandItem
                                                                                    key={variable}
                                                                                    value={variable}
                                                                                    onSelect={() => handleAiPromtSelect(variable)}
                                                                                    className='hover:bg-gray-200'
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            variableInputValue === variable ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    <p className='text-left w-full font-semibold text-black'>{variable}</p>
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandList>
                                                                    </CommandGroup>
                                                                </Command>
                                                            </ScrollArea>

                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>


                                    </div> : <div className='p-3'>                         {/* segrigation is here*/}
                                        <div className='mb-5'>
                                            {/* chatbot */}
                                            <RightSideLabel
                                                label='Store Response In Variable'
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

                                        {showChatbotManips(chatbotDataType, "message")}

                                    </div>
                                }

                            </TabsContent>



                            <TabsContent value="user">
                                <div className='flex flex-col gap-6 p-3'>
                                    <div>
                                        <RightSideLabel
                                            label='Store Response In Variable'
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
                                                <Command className='w-full' defaultValue={value || undefined} value={value || undefined}>
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
                                                                        onSelect={(value: string) => handleVariableChange(value, "chatbot")}
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
                                            helpText='Specify which type of user input you want !'
                                        />
                                        <Select
                                            defaultValue={currentDataType || undefined}
                                            value={currentDataType || undefined}
                                            onValueChange={(value: string) => setCurrentDataType(value)}>
                                            <SelectTrigger className="w-full ring-0 focus:ring-0 mt-4">
                                                <SelectValue placeholder="Select Data Type" className='text-black font-semibold ring-0 focus:ring-0' />
                                            </SelectTrigger>
                                            <SelectContent defaultValue={currentDataType}>
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


