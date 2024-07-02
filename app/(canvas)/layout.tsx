"use client"


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    return (
    
            <div className="flex flex-col min-h-screen overflow-hidden min-w-screen">
                {children}
            </div>
  
    )
}
