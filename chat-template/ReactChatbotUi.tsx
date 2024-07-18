'use client'
import { ArrowLeft, ArrowRight, ChevronLeft, MessageCircle, X } from 'lucide-react';
import { set } from 'mongoose';
import Image from 'next/image';
import { relative } from 'path';
import React, { useState } from 'react'

function ReactChatbotUi(project: any) {
    const cookedProject = project.project
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

    return (
        <div className='w-full h-full flex justify-end items-end transition-all'>
            <div
                onClick={() => {
                    setIsPanelOpen(!isPanelOpen)
                    setIsChatPanelOpen(false)
                    setIsFaqPanelOpen(false)
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
                    isPanelOpen ? (<X />) :
                        (

                            < Image
                                src={userChatbotLogo}
                                alt="Picture of the author"
                                width={25}
                                height={25}
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
                            bottom: '100px',
                            right: `${marginRight + 10}px`,
                            transition: 'all 0.3s ease',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <section className='flex flex-col gap-2'>
                            <div>
                                <Image
                                    src={userChatbotImage}
                                    alt="Picture of the author"
                                    width={170}
                                    height={80}
                                />
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
                                className='flex justify-between items-center slim-border w-full h-64 p-4 hover:bg-gray-200 transition-all cursor-pointer'>
                                <div>
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
                                className='flex justify-between items-center slim-border w-full h-64 p-4 hover:bg-gray-200 transition-all cursor-pointer'>
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

                        className='rounded-md absolute mt-5 overflow-hidden'
                        style={{
                            width: `${panelWidth}px`,
                            height: '80%',
                            background: '#fff',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            bottom: '100px',
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
                                    backgroundColor: hover ? color1 : colorTheme, // Replace 'color1' with the actual color value
                                }}
                                className='p-2 rounded-md '
                            >
                                <ChevronLeft
                                    width={25}
                                    height={25}
                                />
                            </div>


                            <div>
                                <p className='font-bold text-black text-16'>{userChatbotName}</p>
                            </div>
                        </div>

                        {/* chat messages preview */}
                        <div className='p-4 w-full flex flex-col justify-between items-center'>
                            <Image
                                src={'/icons/brainPuzzel.svg'}
                                width={180}
                                height={80}
                                alt='start message'
                                className='my-5 mb-5'
                            />

                            <hr className="my-4 w-full border-black" />

                            <div className='w-full h-96 overflow-y-auto'>
                                <div className='flex flex-col gap-1'>

                                    {/* request */}
                                    <div className='flex gap-2 font-medium'>
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
                                            Hello! How can I assist you today?

                                        </div>
                                    </div>

                                    {/*response  */}
                                    <div className='flex justify-end gap-2 font-medium'>
                                        <div
                                            className="w-fit h-fit py-3 px-4 "
                                            style={{
                                                borderTopLeftRadius: '15px',
                                                borderTopRightRadius: '5px',
                                                borderBottomRightRadius: '15px',
                                                borderBottomLeftRadius: '15px',
                                                backgroundColor: '#9C9E9E',
                                            }}
                                        >
                                            Please Provide Me My Shipping Details!
                                        </div>
                                    </div>



                                    {/* request */}
                                    <div className='flex gap-2'>
                                        <div
                                            className="w-fit h-fit py-3 px-4 font-medium"
                                            style={{
                                                borderTopLeftRadius: '5px',
                                                borderTopRightRadius: '15px',
                                                borderBottomRightRadius: '15px',
                                                borderBottomLeftRadius: '15px',
                                                backgroundColor: '#D9DADA',
                                            }}
                                        >
                                            Hello! Your Order Have Been Successfully Placed!
                                            Order Will Be Shipped To Your Address In 3-5 Business Days!
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>



                    </div>
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
                            bottom: '100px',
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
                                    backgroundColor: hover ? color1 : colorTheme, // Replace 'color1' with the actual color value
                                }}
                                className='p-2 rounded-md '
                            >
                                <ChevronLeft
                                    width={25}
                                    height={25}
                                />
                            </div>


                            <div>
                                <p className='font-bold text-black text-16'>Help & Support</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
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