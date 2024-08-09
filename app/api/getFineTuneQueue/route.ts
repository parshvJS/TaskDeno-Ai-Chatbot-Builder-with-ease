import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { FineTune } from "taskdeno-mongoose-model";

export async function POST(req:Request){
    await dbConnect()
    try {
        const {projectId} = await req.json()
        if(!projectId){
            return Response.json(
                new apiError(400, "Please Provide Project Id")
            )
        }

        const fineTuneDoc = await FineTune.find({projectId})
        if(fineTuneDoc.length === 0){
            return Response.json(
                new apiError(404, "No Fine Tune Document Found")
            )
        }
        return Response.json(
            new apiResponse(200, fineTuneDoc, "Fine Tune Document Found")
        )
    } catch (error:any) {
        return Response.json(
            new apiError(400, error.message)
        )
        
    }
}