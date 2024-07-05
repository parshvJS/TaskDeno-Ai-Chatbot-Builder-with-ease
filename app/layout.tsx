'use client'
import './css/style.css'
import './globals.css'
import { Inter, Architects_Daughter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectProvider } from '@/context/chatbotContext'
import { RightSideBarProvider } from '@/context/RightSideBarContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const architects_daughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
  display: 'swap'
})



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient();
  return (


    <ProjectProvider >
      <RightSideBarProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider>
            <html lang="en">
              <body className={`${inter.variable} ${architects_daughter.variable} transition-all font-inter antialiased bg-white-1 tracking-tight`}>
                {/* <div className="flex flex-col min-h-screen overflow-hidden min-w-screen"> */}
                {/* <Header /> */}
                {children}
                {/* </div> */}
                <Toaster />
              </body>
            </html>
          </ClerkProvider>
        </QueryClientProvider>
      </RightSideBarProvider>
    </ProjectProvider>

  )
}
