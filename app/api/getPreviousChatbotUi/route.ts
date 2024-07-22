import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import ChatbotUi from "@/models/chatbotUi.models";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { projectId } = await req.json();

        const res = await ChatbotUi.find({
            projectId: projectId
        }).select("-projectId");

        const cookedRes = res[0];

        if (!res) {
            return Response.json(new apiResponse(403, null, "Can't fetch Data !"))
        }
        console.log("i am chatbotUi", cookedRes,"-----------------------");
        
        return Response.json(new apiResponse(200, cookedRes, "successfully found data !"))


    } catch (error: any) {
        return Response.json(new apiResponse(400, null, error.message))
    }
}