'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from '@/constants/constants'
import Logo from './Logo'

const LeftSideBar = ({
    navArray
}: {
    navArray: typeof navItems
}) => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <section className='left_sidebar transition-all'>
            <nav className='flex flex-col gap-2 transition-all'>
                <Logo />
                

                {/* nav items */}
                {
                    navArray.map((item) => {
                        const isActive = item.route == pathname || pathname.startsWith(`${item.route}/`);


                        return <Link href={item.route} key={item.label} className={cn('w-full flex gap-3 items-center max-lg:px-3 justify-center lg:justify-start transition-all hover:bg-gradient-to-l to-white-1 from-yellow-100 py-[12px]', {
                            'bg-nav-focus border-r-4 border-yellow-400 bg-gradient-to-l to-white-1 from-yellow-100 via-yellow-50 transition-all': isActive,

                        })}>
                            <Image src={item.imgUrl} alt={item.label} width={20} height={20} />
                            <p className='text-black font-semibold text-sm'>{item.label}</p>
                        </Link>
                    })
                }
            </nav>

        </section>
    )
}

export default LeftSideBar