'use client'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
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
        userChatbotName,   //chat panel name 
        userChatbotImage, //home panel logo
        userChatbotLogo,//trigger button logo
        borderRadius
    } = cookedProject;
    const lighterShades = generateLighterShades(colorTheme, 3);
    const [color1, color2, color3] = lighterShades;
    console.log(`w-[${panelWidth}px] h-[80%] bg-gradient-to-b from-[${color1}] via-[${color2}] to-[${color3}] rounded-md`, "is here");


    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)

    return (
        <div className='w-full h-full p-4 bg-orange-800'>
            <div>
                <Image
                src={userChatbotLogo}
                width={60}
                height={60}
                alt="logo1"
                />
                sdfsdf
            </div>
        </div>
    )
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