import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { ChatbotUi } from 'taskdeno-mongoose-model';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const chatbotUi = await req.json();
        // const {
        //     panelWidth,
        //     starterMessage,
        //     
        //     marginRight,colorTheme,
        //     marginBottom,
        //     userChatbotName,
        //     userChatbotImage,
        //     userChatbotLogo,
        //     borderRadius,
        //     welcomeText,
        //     faq,
        //     contact
        // } = chatbotUi;
        console.log("i am chatbotUi", chatbotUi);
        
        
        const chatbotUiData = await ChatbotUi.findOneAndUpdate({ projectId: chatbotUi.projectId }, chatbotUi, {new: true, upsert: true});
        return Response.json(new apiResponse(200,true,"Chatbot UI changes saved successfully"));
    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        })
    }
}