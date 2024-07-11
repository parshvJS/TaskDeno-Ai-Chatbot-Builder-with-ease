'use client'
import DashdataContext, { DashdataProvider } from '@/context/dashboardContext';
import { useAuth } from '@clerk/nextjs';
import { LoaderPinwheel } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
function page() {
  // context values 
  const { loading, activeProjectId, setActiveProjectId } = useContext(DashdataContext)
  const params: { chatbotId: string, userId: string } = useParams()
  const { userId, isLoaded } = useAuth();
  const chatbotId = params.chatbotId || params.chatbotId[0];
  const router = useRouter()


  useEffect(() => {
    async function isAllowed() {
      console.log(userId, "is not allowing");

      if (!userId) {
        return;
      }
      // backend check need to be done
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
    <div>page</div>
  )
}

export default page