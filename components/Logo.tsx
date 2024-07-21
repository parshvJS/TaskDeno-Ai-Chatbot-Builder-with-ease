import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <div>
            <Link href="/mydenos" className='flex cursor-pointer items-center gap-1  max-lg:hidden w-fit p-2 rounded-full hover:bg-yellow-50 px-3 transition-all'>
                <Image
                    src={'/icons/logo.svg'}
                    width={25}
                    height={25}
                    alt='logo'

                />
                <h1 className='text-lg font-bold text-yellow-300 max-lg:hidden '>Task Deno</h1>
                
            </Link>
        </div>
    )
}

export default Logo