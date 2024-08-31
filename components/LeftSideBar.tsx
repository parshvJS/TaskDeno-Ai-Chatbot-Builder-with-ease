'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from '@/constants/constants'
import Logo from './Logo'
import { useClerk } from '@clerk/nextjs'

const LeftSideBar = ({
    navArray,
    isLogoutVisible = false,
    projectId = "",
    userId = "",
    isRedirectCustom = false
}: {
    navArray: typeof navItems,
    isLogoutVisible?: boolean,
    projectId?: string,
    userId: string,
    isRedirectCustom?: boolean
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    return (
        <section className='left_sidebar transition-all sticky '>
            <nav className='flex flex-col gap-2 transition-all  '>
                <Logo />

                {/* nav items */}
                {
                    navArray.map((item) => {
                        const isActive = item.route == pathname || pathname.startsWith(`${item.route}/`);
                        return isRedirectCustom ? <Link href={`${item.route}/${projectId}/${userId}`} key={item.label} className={cn(' flex gap-3 items-center max-lg:px-3 justify-center lg:justify-start transition-all hover:bg-yellow-200 rounded-md  py-[12px] px-2 mr-4', {
                            'bg-nav-focus   transition-all bg-yellow-200 rounded-md ': isActive,
                        })}>   <Image src={item.imgUrl} alt={item.label} width={20} height={20} />
                            <p className='text-black font-semibold text-sm'>{item.label}</p></Link>
                            :
                            <Link href={item.route} key={item.label} className={cn(' flex gap-3 items-center max-lg:px-3 justify-center lg:justify-start transition-all hover:bg-yellow-200 rounded-md  py-[12px] px-2 mr-4', {
                                'bg-nav-focus   transition-all bg-yellow-200 rounded-md ': isActive,
                            })}>
                                <Image src={item.imgUrl} alt={item.label} width={20} height={20} className='hover:font-yellow-1' />
                                <p className='text-black font-semibold text-sm'>{item.label}</p>
                            </Link>
                    })
                }

                {
                    isLogoutVisible && (
                        <div className='py-[12px] px-2 mr-4 hover:bg-yellow-100 rounded-md'>
                            <button className='flex gap-2 ' onClick={() => signOut({ redirectUrl: '/' })}>
                                <Image
                                    src={'/icons/logout.svg'}
                                    width={20}
                                    height={20}
                                    alt="logout"
                                />
                                <p className='font-semibold text-black text-sm'>Logout</p>
                            </button>
                        </div>
                    )
                }
            </nav>


        </section>
    )
}

export default LeftSideBar