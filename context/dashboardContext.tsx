import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

const INITIAL_DASHBOARD_DATA = {
    isUserAuth: false,
    scriptTag: "",
    isScriptTagAvailable: false,
};

const INITIAL_DASHBOARD_CONTEXT = {
    dashdata: INITIAL_DASHBOARD_DATA,
    setDashdata: (value: object) => { },
    loading: false,
    setLoading: (value: boolean) => { },
    activeProjectId: "",
    setActiveProjectId: (value: string) => { },
    isScriptTagGenerating: false,
    setIsScriptTagGenerating: (value: boolean) => { },
};

const DashdataContext = createContext(INITIAL_DASHBOARD_CONTEXT);

export const DashdataProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const { userId, isLoaded } = useAuth();
    const [dashdata, setDashdata] = useState(INITIAL_DASHBOARD_DATA);
    const [loading, setLoading] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState("")
    const [isScriptTagGenerating, setIsScriptTagGenerating] = useState(false)
    // store data when loaded
    useEffect(() => {
        if (!dashdata && activeProjectId) {
            fetchData()
        }
    }, [])

    useEffect(() => {
        if (activeProjectId) {
            console.log("fifi");
            fetchData();
        }
    }, [activeProjectId, isLoaded])

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("context:no project is found", activeProjectId, userId, "sdfsd");

            if (isLoaded) {
                var { data } = await axios.post('/api/getInnerDashboardData', { userId, activeProjectId });
            }
            else {
                return;
            }
            console.log("i am dashboard Context", data);


            if (!data) {
                toast({
                    title: "Can't Find Your Data",
                    description: "No data available",
                    variant: "destructive",
                });
                return;
            }
            console.log(data.data, "is here ----------------====");
            setDashdata({
                isUserAuth: data.isUserAuth,
                scriptTag: data?.data?.scriptTag || "",
                isScriptTagAvailable: data?.data?.isScriptTagAvailable || false,
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

    useEffect(() => {
        async function fetchScriptTagData() {
            if (!dashdata.isScriptTagAvailable) {
                await generateScriptTag()
            }
        }
        fetchScriptTagData();
    }, [dashdata])

    // async function template
    const generateScriptTag = async () => {
        setIsScriptTagGenerating(true)
        try {
            var { data } = await axios.post('/api/generateScriptTag', { userId, projectId: activeProjectId });
            console.log(data, "is here ----------------====");
            setDashdata({
                ...dashdata,
                scriptTag: data.scriptTag,
                isScriptTagAvailable: true,
            });
        } catch (error: any) {
            toast({
                title: "Can't Generate Script Tag",
                description: error.message,
                variant: "destructive",
            });
            throw new Error(error.message);
        } finally {
            setIsScriptTagGenerating(false)
        }
    };
    const values = { dashdata, setDashdata, loading, setLoading, activeProjectId, setActiveProjectId, isScriptTagGenerating }
    return (
        <DashdataContext.Provider value={values}>
            {children}
        </DashdataContext.Provider>
    );
};

export default DashdataContext
