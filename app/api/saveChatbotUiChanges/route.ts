import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import ChatbotUi from "@/models/chatbotUi.models";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const chatbotUi = await req.json();
        // const {
        //     panelWidth,
        //     starterMessage,
        //     colorTheme,
        //     marginBottom,
        //     marginRight,
        //     userChatbotName,
        //     userChatbotImage,
        //     userChatbotLogo,
        //     borderRadius,
        //     welcomeText,
        //     faq,
        //     contact
        // } = chatbotUi;
        
        const chatbotUiData = await ChatbotUi.findOneAndUpdate({ projectId: chatbotUi.projectId }, chatbotUi, {new: true, upsert: true});
        return Response.json(new apiResponse(200,true,"Chatbot UI changes saved successfully"));
    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        })
    }
}