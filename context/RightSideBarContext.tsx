import React, { useState, ReactNode, createContext, Dispatch, SetStateAction, useEffect } from "react";

// Define the initial sidebar data structure
export const INITITAL_SIDEBAR_DATA = {
    activeNodeId: "",
    currentNode: {}
};

// Define the shape of the context type
interface SidebarContextType {
    sidebar: typeof INITITAL_SIDEBAR_DATA;
    setSidebar: Dispatch<SetStateAction<typeof INITITAL_SIDEBAR_DATA>>;
    isSidebarActive: boolean;
    setIsSidebarActive: Dispatch<SetStateAction<boolean>>;
}

// Create the initial context value
export const INITITAL_SIDEBAR: SidebarContextType = {
    sidebar: INITITAL_SIDEBAR_DATA,
    setSidebar: () => { },
    isSidebarActive: false,
    setIsSidebarActive: () => { }
};

// Create the context
const SidebarContext = createContext<SidebarContextType>(INITITAL_SIDEBAR);

export const RightSideBarProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [sidebar, setSidebar] = useState(INITITAL_SIDEBAR_DATA);

    const values = {
        isSidebarActive,
        setIsSidebarActive,
        sidebar,
        setSidebar
    };

    useEffect(()=>{
        console.log("side bar changed by someone",sidebar);
        
    },[sidebar])

    return (
        <SidebarContext.Provider value={values}>
            {children}
        </SidebarContext.Provider>
    );
}

export default SidebarContext;
