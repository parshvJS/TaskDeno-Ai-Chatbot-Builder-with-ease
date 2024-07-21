'use client'
import Link from 'next/link'
import MobileMenu from './mobile-menu'
import { useAuth, UserButton, UserProfile } from '@clerk/nextjs'
import { ArrowRight, Loader } from 'lucide-react';
import Logo from '../Logo';

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              {
                !isLoaded ?
                  (
                    <Loader className='animate-spin text-yellow-8' />
                  ) :
                  (
                    isSignedIn ?
                      (
                        <div className='flex gap-2 '>
                          <Link className="btn text-white-1 bg-yellow-400 hover:bg-yellow-500 w-[120px] h-[40px] mb-4 sm:w-auto sm:mb-0 gap-2 flex" href="/mydenos" >
                            Go To Dashboard
                          </Link>
                        </div>
                      ) :
                      (
                        <div className='flex gap-2 w-full justify-end items-center'>
                          <li>
                            <Link
                              href="/sign-in"
                              className="font-medium text-yellow-500 hover:text-white-1px-4 py-3 flex items-center transition duration-150 ease-in-out"
                            >
                              Sign in
                            </Link>
                          </li>
                          <li>
                            <Link href="/sign-up" className="btn-sm text-white-1 bg-yellow-500 hover:bg-yellow-400 hover:text-white-1 ml-3">
                              Sign up
                            </Link>
                          </li>
                        </div>
                      )
                  )
              }
            </ul>
          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
