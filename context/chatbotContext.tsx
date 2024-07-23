import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export const INITIAL_PROJECT_DATA = {
    project_id: "",
    project_name: "",
    variables: [],
    nodes: [{
        id: 'start101',
        type: 'startNode',
        data: { label: 'Start' },
        position: {
            x: 518,
            y: 246
        },
    }],
    edges: [],
    aiPrompts: [],
    aiModel: "GPT-3.5"
};

export const INITIAL_PROJECT = {
    project: INITIAL_PROJECT_DATA,
    setProject: (project: any) => { },
    isStoredInDb: false,
    setIsStoredInDb: (value: boolean) => { },
    isSyncLoading: false,
    setIsSyncLoading: (value: boolean) => { },
    syncing: false,
    setSyncing: (value: boolean) => { },
    getPreviousData: async (projectId: string) => { },
    storeChangesInDb: async () => { },
};

const projectContext = createContext(INITIAL_PROJECT);

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
        } fetchData();
    }, [project])

    async function storeChangesInDb() {
        setSyncing(true);


        try {
            console.log("project is going to db", project);

            const { data } = await axios.post('/api/syncData', {
                project: project,
                projectId: project.project_id
            });
            if (data.success === false || data.statusCode > 200) {
                toast({
                    title: data.message,
                    variant: "destructive"
                });
            }


            if (data.success === true) {
                setIsStoredInDb(true);
            }
        } catch (error: any) {
            toast({
                title: error.message,
                variant: "destructive"
            });
            throw new Error(error.message);
        } finally {
            setSyncing(false);
        }
    }

    const getPreviousData = async (projectId: string) => {
        try {
            setIsSyncLoading(true);
            const response = await axios.post(`/api/getProjectData`, {
                projectId: projectId
            });
            const data = response.data.data;
            setProject({
                project_id: data._id,
                project_name: data.name,
                nodes: data.nodes,
                edges: data.edges,
                variables: data.variables,
                aiPrompts: data.aiPrompts,
                aiModel: data.aiModel
            });
            setIsStoredInDb(true);

            return data
        } catch (error) {

        } finally {
            setIsSyncLoading(false);
        }
    };


    const values = {
        project,
        setProject,
        isStoredInDb,
        setIsStoredInDb,
        isSyncLoading,
        setIsSyncLoading,
        getPreviousData,
        storeChangesInDb,
        syncing,
        setSyncing
    };

    return (
        <projectContext.Provider value={values}>
            {children}
        </projectContext.Provider>
    );
};

export default projectContext;
