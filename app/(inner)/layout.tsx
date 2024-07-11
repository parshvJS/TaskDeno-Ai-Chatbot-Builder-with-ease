import LeftSideBar from "@/components/LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import MobileNav from "@/components/MobileNav";
import { navItems } from "@/constants/constants";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <div className="relative flex flex-col w">
                <main className="relative flex">
                    <LeftSideBar
                        navArray={navItems}
                    />
                    <section className="flex  flex-col min-h-screen w-[90%] ">
                        <div className="mx-10 my-5 flex w-full max-w-5xl flex-col ">
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
