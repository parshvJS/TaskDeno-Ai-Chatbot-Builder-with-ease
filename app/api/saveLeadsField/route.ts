import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { Project } from "taskdeno-mongoose-model";

export async function POST(req:Request){
    await dbConnect();

    try {
        const {projectId,leads} = await req.json()
        if(!projectId || !leads){
            return Response.json(
                new apiError(400,"Please Provide Projectid and leads array for this operation")
            )
        }
        
        const project = await Project.findByIdAndUpdate(projectId,{
            leadsField:leads
        }).select("variable leadsField")

        if(!project){
            return Response.json(
                new apiError(400,"Can't find project of provided project id")
            )
        }

        return Response.json(
            new apiResponse(200,project,"Saved leads field successfully")
        )
    } catch (error:any) {
        return Response.json(
            new apiError(400,"Can't Save changed leads field")
        )
        
    }
}