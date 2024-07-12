import React from 'react'
import {cn} from '../lib/utils'
function SlimCard({ children, pointer, className }: { children: React.ReactNode; pointer: boolean; width?: string; height?: string; className?: string }) {
    return (
        <div>
            <div className={cn('bg-white rounded-md p-2 slim-border w-fit hover:border-gray-1 transition-all', {
                'cursor-pointer': pointer,
            }, className)}>
                {children}
            </div>
        </div>
    );
}

export default SlimCard