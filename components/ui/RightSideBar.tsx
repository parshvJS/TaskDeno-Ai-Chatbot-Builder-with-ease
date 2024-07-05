import React, { useContext, useState } from 'react';
import { X } from 'lucide-react';
import { Panel } from 'reactflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from './input';
import SidebarContext from '@/context/RightSideBarContext';
import { cn } from '@/lib/utils';
import RightSideLabel from './RightSideLabel';

function RightSideBar() {
    const { sidebar, setSidebar, setIsSidebarActive } = useContext(SidebarContext);
    const [showInput, setShowInput] = useState(false)
    const handleChange = (e) => {
        const newName = e.target.value;
        console.log("input changed ", e.target.value);

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
                                <TabsTrigger value="account" className='w-1/2'>
                                    <p className='capitalize'>{sidebar.currentNode.data?.message?.type || sidebar.currentNode.data?.ai?.type || "AI "}</p>
                                </TabsTrigger>
                                <TabsTrigger value="password" className='w-1/2'>
                                    <p className='capitalize'>
                                        {sidebar.currentNode?.data?.user?.type || "User"}
                                    </p>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">Make changes to your account here.</TabsContent>
                            <TabsContent value="password">
                                <div className='p-2'>
                                    <RightSideLabel
                                        label='Store User Response In Variable'
                                        isOptional={true}
                                        helpText='Variables hold User Response and can be used for next messages !'
                                    />
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
