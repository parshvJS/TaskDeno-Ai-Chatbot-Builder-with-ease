import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";

export async function POST(req:Request){
    await dbConnect();

    try {
        const {projectId} = await req.json();
        console.log("projectId : ", projectId,typeof projectId);
        const res = await Project.findById(projectId)
        if(!res) { 
            return Response.json({
                success:false,
                statusCode:403,
                message:"Can't fetch Data !"
            })
        }
        console.log("refreshed Context : ",res );
        
        return Response.json({
            success:true,
            statusCode:200,
            data:res,
            message:"successfully found data !"
        })
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            statusCode:404,
            message:"Can't fetch Data"
        })
        
    }
}