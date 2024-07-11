import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

const INITIAL_DASHBOARD_DATA = {
    isUserAuth: false,
    scriptTag: "",
    isScriptTagAvailable: false,
    marginBottom: 30,
    marginRight: 30,
    userChatbotName: "Task Deno | Firola",
    userChatbotImage: "https://res.cloudinary.com/dwhmpzqzq/image/upload/v1720679740/a7wafzvm4qthwpoegmh1.png",
};

const INITIAL_DASHBOARD_CONTEXT = {
    dashdata: INITIAL_DASHBOARD_DATA,
    setDashdata: (value: object) => { },
    loading: false,
    setLoading: (value: boolean) => { },
    activeProjectId: "",
    setActiveProjectId: (value: string) => { }
};

const DashdataContext = createContext(INITIAL_DASHBOARD_CONTEXT);

export const DashdataProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const { userId } = useAuth();
    const [dashdata, setDashdata] = useState(INITIAL_DASHBOARD_DATA);
    const [loading, setLoading] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState("")
    useEffect(() => {
        if (activeProjectId) {
            console.log("fifi");

            fetchData();
        }
    }, [activeProjectId])

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("context:no project is found", activeProjectId, "sdfsd");

            const { data } = await axios.post('/api/getInnerDashboardData', { userId, activeProjectId });
            console.log("i am dashboard Context" ,data);

            
            if (!data) {
                toast({
                    title: "Can't Find Your Data",
                    description: "No data available",
                    variant: "destructive",
                });
                return;
            }

            setDashdata({
                ...INITIAL_DASHBOARD_DATA,
                ...data,
                isUserAuth: data.isUserAuth,
            });
        } catch (error: any) {
            toast({
                title: "Can't Find Your Data",
                description: error.message,
                variant: "destructive",
            });
            throw new Error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const values = { dashdata, setDashdata, loading, setLoading, activeProjectId, setActiveProjectId }
    return (
        <DashdataContext.Provider value={values}>
            {children}
        </DashdataContext.Provider>
    );
};

export default DashdataContext
