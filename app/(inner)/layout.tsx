'use client'
import LeftSideBar from "@/components/LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import MobileNav from "@/components/MobileNav";
import { navItems } from "@/constants/constants";
import { useContext } from "react";
import DashdataContext from "@/context/dashboardContext";
import { useAuth } from "@clerk/nextjs";
import { LoaderPinwheel } from "lucide-react";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { activeProjectId, loading, isScriptTagGenerating } = useContext(DashdataContext)
    const { userId } = useAuth()
    if (loading || isScriptTagGenerating) {
        return <div className='w-screen h-screen flex justify-center items-center flex-col'>
            <LoaderPinwheel width={30} height={30} className='animate-spin text-gray-600' />
            <p className='text-16  font-semibold text-gray-600'>Starting Chatbot Engine!</p>
        </div>
    }
    return (
        <div className="relative flex flex-col w">
            <main className="relative flex">
                <LeftSideBar
                    navArray={navItems}
                    projectId={activeProjectId}
                    userId={userId!}
                    isRedirectCustom={true}
                />
                <section className="flex flex-col h-screen w-full bg-white-1">
                    <div className="mx-10 my-5 flex w-[95%] flex-col ">
                        <div className="flex h-16 items-center justify-between md:hidden">
                            {/* <Image src="/icons/logo.svg" alt="logo" width={30} height={30} /> */}
                            <MobileNav />
                        </div>
                        <div className="flex flex-col h-screen ">
                            <Toaster />
                            {children}
                        </div>
                    </div>
                </section>
                {/* <RightSideBar /> */}
            </main>
        </div>
    );
}
