import React from 'react'
import Link from 'next/link'
import Logo from '../Logo'
import '../../app/globals.css'
import Image from 'next/image'
import { Button } from './button'
import { ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'
export default function Footer() {
  return (
    <footer>
      <div id="divider_id" className="website-divider-container-591311 w-full h-[460px]">

        <svg xmlns="http://www.w3.org/2000/svg" className="divider-img-591311 fill-yellow-6 mt-10" viewBox="0 0 1080 137" preserveAspectRatio="none">
          <path d="M 0,137 V 59.03716 c 158.97703,52.21241 257.17659,0.48065 375.35967,2.17167 118.18308,1.69101 168.54911,29.1665 243.12679,30.10771 C 693.06415,92.25775 855.93515,29.278599 1080,73.61449 V 137 Z" style={{ opacity: 0.85 }}></path>
          <path d="M 0,10.174557 C 83.419822,8.405668 117.65911,41.78116 204.11379,44.65308 290.56846,47.52499 396.02558,-7.4328 620.04248,94.40134 782.19141,29.627636 825.67279,15.823104 1080,98.55518 V 137 H 0 Z" style={{ opacity: 0.5 }}></path>
          <path d="M 0,45.10182 C 216.27861,-66.146913 327.90348,63.09813 416.42665,63.52904 504.94982,63.95995 530.42054,22.125806 615.37532,25.210412 700.33012,28.295019 790.77619,132.60682 1080,31.125744 V 137 H 0 Z" style={{ opacity: 0.2 }}></path>
        </svg>

        <div className='bg-yellow-6 h-full w-full opacity-95 '>
          <div className='flex justify-center items-center gap-2'>


            <div>
              <p className='text-black font-semibold text-24'>Task Deno</p>
            </div>
          </div>

          <div className='text-center w-full mt-10'>
            <p className='text-[40px] font-bold text-black'>Update Your Customer's AI Experience With TaskDeno</p>
            <p className='capitalize text-18 text-black font-semibold mt-5'>be the next generation aI creator with TaskDeno. The Ultimate AI <br />Builder With robust performance and Mordern experience.</p>
            <Button onClick={() => redirect('/sign-up')} className='w-[190px] h-[50px] bg-yellow-3 hover:bg-yellow-3 mt-5 border-black border-2 hover:border-dashed transition-all hover:border-2'>
              <div className='flex gap-2'>
                <p className='font-semibold text-black'>Build For Free</p>
                <ArrowRight className='text-black' />
              </div>
            </Button>
          </div>
          <div className="flex justify-center mt-32 space-x-4 ">
            <Link href="https://x.com/parshv402" aria-label="Twitter" legacyBehavior target='_blank'>
              <a className="flex justify-center items-center text-black bg-white hover:text-gray-100 hover:bg-yellow-500 rounded-full transition duration-150 ease-in-out">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                </svg>
              </a>
            </Link>
            <Link href="https://github.com/parshvJS" aria-label="Github" legacyBehavior target='_blank'>
              <a className="flex justify-center items-center text-black bg-white hover:text-gray-100 hover:bg-yellow-500 rounded-full transition duration-150 ease-in-out">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                </svg>
              </a>
            </Link>
            <Link href="https://www.instagram.com/_parshv21/" aria-label="Instagram" legacyBehavior target='_blank'>
              <a className="flex justify-center items-center text-black bg-white hover:text-gray-100 hover:bg-yellow-500 rounded-full transition duration-150 ease-in-out">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20.145" cy="11.892" r="1" />
                  <path d="M16 20c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
                  <path d="M20 24h-8c-2.056 0-4-1.944-4-4v-8c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zm-8-14c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2v-8c0-.935-1.065-2-2-2h-8z" />
                </svg>
              </a>
            </Link>
            <Link href="https://www.linkedin.com/in/parshvjs" aria-label="Linkedin" legacyBehavior target='_blank'>
              <a className="flex justify-center items-center text-black bg-white hover:text-gray-100 hover:bg-yellow-500 rounded-full transition duration-150 ease-in-out">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
                </svg>
              </a>
            </Link>
          </div>
          <div className='w-full h-[50px] flex justify-center items-center bg-yellow-5 mt-5'>
            <p className="text-sm text-black font-semibold">&copy; 2024 TaskDeno AI. All rights reserved.</p>

          </div>
        </div>
      </div>
    </footer>
  )
}
