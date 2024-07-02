import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { IChatbotType } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";

export const INITIAL_PROJECT_DATA = {
    project_id: "",
    project_name: "",
    variables: [],
    nodes: [],
    edges: [],
    aiPrompts: [],
};

export const INITIAL_PROJECT = {
    project: INITIAL_PROJECT_DATA,
    setProject: () => { },
    isStoredInDb: false,
    setIsStoredInDb: () => { },
    isSyncLoading: false,
    setIsSyncLoading: () => { },
    syncing: false,
    setSyncing: () => { },
    getPreviousData: (projectId: string) => { },
    storeChangesInDb: () => { },
};

const projectContext = createContext<IChatbotType>(INITIAL_PROJECT);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast()

    const [project, setProject] = useState(INITIAL_PROJECT_DATA);
    const [isStoredInDb, setIsStoredInDb] = useState(false);
    const [isSyncLoading, setIsSyncLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);


    useEffect(() => {
        // Load project ID from local storage on component mount
        const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        if (storedProjects.length > 0) {
            setProject((prevProject) => ({
                ...prevProject,
                project_id: storedProjects[0], // Load the first project ID for now
            }));
        }
    }, []);

    useEffect(() => {
        // Save project IDs to local storage whenever it changes
        if (project.project_id && !localStorage.getItem("projects")) {
            localStorage.setItem("projects", JSON.stringify([project.project_id]));
        } else if (project.project_id) {
            const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
            if (!storedProjects.includes(project.project_id)) {
                const updatedProjects = [...storedProjects, project.project_id];
                localStorage.setItem("projects", JSON.stringify(updatedProjects));
            }
        }
    }, [project.project_id]);

    // to sync changes to database
    async function storeChangesInDb() {
        setSyncing(true)
        console.log("processing sync");

        if (isStoredInDb === true) {
            return;
        }
        try {
            const { data } = await axios.post('/api/syncData', {
                project: project,
                projectId: project.project_id
            })
            console.log("data is", data);

            if (data.success === false || data.statusCode > 200) {
                toast({
                    title: data.message,
                    variant: "destructive"
                })
            }
            if (data.success === true) {
                setIsStoredInDb(true);
            }
        } catch (error: any) {

            toast({
                title: error.message,
                variant: "destructive"
            })
            throw new Error(error.message);
        } finally {
            setSyncing(false)
        }
    }
    //get previous data in initital loading 
    const getPreviousData = useCallback(async (projectId: string) => {
        try {
            setIsSyncLoading(true);
            const response = await axios.post(`/api/getProjectData`, {
                projectId: projectId
            });

            const data = response.data.data;
            console.log(data, "data", response, "response");

            setProject({
                project_id: data?._id,
                project_name: data?.name,
                nodes: data?.nodes,
                edges: data?.edges,
                variables: data?.variables,
                aiPrompts: data?.aiPrompts,
            });
            setIsStoredInDb(true);
        } catch (error) {
            console.error("Error fetching project data:", error);
        } finally {
            setIsSyncLoading(false);
        }
    }, []);

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
    }
    return (
        <projectContext.Provider
            value={values}
        >
            {children}
        </projectContext.Provider>
    );
};

export default projectContext;
