import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";

export async function POST(req:Request){
    await dbConnect();

    try {
        const {projectId} = await req.json();
        
        const res = await Project.findById(projectId)
        if(!res) { 
            return Response.json({
                success:false,
                statusCode:403,
                message:"Can't fetch Data !"
            })
        }
        
        
        return Response.json({
            success:true,
            statusCode:200,
            data:res,
            message:"successfully found data !"
        })
        
    } catch (error) {
        
        return Response.json({
            success:false,
            statusCode:404,
            message:"Can't fetch Data"
        })
        
    }
}