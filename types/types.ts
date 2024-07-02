import { Dispatch, SetStateAction } from "react";

export interface IChatbotDataType{
    project_id: string;
    project_name: string;
    variables:never[],
    nodes :never[],
    edges :never[], 
    node_content:never[],
}

export interface IChatbotType {
    project: IChatbotDataType;
    setProject: Dispatch<SetStateAction<IChatbotDataType>>;
    isStoredInDb: boolean;
    setIsStoredInDb: Dispatch<SetStateAction<boolean>>;
    isSyncLoading: boolean;
    setIsSyncLoading: Dispatch<SetStateAction<boolean>>;
    getPreviousData: (projectId: string) => void;
    debounceSync:Dispatch<SetStateAction<IChatbotDataType>>
  }