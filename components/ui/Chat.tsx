import React from 'react'
import { ScrollArea } from './scroll-area'
import Image from 'next/image'

function Chat({ conversation }: { conversation: Array<any> }) {
    return (
        <ScrollArea className='h-full'>
            <div className='p-4 flex flex-col gap-2'>
                {
                    conversation.map((chat, index) => {
                        if (chat.role == "chatbot" || chat.role == "ai") {
                            if (chat.type == "image") {
                                return (<div key={index} className='flex gap-2'>
                                    <div
                                        className="w-fit h-fit py-3 px-4 font-semibold"
                                        style={{
                                            borderTopLeftRadius: '5px',
                                            borderTopRightRadius: '15px',
                                            borderBottomRightRadius: '15px',
                                            borderBottomLeftRadius: '15px',
                                            backgroundColor: '#D9DADA',
                                        }}
                                    >
                                        <Image
                                            src={chat.content}
                                            width={200}
                                            height={200}
                                            alt={"image"}
                                        />
                                    </div>
                                </div>)
                            }

                            else {
                                return (
                                    <div key={index} className='flex gap-2'>
                                        <div
                                            className="w-fit h-fit py-3 px-4 font-semibold"
                                            style={{
                                                borderTopLeftRadius: '5px',
                                                borderTopRightRadius: '15px',
                                                borderBottomRightRadius: '15px',
                                                borderBottomLeftRadius: '15px',
                                                backgroundColor: '#D9DADA',
                                            }}
                                        >
                                            {chat.content}
                                        </div>
                                    </div>
                                )
                            }
                        }

                        else {
                            return <div key={index} className=' flex justify-end gap-2 font-light text-white-1'>
                                <div
                                    className="w-fit h-fit py-3 px-4 text-black font-semibold"
                                    style={{
                                        borderTopLeftRadius: '15px',
                                        borderTopRightRadius: '5px',
                                        borderBottomRightRadius: '15px',
                                        borderBottomLeftRadius: '15px',
                                        backgroundColor: "#FFFF94",
                                    }}
                                >
                                    {chat.content}
                                </div>
                            </div>
                        }
                    })
                }
            </div>
        </ScrollArea >
    )
}

export default Chat