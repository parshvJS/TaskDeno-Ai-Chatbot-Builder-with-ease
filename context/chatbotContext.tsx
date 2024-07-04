import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
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
        console.log("i am project changed in context", project);
        async function fetchData() {
            console.log("changed project and storing in database", project);

            if(project.project_id && project){
                console.log("got id going to databas");
                
                await storeChangesInDb();
            }
        } fetchData();
    }, [project])



    // useEffect(() => {
    //     const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    //     if (storedProjects.length > 0) {
    //         setProject((prevProject) => ({
    //             ...prevProject,
    //             project_id: storedProjects[0],
    //         }));
    //     }
    //     console.log("Initial load - Project:", project);
    // }, []);

    // useEffect(() => {
    //     if (project.project_id && !localStorage.getItem("projects")) {
    //         localStorage.setItem("projects", JSON.stringify([project.project_id]));
    //     } else if (project.project_id) {
    //         const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    //         if (!storedProjects.includes(project.project_id)) {
    //             const updatedProjects = [...storedProjects, project.project_id];
    //             localStorage.setItem("projects", JSON.stringify(updatedProjects));
    //         }
    //     }
    //     console.log("Project ID updated - Project:", project);
    // }, [project.project_id]);

    async function storeChangesInDb() {
        setSyncing(true);
        console.log(project, "is getting context added");

        try {
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
            console.log("i am in context", data);

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
            });
            setIsStoredInDb(true);
            console.log("Data fetched from server - Project:", data);
            return data
        } catch (error) {
            console.error("Error fetching project data:", error);
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
