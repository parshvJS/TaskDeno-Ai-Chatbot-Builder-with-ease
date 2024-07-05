import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleHelp } from 'lucide-react'

function RightSideLabel({
    label,
    isOptional = false,
    helpText
}: {
    label: string,
    isOptional: boolean,
    helpText: string
}) {
    return (
        <div className='flex gap-2'>
            <div className='flex items-center gap-2 '>
                <h1 className='font-semibold text-14 capitalize'>{label}</h1>
                {
                    isOptional && <div className='text-12 text-gray-400'>(Optional)</div>
                }
            </div>
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <TooltipTrigger>
                        <CircleHelp width={13} height={13} className='mt-1' />
                    </TooltipTrigger>
                    <TooltipContent side='top' className='bg-gray-200'>
                        <p className='capitalize'>{helpText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default RightSideLabel