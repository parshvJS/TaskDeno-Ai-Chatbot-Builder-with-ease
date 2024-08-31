import { Dispatch, SetStateAction } from "react";



export interface IChatbotDataType{
  project_id: string;
  project_name: string;
  variables:any[],
  nodes :any[],
  edges :any[], 
  aiPrompts:any[],
  aiModel:string,
  isPublished:boolean
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

export type chatUserParams =  {
    chatbotId: string,
    userId: string
}

export type Lead = {
    field:string,
    isSelected:boolean
}

export interface ChatDocument extends Document {
  _id: string;
  chatbotId: string;
  instanceId: string;
  conversation: Array<{
    role: string;
    type?: string;
    content: string;
  }>;
  issueSolved: boolean;
  aiSummery: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  leadInfo: {
    age?: string;
    email?: string;
    location?: string;
    name?: string;
    contactNumber?: string;
  };
}