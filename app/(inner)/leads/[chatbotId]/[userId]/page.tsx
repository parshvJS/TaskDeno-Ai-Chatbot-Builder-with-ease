'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { chatUserParams } from '@/types/types';
import { useAuth } from '@clerk/nextjs';
import { CloudDownload, Loader, Loader2, LoaderPinwheel, Settings2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import projectContext from '@/context/chatbotContext';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
export type EachLead = { field: string, isSelected: boolean }
function page() {
    const [isLeadsLoading, setIsLeadsLoading] = useState(false)
    const [isEditLeadLoading, setIsEditLeadLoading] = useState(false)
    const [leads, setLeads] = useState([])
    const [editedLeads, setEditedLeads] = useState<EachLead[]>([])
    const { project } = useContext(projectContext)
    const { userId } = useAuth()
    const params: chatUserParams = useParams();
    const { toast } = useToast()
    function handleLeadToggle(index: number) {
        const lead = leads[index].field;
        let newEditedLeads;

        if (editedLeads.includes(lead)) {
            if (editedLeads.length == 1) {
                toast({
                    title: "You Must Need One field To Store",
                    description: "you are removing all leads field",
                    variant: "destructive"
                })
                return;
            }
            newEditedLeads = editedLeads.filter((item) => item !== lead);
        } else {
            newEditedLeads = [...editedLeads, lead];
        }
        console.log(newEditedLeads, "lolllllllll")
        setEditedLeads(newEditedLeads);
    }


    async function handleShowAllLeads() {
        setIsEditLeadLoading(true)

        try {
            const projectId = params.chatbotId;
            if (!projectId) {
                return;
            }

            const rawLeads = await axios.post('/api/getLeadsField', {
                projectId: projectId
            })

            const leads = rawLeads.data.data
            console.log("Leadsssssss", leads)
            setLeads(leads)
            const newInititalLeads: string[] = [];

            leads.forEach((lead: EachLead) => {
                if (lead.isSelected) {
                    newInititalLeads.push(lead.field)
                }
            });
            console.log(newInititalLeads, 'poooooooooop');

            setEditedLeads(newInititalLeads);

        } catch (error: any) {
            toast({
                title: "Can't Load Leads ",
                description: error.message,
                variant: 'destructive'
            })
            throw new Error(error.message)

        }
        finally {
            setIsEditLeadLoading(false)
        }
    }


    return (
        <div className='flex flex-col h-full w-full'>
            <Label className='text-page-header'>Manage Leads</Label>
            <p className='font-semibold text-14 text-gray-500 mt-2'>All Data That have been collected</p>

            <div id='controller' className='flex items-center gap-3 w-full my-3'>
                <Dialog>
                    <DialogTrigger>
                        <Button onClick={handleShowAllLeads} variant={"ghost"} className='bg-gray-300'>
                            <div className='flex gap-2'>
                                <Settings2 strokeWidth={1.5} width={20} height={20} />
                                <p className='font-semibold text-14'>Edit Fields To store</p>
                            </div>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select Fields To Store</DialogTitle>
                            <DialogDescription>
                                {
                                    isEditLeadLoading ? (
                                        <div className='flex gap-2 my-5'>
                                            <LoaderPinwheel
                                                strokeWidth={1.5}
                                                className='animate-spin'
                                            />
                                            <p>Managing Infinity leads</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className='flex flex-1 w-full gap-2 my-5'>
                                                {
                                                    leads.map((lead: EachLead, index: number) => {
                                                        const isActive = editedLeads.includes(lead.field);
                                                        return (
                                                            <div
                                                                key={index} // Make sure to add a key prop when mapping
                                                                onClick={() => handleLeadToggle(index)}
                                                                className={`${isActive ? "bg-yellow-300" : "bg-yellow-100"} cursor-pointer p-3 rounded-md `}
                                                            >
                                                                <p className='text-black font-semibold'>{lead.field}</p>
                                                            </div>
                                                        );
                                                    })
                                                }

                                            </div>
                                            <Button>
                                                {
                                                    isLeadsLoading ? (
                                                        <div className='flex gap-2 items-center'>
                                                            <Loader
                                                                width={20}
                                                                height={20}
                                                                className="animate-spin"
                                                            />
                                                            Loading ...
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            Save
                                                        </div>
                                                    )
                                                }
                                            </Button>
                                        </div>

                                    )
                                }

                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>



                <Button variant={"ghost"} className='bg-gray-300'>
                    <div className='flex gap-2'>
                        <CloudDownload strokeWidth={1.5} width={20} height={20} />
                        <p className='font-semibold text-14'>Download As CSV</p>
                    </div>
                </Button>


            </div>

        </div>
    )
}

export default page