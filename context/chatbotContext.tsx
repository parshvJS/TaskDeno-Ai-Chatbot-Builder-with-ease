import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// Define the types used in the project data
export interface INode {
  id: string;
  type: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface IChatbotDataType {
  project_id: string;
  project_name: string;
  variables: any[];
  nodes: INode[];
  edges: any[];
  aiPrompts: any[];
  aiModel: string;
  isPublished: boolean;
}

export const INITIAL_PROJECT_DATA: IChatbotDataType = {
  project_id: "",
  project_name: "",
  variables: [],
  nodes: [
    {
      id: "start101",
      type: "startNode",
      data: { label: "Start" },
      position: {
        x: 518,
        y: 246,
      },
    },
  ],
  edges: [],
  aiPrompts: [],
  aiModel: "gpt-3.5-turbo",
  isPublished: false,
};

interface IProjectContext {
  project: IChatbotDataType;
  setProject: React.Dispatch<React.SetStateAction<IChatbotDataType>> ;
  isStoredInDb: boolean;
  setIsStoredInDb: React.Dispatch<React.SetStateAction<boolean>>;
  isSyncLoading: boolean;
  setIsSyncLoading: React.Dispatch<React.SetStateAction<boolean>>;
  syncing: boolean;
  setSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  getPreviousData: (projectId: string) => Promise<IChatbotDataType>;
  storeChangesInDb: () => Promise<void>;
}

export const INITIAL_PROJECT: IProjectContext = {
  project: INITIAL_PROJECT_DATA,
  setProject: () => {},
  isStoredInDb: false,
  setIsStoredInDb: () => {},
  isSyncLoading: false,
  setIsSyncLoading: () => {},
  syncing: false,
  setSyncing: () => {},
  getPreviousData: async () => INITIAL_PROJECT_DATA,
  storeChangesInDb: async () => {},
};

const projectContext = createContext<IProjectContext>(INITIAL_PROJECT);

export const ProjectProvider = ({ children }: { children: any }) => {
  const { toast } = useToast();

  const [project, setProject] = useState(INITIAL_PROJECT_DATA);
  const [isStoredInDb, setIsStoredInDb] = useState(true);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (project.project_id && project) {
        await storeChangesInDb();
      }
    }
    fetchData();
  }, [project]);

  async function storeChangesInDb() {
    setSyncing(true);

    try {
      console.log("project is going to db", project);

      const { data } = await axios.post("/api/syncData", {
        project: project,
        projectId: project.project_id,
      });
      if (data.success === false || data.statusCode > 200) {
        toast({
          title: data.message,
          variant: "destructive",
        });
      }

      if (data.success === true) {
        setIsStoredInDb(true);
      }
    } catch (error: any) {
      toast({
        title: error.message,
        variant: "destructive",
      });
      throw new Error(error.message);
    } finally {
      setSyncing(false);
    }
  }

  const getPreviousData = async (
    projectId: string
  ): Promise<IChatbotDataType> => {
    try {
      setIsSyncLoading(true);
      const response = await axios.post(`/api/getProjectData`, {
        projectId: projectId,
      });
      const data = response.data.data;

      const projectData: IChatbotDataType = {
        project_id: data._id,
        project_name: data.name,
        nodes: data.nodes,
        edges: data.edges,
        variables: data.variables,
        aiPrompts: data.aiPrompts,
        aiModel: data.aiModel,
        isPublished: data.isPublished,
      };

      setProject(projectData);
      setIsStoredInDb(true);

      return projectData;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsSyncLoading(false);
    }
  };

  const values: IProjectContext = {
    project,
    setProject,
    isStoredInDb,
    setIsStoredInDb,
    isSyncLoading,
    setIsSyncLoading,
    getPreviousData,
    storeChangesInDb,
    syncing,
    setSyncing,
  };

  return (
    <projectContext.Provider value={values}>
      {children}
    </projectContext.Provider>
  );
};

export default projectContext;
