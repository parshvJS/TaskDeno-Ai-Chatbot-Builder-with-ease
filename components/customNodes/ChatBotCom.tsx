import projectContext from '@/context/chatbotContext';
import { useCallback, useContext } from 'react';
import { Handle, Position } from 'reactflow';
 
const handleStyle = { left: 10 };
 
export default function ChatBotCom({
    userInputType,
    aiResponse,
}:{
    userInputType: string,
    aiResponse: string,
}) {
    const {project} = useContext(projectContext)
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
        <div className=' p-2 w-[300px] h-[250px] bg-gray-100 border-2 border-gray-300 rounded-md  hover:border-gray-400'>
            {/* node name */}
            <p>{`Group # ${project.nodes.length+1}`}</p>
        </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    
    </>
  );
}