'use client'
import DashdataContext from '@/context/dashboardContext';
import { Link, LoaderPinwheel } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { Highlight, themes } from "prism-react-renderer"
import styles from 'styles.module.css'
import CodeSnippet from '@/components/CodeSnippt';
interface chatUserParams {
    chatbotId: string,
    userId: string
}
const codeBlock = `
const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  return (
    <div>
      <h2>{item.name}</h2>
      <p>Price: {item.price}</p>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}   `
function page() {
    const { loading, activeProjectId, setActiveProjectId } = useContext(DashdataContext)

    const params: chatUserParams = useParams();
    const userId = params.userId;
    const chatbotId = params.chatbotId;
    // initial check that user can access the page or not
    useEffect(() => {
        async function isAllowed() {
            console.log(userId, "is not allowing");

            if (!userId) {
                return;
            }

            if (userId !== params.userId) {
                return (
                    <div className='w-screen h-screen bg-yellow-2'>
                        <p className='text-24 font-semibold'>You Dont Have Access To This Page</p>
                        <Link href={'/mydenos'} className='w-[230px] h-[80px] bg-yellow-5 '>
                            <p className='border-2 border-white-1 text-white-1'>Go To Dashboard</p>
                        </Link>

                    </div>
                )
            }

        }
        console.log("here");
        if (userId && chatbotId) {
            console.log("here 1");
            setActiveProjectId(chatbotId)
            isAllowed();
        }

    }, [userId, chatbotId])

    // JSX boundry
    if (loading) {
        return <div className='w-screen h-screen flex justify-center items-center flex-col'>
            <LoaderPinwheel width={30} height={30} className='animate-spin text-gray-600' />
            <p className='text-16  font-semibold text-gray-600'>Starting Chatbot Engine!</p>
        </div>
    }

    return (
        <CodeSnippet language="tsx" codeString={codeBlock} />
    )
}

export default page