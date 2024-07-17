import { Label } from '@/components/ui/label';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactChatbotUi from '@/chat-template/ReactChatbotUi';

function page() {



  return (
    <div className='flex flex-col h-[96%] w-full'>
      {/* <section className='flex flex-col gap-4 w-fit mb-5'>
        <Label className='text-page-header'>Customize Appearence & Theme</Label>
      </section> */}

      <section className='w-full h-full flex rounded-md slim-border'>
        <div className='w-[50%] h-full p-5'>
          <section className='flex flex-col gap-4 w-fit mb-5'>
            <Label className='text-18 '>Customize Chatbot Looks</Label>
          </section>


          {/* tabs */}
          <Tabs defaultValue="element" className="w-[400px]">
            <TabsList className='bg-yellow-3' >
              <TabsTrigger value="element" className='text-black' >UI Elements</TabsTrigger>
              <TabsTrigger value="styling" className='text-black'>Styling Theming</TabsTrigger>
            </TabsList>
            <TabsContent value="element" >Make changes to your account here.</TabsContent>
            <TabsContent value="styling">


            </TabsContent>
          </Tabs>


        </div>
        <div className='w-[50%] h-full bg-gray-100 p-4'>
          <section className='flex flex-col gap-4 w-fit mb-5'>
            <Label className='text-18 '>Preview Design</Label>
          </section>
          <div className='w-full h-[95%] '>
            <ReactChatbotUi
              project={{
                panelWidth: 400,
                starterMessage: 'Welcome to Task Deno | Filora',
                colorTheme: '#eeff00',
                marginBottom: 30,
                marginRight: 30,
                userChatbotName: 'Task Deno | Filora',
                userChatbotImage: 'https://placehold.co/600x400',
                userChatbotLogo: 'https://placehold.co/70x70',
                borderRadius: 10
              }}
            />
          </div>

        </div>
        {/* design */}

      </section>
    </div>
  )
}

export default page 