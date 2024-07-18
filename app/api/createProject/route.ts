import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import ChatbotUi from "@/models/chatbotUi.models";
import Project from "@/models/project.models";

// when user want to create new chatbot this api will establish new project 
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, userId } = await request.json();

        if (!name || !userId) {
            return Response.json(new apiError(400, "Provide Relevant Information!"), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newProject = new Project({
            name,
            userId,
        });
        const res = await newProject.save();

        const newChatbotUi = new ChatbotUi({
            projectId: res._id
        });
        const chatbotUiRes = await newChatbotUi.save();

        if (!res || !chatbotUiRes) {
            return Response.json(new apiError(400, "Project not created"), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return Response.json(new apiResponse(200, res, "Project Created"), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return Response.json(new apiError(400, "Project Not Created", error.message), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
