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
            <TabsContent value="element">Make changes to your account here.</TabsContent>
            <TabsContent value="styling">


            </TabsContent>
          </Tabs>


        </div>
        <div className='w-[50%] h-full bg-gray-100 p-4'>
          <section className='flex flex-col gap-4 w-fit mb-2'>
            <Label className='text-18 '>Preview Design</Label>
          </section>
          <div className='w-full h-full'>
            <ReactChatbotUi
              project={{
                panelWidth: 400,
                starterMessage: 'Welcome to Task Deno | Filora',
                colorTheme: '#441EEC',
                marginBottom: 30,
                marginRight: 30,
                userChatbotName: 'Task Deno | Filora',
                userChatbotImage: 'https://dstal.com.au/wp-content/uploads/2021/09/logoipsum-768x360.png',
                userChatbotLogo: 'https://img.icons8.com/?size=100&id=7859&format=png&color=000000',
                borderRadius: 10,
                welcomeText: 'Hello! What Is Your Question?',
                faq: [
                  {
                    question: 'Where can I contact you?',
                    previewAnswer: 'You can contact us through the following channels:',
                    wholeAnswer: '<p>You can contact us through the following channels:</p><ul><li><b>Email:</b> find in footer</li><li><b>Phone:</b> find in footer</li><li><b>Live Chat:</b> Visit our website and click on the live chat button</li></ul>'
                  }
                ],
                contact: {
                  email: 'find in footer',
                  phone: 'find in footer',
                  liveChat: 'Visit our website and click on the live chat button'
                }
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