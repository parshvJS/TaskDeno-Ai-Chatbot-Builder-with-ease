import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { project, projectId } = await req.json();

        if (!project || !projectId) {
            return Response.json({
                success: false,
                statusCode: 400,
                message: "Project and projectId are required",
                data: null
            })
        }
        
        // {
        //     "project_id": "6682adf7f38e56848fed930f",
        //     "project_name": "nikunjsheth",
        //     "nodes": [
        //         {
        //             "id": "input-3",
        //             "type": "chatbotCommand",
        //             "position": {
        //                 "x": 290,
        //                 "y": 246
        //             },
        //             "data": {
        //                 "label": "Custom Form"
        //             }
        //         },
        //         {
        //             "id": "input-4",
        //             "type": "chatbotCommand",
        //             "position": {
        //                 "x": 290,
        //                 "y": 246
        //             },
        //             "data": {
        //                 "label": "Number"
        //             }
        //         }
        //     ],
        //     "edges": [],
        //     "variables": [],
        //     "aiPrompts": []
        // }
        const projectData = await Project.findByIdAndUpdate(projectId,
            {
                nodes: project.nodes,
                edges: project.edges,
                variables: project.variables,
                aiPrompts: project.aiPrompts,
                aiModel: project.aiModel
            },
            { new: true });
        if (!projectData) {
            return Response.json({
                success: false,
                statusCode: 404,
                message: "Project not found",
                data: null
            })
        }

        return Response.json({
            success: true,
            statusCode: 200,
            message: "Project updated successfully",
            data: projectData
        })

    } catch (error: any) {
        
        return Response.json({
            success: false,
            statusCode: 404,
            message: error.message,
            data: null
        })

    }
}