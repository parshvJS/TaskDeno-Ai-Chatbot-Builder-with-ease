'use client'
import SlimCard from '@/components/SlimCard';
import { Label } from '@/components/ui/label';
import DashdataContext, { DashdataProvider } from '@/context/dashboardContext';
import { useAuth } from '@clerk/nextjs';
import { LoaderPinwheel } from 'lucide-react';
import Image from 'next/image';
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
    <div className='flex flex-col h-full w-full p-4'>
      <section className='flex flex-col gap-4 w-fit mb-5'>
        <Label className='text-page-header'>Dashboard</Label>
      </section>
      <div className='w-full grid grid-rows-1 grid-cols-3 gap-3'>
        <SlimCard pointer={true} className='w-full h-full flex-1 cursor-pointer flex justify-center items-center flex-col'>
          <Image
            src='/icons/builder-illu.svg'
            width={220}
            height={300}
            alt="Go to builder"
          />
          <p className='text-18 font-semibold'>Go To Builder</p>
        </SlimCard>
        <SlimCard pointer={true} className='w-full h-full flex-1 cursor-pointer flex justify-center items-center flex-col'>
          <Image
            src='/icons/stats-illu.svg'
            width={310}
            height={300}
            alt="Statistics"
          />
          <p className='text-18 font-semibold'>View Statistics</p>
        </SlimCard>
        <SlimCard pointer={true} className='w-full h-full flex-1 cursor-pointer flex justify-center items-center flex-col'>
          <Image
            src='/icons/lead-illu.svg'
            width={310}
            height={300}
            alt="Lead management"
          />
          <p className='text-18 font-semibold'>Manage Leads</p>
        </SlimCard>
      </div>
    </div>

  )
}

export default page