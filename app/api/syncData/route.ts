import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const {project,projectId} = await req.json();

        if(!project || !projectId){
            return Response.json({
                success: false,
                statusCode: 400,
                message: "Project and projectId are required",
                data: null
            })
        }
        console.log("Syncing in backend ",project,projectId);
        
        const projectData = await Project.findByIdAndUpdate(projectId, { project }, { new: true });
        if(!projectData){
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
        console.log(error.message)
        return Response.json({
            success: false,
            statusCode: 404,
            message: error.message,
            data: null
        })

    }
}