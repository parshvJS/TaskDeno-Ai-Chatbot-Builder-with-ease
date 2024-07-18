import { chatbotGenerator } from "@/chat-template/ChatbotUi";
import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import ChatbotUi from "@/models/chatbotUi.models";
import Project from "@/models/project.models";

export async function GET(request: Request) {
    await dbConnect();
    try {

        const { searchParams } = new URL(request.url);
        const chatbotId = searchParams.get("chatbotId")
        console.log(chatbotId, "chatbotId");
        if (!chatbotId) {
            return Response.json(new apiError(400, "Provide Relevant Information!"), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const project = await Project.find({
            embedId: chatbotId
        })
        const chatbotui = await ChatbotUi.find({
            projectId: project[0]._id
        })
        console.log(project, "Project id");

        if (!project || !chatbotui) {
            return Response.json(new apiError(404, "Project Is Deleted Or Not exist!"), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }


        const { htmlContents } = chatbotGenerator(chatbotui[0]);

        return new Response(htmlContents.htmlContents, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
            },
        });
    } catch (error: any) {
        return Response.json(new apiError(400, "Can't get you UI", error.message), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    ``

}
