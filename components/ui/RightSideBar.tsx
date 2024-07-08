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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function RightSideBar({ variables, setVariables }: any) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const { sidebar, setSidebar, setIsSidebarActive, isSidebarActive } = useContext(SidebarContext);
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [currentDataType, setCurrentDataType] = useState("")
    const [chatbotDataType, setChatbotDataType] = useState("")
    const [chatbotVariable, setChatbotVariable] = useState("")
    const [variableDropdownOpen, setVariableDropdownOpen] = useState(false);
    const [variableInputValue, setVariableInputValue] = useState("");
    const [textareaContent, setTextareaContent] = useState("");
    const [chatbotImageUrl, setChatbotImageUrl] = useState("")
    const [chatbotImageUrlValid, setChatbotImageUrlValid] = useState(false)
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
            setChatbotVariable(chatBotDatatype.variable)
            if (activeChatbotDatatype == "message") {
                setChatbotDataType(sidebar.currentNode.data.message.type)
            }
            // console.log("rightSidebar::setting initital chatbot data type", chatBotDatatype);
            // setChatbotDataType(chatBotDatatype.type)
            // setChatbotVariable(chatBotDatatype.variable)
        }
    }, [sidebar.activeNodeId]);

    // set initital values for text related content 
    useEffect(() => {
        if (activeChatbotDatatype == "ai") {
            return;
        }
        if (chatbotDataType) {
            console.log("i am side bar content changer", chatbotDataType);

            switch (chatbotDataType) {
                case "text":
                    console.log("switch case value::text");
                    setTextareaContent(sidebar.currentNode.data.message.content)
                case "image":
                    console.log("switch case value::Image", sidebar);
                    setChatbotImageUrl(sidebar.currentNode.data.message.content)
            }
        }
    }, [chatbotDataType, sidebar.activeNodeId])


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

    // when variable changes then this useEffect changes sidebar
    useEffect(() => {
        if (activeChatbotDatatype == "ai") {
            return;
        }
        console.log("useEffect called");
        let contentHolder: string;
        if (chatbotDataType) {
            // check chatbot datatype and set content 
            switch (chatbotDataType) {
                case "text":
                    contentHolder = textareaContent
                case "image":
                    contentHolder = chatbotImageUrl
            }
        }

        else {
            console.log("i am backup here  ---------------------", activeChatbot, chatbotDataType);
            switch (activeChatbot.type) {
                case "text":
                    contentHolder = activeChatbot.content
                case "image":
                    contentHolder = activeChatbot.content
                    setChatbotImageUrlValid(true)
            }

        }
        console.log("i am contentHolder", contentHolder);

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
                            variable: chatbotVariable,
                            content: contentHolder
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


    }, [value, currentDataType, chatbotDataType, chatbotVariable, textareaContent, chatbotImageUrl])

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        setTextareaContent(value);

        // Show dropdown when `{` is typed
        if (value.endsWith("{")) {
            setVariableDropdownOpen(true);
        } else {
            setVariableDropdownOpen(false);
        }
    };

    const handleVariableSelect = (variable) => {
        const newValue = textareaContent.replace(/\{$/, `{${variable}`);
        setTextareaContent(newValue);
        setVariableDropdownOpen(false);
    };

    const handleImageUrlChange = (e) => {
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

    function showChatbotManips(datatype: string) {
        if (activeChatbotDatatype == "ai") {
            return;
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

                                    {showChatbotManips(chatbotDataType)}

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
                                                            <CommandList defaultValue={value}>
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
                                            defaultValue={currentDataType}
                                            value={currentDataType}
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