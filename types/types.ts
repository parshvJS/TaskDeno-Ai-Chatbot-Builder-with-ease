import { Dispatch, SetStateAction } from "react";

export interface IChatbotDataType{
    project_id: string;
    project_name: string;
    variables:never[],
    nodes :never[],
    edges :never[], 
    aiPrompts:never[]
}

export interface IChatbotType {
    project: IChatbotDataType;
    setProject: Dispatch<SetStateAction<IChatbotDataType>>;
    isStoredInDb: boolean;
    setIsStoredInDb: Dispatch<SetStateAction<boolean>>;
    isSyncLoading: boolean;
    setIsSyncLoading: Dispatch<SetStateAction<boolean>>;
    getPreviousData: (projectId: string) => void;
    syncing: boolean,
    setSyncing: Dispatch<SetStateAction<boolean>>,
    storeChangesInDb: () => void,
  }