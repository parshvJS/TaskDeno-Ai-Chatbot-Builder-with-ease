import { Handle, Position } from "reactflow"

export const StarterNode = () => {

    return (
        <div>
            <div className="w-[80px] h-[40px] bg-yellow-1 rounded-full border-2 border-yellow-6 flex justify-center items-center">
                <p className="font-semibold text-yellow-6">Start</p>
            </div>
            <Handle type="source" position={Position.Bottom} id="a" className='w-2 h-2 text-yellow-4' />
        </div>
    )
}