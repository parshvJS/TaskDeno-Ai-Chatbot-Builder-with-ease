"use client"

import { RightSideBarProvider } from "@/context/RightSideBarContext"
import { ReactFlowProvider } from "reactflow"


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <ReactFlowProvider>
                <div className="flex flex-col min-h-screen overflow-hidden min-w-screen">
                    {children}
                </div>
        </ReactFlowProvider>

    )
}
