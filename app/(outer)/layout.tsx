'use client'
import LeftSideBar from "@/components/LeftSideBar";

import { Toaster } from "@/components/ui/toaster";
import MobileNav from "@/components/MobileNav";
import { outerNavItems } from "@/constants/constants";
import { useAuth } from "@clerk/nextjs";
import { LoaderPinwheel } from "lucide-react";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isLoaded, userId, sessionId } = useAuth()
    if(!isLoaded){
        return(
            <div>
                <LoaderPinwheel className="animate-spin"/>
                <p>Loading..</p>
            </div>
        )
    }
    return (
        <div className="relative flex flex-col">
            <main className="relative flex ">
            <LeftSideBar
                    userId={userId || ""}
                    navArray={outerNavItems}
                    isLogoutVisible={true}
                />
                
                <section className="flex  flex-col min-h-screen w-[90%] bg-[#F8F8F6]">
                    <div className="mx-10 my-5 flex w-full max-w-6xl flex-col ">
                        <div className="flex h-16 items-center justify-between md:hidden">
                            {/* <Image src="/icons/logo.svg" alt="logo" width={30} height={30} /> */}
                            <MobileNav />
                        </div>
                        <div className="flex flex-col h-screen ">
                            <Toaster/>
                            {children}
                        </div>
                    </div>
                    
                </section>
                {/* <RightSideBar /> */}
            </main>
        </div>
    );
}
