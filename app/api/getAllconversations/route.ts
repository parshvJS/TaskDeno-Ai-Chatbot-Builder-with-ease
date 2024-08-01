import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { ChatbotInstance } from "taskdeno-mongoose-model";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { projectId, paginationNum = 1, paginationSize = 15 } = await req.json()
        if (!projectId) {
            return Response.json(
                new apiError(400, "Please Provide Projectid for this operation")
            )
        }
        const skip = (paginationNum - 1) * paginationSize;


        const chatbotInstace = await ChatbotInstance.find({ chatbotId: projectId }).skip(skip).limit(paginationSize).select("-conversation");
        if (!chatbotInstace) {
            return Response.json(
                new apiError(400, "Can't Load Conversations")
            )
        }

        return Response.json(
            new apiResponse(200, chatbotInstace, "Conversations Loaded Successfully")
        );

    } catch (error: any) {
        return Response.json(
            new apiError(400, "Can't Load Conversations")
        )
    }
}