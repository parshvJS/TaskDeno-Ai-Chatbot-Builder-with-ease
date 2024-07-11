export const metadata = {
  title: 'TaskDeno | Home',
  description: 'Build your ai chatbot with Task Deno',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Zigzag from '@/components/zigzag'
import Testimonials from '@/components/testimonials'
import Header from '@/components/ui/header'

export default function Home() {
  return (
    <>
      <div className="flex flex-col max-h-full overflow-hidden min-w-screen">
        <Header />
        <Hero />
        <Features />
        <Zigzag />
        {/* <Testimonials /> */}
        {/* <Newsletter /> */}
      </div>
    </>
  )
}
