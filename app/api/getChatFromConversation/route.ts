import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { ChatbotInstance } from "taskdeno-mongoose-model";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { projectId, InstanceId } = await req.json()
        if (!projectId || !InstanceId) {
            return Response.json(
                new apiError(400, "Please Provide Projectid and instanceId for this operation")
            )
        }
        const chatbotInstace = await ChatbotInstance.findOne({ chatbotId: projectId, instanceId: InstanceId }).select("conversation aiSummery nickname leadInfo");
        if (!chatbotInstace) {
            return Response.json(
                new apiError(400, "Can't Load Conversation")
            )
        }


        return Response.json(
            new apiResponse(200, chatbotInstace, "Conversation Loaded Successfully")
        )
    } catch (error: any) {
        return Response.json(
            new apiError(400, "Can't Load Conversation")
        )
    }
}