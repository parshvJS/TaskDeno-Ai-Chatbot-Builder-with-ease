'use client'
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Send, SendToBack, X } from 'lucide-react';
import { set } from 'mongoose';
import Image from 'next/image';
import { relative } from 'path';
import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

function ReactChatbotUi(project: any) {
    const cookedProject = project.project
    console.log(cookedProject, "cooked project")
    const {
        panelWidth,
        starterMessage,
        colorTheme,
        marginBottom,
        marginRight,
        userChatbotName,
        userChatbotImage,
        userChatbotLogo,
        borderRadius,
        welcomeText,
        faq,
        contact
    } = cookedProject;
    const lighterShades = generateLighterShades(colorTheme, 3);
    const [color1, color2, color3] = lighterShades;

    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)
    const [isFaqPanelOpen, setIsFaqPanelOpen] = useState(false)

    const [hover, setHover] = useState(false);

    const [activeFaqIndex, setActiveFaqIndex] = useState(-1);
    return (
        <div className='w-full h-full flex justify-end items-end transition-all'>
            <div
                onClick={() => {
                    setIsPanelOpen(!isPanelOpen)
                    setIsChatPanelOpen(false)
                    setIsFaqPanelOpen(false)
                    setActiveFaqIndex(-1)
                }

                }
                className={`w-16 h-16 flex justify-center items-center absolute cursor-pointer transition-all`}
                style={{
                    backgroundColor: colorTheme,
                    borderRadius: `${borderRadius}px`,
                    bottom: `${marginBottom}px`,
                    right: `${marginRight + 10}px`,
                    transition: 'all 0.3s ease'
                }}>


                {
                    isPanelOpen ? (<X className='text-white-1' />) :
                        (

                            <Image
                                className='text-white-1'
                                src={userChatbotLogo}
                                alt="Picture of the author"
                                width={40}
                                height={40}
                            />

                        )
                }
            </div>

            {
                isPanelOpen && (
                    <div
                        className='rounded-md absolute mt-5 p-4'
                        style={{
                            width: `${panelWidth}px`,
                            height: '80%',
                            background: `linear-gradient(0deg, rgba(255,255,255,1) 42%, ${color1} 52%, ${colorTheme} 65%)`,
                            filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#fff",endColorstr="#3142ff",GradientType=1)',
                            bottom: marginBottom + 70 + 'px',
                            right: `${marginRight + 10}px`,
                            transition: 'all 0.3s ease',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <section className='flex flex-col gap-3'>
                            <div className="w-40 h-24 overflow-hidden">

                                <Image src={userChatbotImage} width={100} height={100} alt='logo large' className='min-w-fit p-2 max-h-[100px] rounded-md' />

                            </div>

                            <div className='flex justify-center items-center mt-2'>
                                <Image
                                    src={"/icons/brainBox.svg"}
                                    width={260}
                                    height={300}
                                    alt="brain box"
                                />
                            </div>

                            <div className="font-bold text-24 text-left leading-[25px]" dangerouslySetInnerHTML={{ __html: addLineBreaks(welcomeText) }}>
                            </div>
                            <div
                                onClick={() => {
                                    setIsChatPanelOpen(true)
                                    setIsFaqPanelOpen(false)
                                }}
                                className='flex justify-between items-center border-2 border-gray-300 w-full h-auto rounded-md p-4 hover:bg-gray-200 transition-all cursor-pointer'>
                                <div >
                                    <p className='font-bold text-16'>Ask Question</p>
                                    <p className='text-gray-400 text-14'>Ask Question AI Agent Can Help You</p>
                                </div>
                                <div>
                                    <Image
                                        src={'/icons/ques.svg'}
                                        width={20}
                                        height={20}
                                        alt="question"
                                    />

                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    setIsChatPanelOpen(false)
                                    setIsFaqPanelOpen(true)
                                }}
                                className='flex justify-between items-center border-2 border-gray-300 w-full h-auto rounded-md p-4 hover:bg-gray-200 transition-all cursor-pointer'>
                                <div>
                                    <p className='font-bold text-16'>Browse FAQs</p>
                                    <p className='text-gray-400 text-14'>Browse Detailed Solution Of Your Question</p>
                                </div>
                                <div>
                                    <Image
                                        src={'/icons/faq.svg'}
                                        width={20}
                                        height={20}
                                        alt="question"
                                    />

                                </div>
                            </div>
                        </section>
                    </div>
                )
            }


            {
                isChatPanelOpen && (

                    <div
                        className='rounded-md absolute mt-5 overflow-hidden flex flex-col justify-end'
                        style={{
                            width: `${panelWidth}px`,
                            height: '80%',
                            background: '#fff',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            bottom: marginBottom + 70 + 'px',
                            right: `${marginRight + 10}px`,
                            transition: 'all 0.3s ease'
                        }}
                    >

                        {/* header */}
                        <div
                            className='flex w-full h-16 overflow-hidden items-center py-6 gap-5'
                            style={{
                                background: colorTheme,
                                paddingLeft: '25px',
                                right: `${marginRight + 10}px`,

                            }}
                        >
                            <div
                                onClick={() => {
                                    setHover(false)
                                    setIsPanelOpen(true)
                                    setIsChatPanelOpen(false)
                                    setIsFaqPanelOpen(false)
                                }
                                }
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: hover ? color2 : colorTheme,
                                }}
                                className='p-2 rounded-md '
                            >
                                <ChevronLeft
                                    className='text-white-1'
                                    width={25}
                                    height={25}
                                />
                            </div>


                            <div>
                                <p className='font-bold tracking-wider text-16 text-white-1 '>{userChatbotName}</p>
                            </div>
                        </div>

                        {/* chat messages preview */}
                        <div className='w-full h-full flex justify-center items-center flex-col flex-grow overflow-y-auto'
                        >
                            <ScrollArea className=' w-full h-full'
                            >

                                <div className='p-4 flex justify-center items-center flex-col'>
                                    <Image
                                        src={'/icons/brainPuzzel.svg'}
                                        width={180}
                                        height={80}
                                        alt='start message'
                                        className='my-5 mb-5'
                                    />

                                    <hr className="my-4 w-full border-black" />

                                    <div className='w-full h-96 overflow-y-auto'>
                                        <div className='flex flex-col gap-2 text-14 font-normal'>

                                            {/* request */}
                                            <div className='flex gap-2 font-light'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 "
                                                    style={{
                                                        borderTopLeftRadius: '5px',
                                                        borderTopRightRadius: '15px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: '#D9DADA',
                                                    }}
                                                >
                                                    Hello! How can I help you today?
                                                </div>
                                            </div>

                                            {/* User response */}
                                            <div className=' flex justify-end gap-2 font-light text-white-1'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 "
                                                    style={{
                                                        borderTopLeftRadius: '15px',
                                                        borderTopRightRadius: '5px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: colorTheme,
                                                    }}
                                                >
                                                    Can you provide me with the shipping details for my order?
                                                </div>
                                            </div>

                                            {/* Bot response */}
                                            <div className='flex gap-2'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 font-light"
                                                    style={{
                                                        borderTopLeftRadius: '5px',
                                                        borderTopRightRadius: '15px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: '#D9DADA',
                                                    }}
                                                >
                                                    Sure! Your order has been successfully placed. It will be shipped to your address within 3-5 business days.
                                                </div>
                                            </div>

                                            {/* User response */}
                                            <div className='flex justify-end gap-2 font-light text-white-1'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 "
                                                    style={{
                                                        borderTopLeftRadius: '15px',
                                                        borderTopRightRadius: '5px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: colorTheme,
                                                    }}
                                                >
                                                    Thank you! Can you please provide me with the tracking number?
                                                </div>
                                            </div>

                                            {/* Bot response */}
                                            <div className='flex gap-2'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 font-light"
                                                    style={{
                                                        borderTopLeftRadius: '5px',
                                                        borderTopRightRadius: '15px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: '#D9DADA',
                                                    }}
                                                >
                                                    Certainly! Your tracking number is XYZ123456789.
                                                </div>
                                            </div>

                                            {/* User response */}
                                            <div className='flex justify-end gap-2 font-light text-white-1'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 "
                                                    style={{
                                                        borderTopLeftRadius: '15px',
                                                        borderTopRightRadius: '5px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: colorTheme,
                                                    }}
                                                >
                                                    Great! Thank you for your assistance.
                                                </div>
                                            </div>

                                            {/* Bot response */}
                                            <div className='flex gap-2'>
                                                <div
                                                    className="w-fit h-fit py-3 px-4 font-light"
                                                    style={{
                                                        borderTopLeftRadius: '5px',
                                                        borderTopRightRadius: '15px',
                                                        borderBottomRightRadius: '15px',
                                                        borderBottomLeftRadius: '15px',
                                                        backgroundColor: '#D9DADA',
                                                    }}
                                                >
                                                    You're welcome! If you have any more questions, feel free to ask.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </ScrollArea >
                        </div >


                        {/* header */}
                        < div className='sticky ' >
                            <hr className='border-1 border-gray-1' />
                            <div className='shadow-md flex w-full h-16 overflow-hidden items-center gap-5 justify-between p-5'>
                                <div className='flex-grow'>
                                    <input
                                        type='text'
                                        placeholder='Type your message...'
                                        className='w-[300px] ring-0 focus:ring-0  px-4 py-2 border-b-2  border-white-1  rounded-md'
                                    />
                                </div>
                                <div>
                                    <button className='p-2 w-fit h-fit flex items-center justify-center bg-blue-500 rounded-full text-white'>
                                        {/* <Send width={15} height={15} /> */}
                                        <svg
                                            style={{
                                                colorScheme: 'white',
                                                color: colorTheme,
                                                width: '20px',
                                                height: '20px',
                                            }} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                            <path d="M 26 3 A 1 1 0 0 0 25.716797 3.0429688 A 1 1 0 0 0 25.636719 3.0683594 L 3.6503906 10.060547 L 3.6503906 10.064453 A 1 1 0 0 0 3 11 A 1 1 0 0 0 3.4824219 11.853516 L 10.164062 17.154297 L 23.373047 6.6269531 L 12.845703 19.835938 L 18.142578 26.513672 A 1 1 0 0 0 19 27 A 1 1 0 0 0 19.935547 26.349609 L 19.939453 26.349609 L 26.9375 4.34375 A 1 1 0 0 0 26.957031 4.2832031 A 1 1 0 0 0 27 4 A 1 1 0 0 0 26 3 z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div >

                    </div >
                )
            }

            {
                isFaqPanelOpen && (
                    <div
                        className='rounded-md absolute mt-5 overflow-hidden'
                        style={{
                            width: `${panelWidth}px`,
                            height: '80%',
                            background: '#fff',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            bottom: marginBottom + 70 + 'px',
                            right: `${marginRight + 10}px`,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {/* header */}
                        <div
                            className='flex w-full h-16 overflow-hidden items-center gap-5'
                            style={{
                                background: colorTheme,
                                paddingLeft: '25px'
                            }}
                        >
                            <div
                                onClick={() => {
                                    setHover(false)
                                    setIsPanelOpen(true)
                                    setIsChatPanelOpen(false)
                                    setIsFaqPanelOpen(false)
                                }
                                }
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: hover ? color2 : colorTheme, // Replace 'color1' with the actual color value
                                }}
                                className='p-2 rounded-md '
                            >
                                <ChevronLeft
                                    className='text-white-1'
                                    width={25}
                                    height={25}
                                />
                            </div>


                            <div>
                                <p className='font-bold text-white-1 text-16'>Help & Support</p>
                            </div>



                        </div>
                        {/* main section */}
                        <section >
                            {/* header div */}
                            <div className='px-4 py-2'>
                                <p className='font-semibold text-gray-600 text-16 p-2'> {faq ? faq.length : "Many"} Collection</p>
                            </div>
                            <Separator />
                            <div>
                                {
                                    faq && faq.map((faq: any, index: number) => (
                                        <div onClick={() => setActiveFaqIndex(index)} className='flex justify-between items-center  hover:bg-gray-200 px-4 py-2 transition-all cursor-pointer'>
                                            <div className='flex flex-col gap-1'>
                                                <p className='font-semibold text-black underline text-16'>{faq.header}</p>
                                                <p className='font-light text-gray-900'>{faq.preview}</p>
                                                <p className='text-gray-600 font-light text-14'>{faq.qna.length + " Articles" || ""}</p>
                                            </div>
                                            <div>
                                                <ChevronRight />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </section>
                    </div>
                )
            }



            {
                activeFaqIndex > -1 && (
                    <div
                        className='rounded-md absolute mt-5 overflow-hidden'
                        style={{
                            width: `${panelWidth}px`,
                            height: '80%',
                            background: '#fff',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            bottom: marginBottom + 70 + 'px',
                            right: `${marginRight + 10}px`,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div
                            className='flex w-full h-16 overflow-hidden items-center gap-5'
                            style={{
                                background: colorTheme,
                                paddingLeft: '25px'
                            }}
                        >
                            <div
                                onClick={() => {
                                    setActiveFaqIndex(-1)
                                    setHover(false)
                                    setIsPanelOpen(true)
                                    setIsChatPanelOpen(false)
                                    setIsFaqPanelOpen(true)
                                }
                                }
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: hover ? color2 : colorTheme, // Replace 'color1' with the actual color value
                                }}
                                className='p-2 rounded-md '
                            >
                                <ChevronLeft
                                    className='text-white-1'
                                    width={25}
                                    height={25}
                                />
                            </div>


                            <div>
                                <p className='font-bold text-white-1 text-16'>{faq[activeFaqIndex].header}</p>
                            </div>



                        </div>
                        <div className='flex flex-col h-full w-full'>
                            <ScrollArea className='w-full h-full'>
                                <Accordion type="single" collapsible className='p-4'>
                                    <div>

                                        {
                                            faq[activeFaqIndex].qna.map((qna: any) => (
                                                <AccordionItem value={qna.question}>
                                                    <AccordionTrigger>{qna.question}</AccordionTrigger>
                                                    <AccordionContent >
                                                        <div dangerouslySetInnerHTML={{ __html: qna.wholeAnswer }}></div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))
                                        }
                                    </div>
                                </Accordion>
                            </ScrollArea>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
function addLineBreaks(text: string): string {

    return `<p>${text.replace(/[?!]/g, match => match + "<br/>")}</p>`;
}
function generateLighterShades(color: string, count: number): string[] {
    console.log(color, count, "is pipeline");

    const shades: string[] = [];
    const baseColor = color.replace("#", "");
    const r = parseInt(baseColor.substr(0, 2), 16);
    const g = parseInt(baseColor.substr(2, 2), 16);
    const b = parseInt(baseColor.substr(4, 2), 16);

    for (let i = 1; i <= count; i++) {
        const ratio = i / (count + 1);
        const newR = Math.round(r + (255 - r) * ratio);
        const newG = Math.round(g + (255 - g) * ratio);
        const newB = Math.round(b + (255 - b) * ratio);
        const newColor = `#${newR.toString(16)}${newG.toString(16)}${newB.toString(16)}`;
        shades.push(newColor);
    }

    return shades;
}


export default ReactChatbotUi