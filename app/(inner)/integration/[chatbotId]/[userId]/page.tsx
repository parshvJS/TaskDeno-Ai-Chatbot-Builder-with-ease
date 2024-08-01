'use client'
import DashdataContext from '@/context/dashboardContext';
import { Link, Loader, LoaderPinwheel } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

import CodeSnippet from '@/components/CodeSnippt';
import { Label } from '@/components/ui/label';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

function page() {

    const {isScriptTagGenerating, dashdata, loading, activeProjectId, setActiveProjectId } = useContext(DashdataContext)
    const [isUserAllowed, setIsUserAllowed] = useState(true)
    const { userId } = useAuth()
    const params: chatUserParams = useParams();
    const userIdParams = params.userId;
    const chatbotId = params.chatbotId;
    const router = useRouter()
    // initial check that user can access the page or not
    useEffect(() => {
        async function isAllowed() {
            console.log(userId, userIdParams, userIdParams !== userId, "is not allowing");

            if (!userIdParams) {
                return;
            }

            if (userIdParams !== userId) {
                setIsUserAllowed(false)
            }

        }
        console.log("here");
        if (userId && chatbotId) {
            console.log("here 1");
            setActiveProjectId(chatbotId)
            isAllowed();
        }

    }, [userId, chatbotId,userIdParams])

    if (!isUserAllowed) {
        return (
            <div className='w-screen h-screen flex justify-center items-center'>
                <p className='text-24 font-semibold'>You Dont Have Access To This Page</p>
            </div>
        )
    }
    return (

        <>
            <div className='flex flex-col h-full w-full mx-10 my-5 '>
                <section className='flex flex-col gap-4 w-fit mb-5'>
                    <Label className='text-page-header'>Integration To Webside</Label>
                    <p className='font-semibold text-14 text-gray-500'>Guide To Add TaskDeno Chatbot To Your Website</p>

                    <section>
                        {/* step 1 */}
                        <div className='w-full h-12 slim-border rounded-md text-center flex items-center p-2 gap-2'>
                            <b>Step 1 : </b>
                            <p className='font-medium'>Create Your Chatbot workflow</p>
                        </div>

                        <div className='text-16 font-semibold flex flex-col gap-2 ml-5 mt-5'>
                            Go To Chatbot Builder And Create Own Chatbot <br />
                            <Button onClick={() => router.push(`/builder/${chatbotId}/${userIdParams}`)} className='w-fit hover:bg-yellow-2' >Go To Builder</Button>
                        </div>

                        {/* step 2 */}
                        <div>
                            <div className='capitalize w-full h-12 slim-border rounded-md text-center flex items-center p-2 gap-2 mb-5 mt-5'>
                                <b>Step 2 : </b>
                                <p className='font-medium'>Copy The Chatbot script</p>
                            </div>
                            {
                                isScriptTagGenerating? (
                                    <div>
                                        <Loader className='animate-spin' />
                                    </div>
                                )
                                :
                                <CodeSnippet language="tsx" codeString={dashdata.scriptTag} />
                            }
                        </div>
                        {/* create step 3 saying "paste in any CMS or custom code of home page" */}
                        <div className='w-full h-12 slim-border rounded-md text-center flex items-center p-2 gap-2'>
                            <b>Step 3 : </b>
                            <p className='font-medium'>Paste The Chatbot Script In Your Website</p>
                        </div>

                    </section>
                </section>
            </div>
        </>
    )
}

export default page