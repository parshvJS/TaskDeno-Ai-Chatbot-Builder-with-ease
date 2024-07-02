import Image from 'next/image'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleHelp } from 'lucide-react'


function SideLabel({ imgUrl, label, helpText }: { imgUrl: string, label: string, helpText: string }) {
    return (
        <div className='flex gap-2 items-center mb-5'>
            <div className='flex gap-2 items-center '>
                <Image
                    src={imgUrl}
                    width={20}
                    height={20}
                    alt={label}
                />
                <h1 className='font-semibold text-16'>{label}</h1>
            </div>
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <TooltipTrigger>
                        <CircleHelp width={13} height={13} className='mt-1'/>
                    </TooltipTrigger>
                    <TooltipContent side='top' className='bg-gray-200'>
                        <p className='capitalize'>{helpText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


        </div>
    )
}

export default SideLabel