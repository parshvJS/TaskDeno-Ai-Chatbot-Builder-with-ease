import { createContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// Define types for the dashboard data
interface DashboardData {
  isUserAuth: boolean;
  scriptTag: string;
  isScriptTagAvailable: boolean;
}

// Define types for the context value
interface DashdataContextType {
  dashdata: DashboardData;
  setDashdata: (value: DashboardData) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  activeProjectId: string;
  setActiveProjectId: (value: string) => void;
  isScriptTagGenerating: boolean;
  setIsScriptTagGenerating: (value: boolean) => void;
}

// Initialize context with default values
const INITIAL_DASHBOARD_DATA: DashboardData = {
  isUserAuth: false,
  scriptTag: "",
  isScriptTagAvailable: false
};

const INITIAL_DASHBOARD_CONTEXT: DashdataContextType = {
  dashdata: INITIAL_DASHBOARD_DATA,
  setDashdata: () => {},
  loading: false,
  setLoading: () => {},
  activeProjectId: "",
  setActiveProjectId: () => {},
  isScriptTagGenerating: false,
  setIsScriptTagGenerating: () => {}
};

const DashdataContext = createContext<DashdataContextType>(INITIAL_DASHBOARD_CONTEXT);

interface DashdataProviderProps {
  children: ReactNode;
}

export const DashdataProvider: React.FC<DashdataProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { userId, isLoaded } = useAuth();
  const [dashdata, setDashdata] = useState<DashboardData>(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [isScriptTagGenerating, setIsScriptTagGenerating] = useState<boolean>(false);

  // store data when loaded
  useEffect(() => {
    if (activeProjectId) {
      fetchData();
    }
  }, [activeProjectId, isLoaded]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isLoaded) {
        const { data } = await axios.post("/api/getInnerDashboardData", {
          userId,
          activeProjectId
        });

        if (!data) {
          toast({
            title: "Can't Find Your Data",
            description: "No data available",
            variant: "destructive"
          });
          return;
        }

        setDashdata({
          isUserAuth: data.isUserAuth,
          scriptTag: data?.data?.scriptTag || "",
          isScriptTagAvailable: data?.data?.isScriptTagAvailable || false
        });
      }
    } catch (error:any) {
      toast({
        title: "Can't Find Your Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchScriptTagData() {
      if (!dashdata.isScriptTagAvailable) {
        await generateScriptTag();
      }
    }
    fetchScriptTagData();
  }, [dashdata]);

  const generateScriptTag = async () => {
    setIsScriptTagGenerating(true);
    try {
      const { data } = await axios.post("/api/generateScriptTag", {
        userId,
        projectId: activeProjectId
      });

      setDashdata({
        ...dashdata,
        scriptTag: data.scriptTag,
        isScriptTagAvailable: true
      });
    } catch (error:any) {
      toast({
        title: "Can't Generate Script Tag",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsScriptTagGenerating(false);
    }
  };

  const values = {
    dashdata,
    setDashdata,
    loading,
    setLoading,
    activeProjectId,
    setActiveProjectId,
    isScriptTagGenerating,
    setIsScriptTagGenerating
  };

  return (
    <DashdataContext.Provider value={values}>
      {children}
    </DashdataContext.Provider>
  );
};

export default DashdataContext;
