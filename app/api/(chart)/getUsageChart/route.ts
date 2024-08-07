import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { calculateAverageUserStay, countDocumentsByDate, getAverageChatLength, getChatUsagePerWeek, getTotalNumberOfConversations } from "@/lib/helper";
import { ChatbotInstance } from "taskdeno-mongoose-model";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { projectId } = await req.json();

        if (!projectId) {
            return Response.json(
                new apiError(400, "Please Provide Project Id")
            )
        }

        const projectInstances = await ChatbotInstance.find({ chatbotId: projectId });
        const graphData = countDocumentsByDate(projectInstances);
        const avgUsage = calculateAverageUserStay(projectInstances);
        const totalNumberOfConversation  = projectInstances.length || 0
        const totalNumberOfChat = getTotalNumberOfConversations(projectInstances) || 0;
        const avgChatLen = getAverageChatLength(projectInstances)
        const weekUsage = getChatUsagePerWeek(projectInstances)

        const analyticsData = {
            averageUserStay: {
                title: "Average User Stay",
                value: Math.ceil(avgUsage), // Replace avgUsage with the actual value
                unit: "Minutes"
            },
            totalNumberOfConversations: {
                title: "Total Number of Conversations",
                value: totalNumberOfConversation, // Replace with the actual value
                unit: "Conversations"
            },
            totalNumberOfChats: {
                title: "Total Number of Chats",
                value: totalNumberOfChat, // Replace with the actual value
                unit: "Chats"
            },
            averageChatLength: {
                title: "Average Chat Length",
                value: Math.ceil(avgChatLen), // Replace avgChatLen with the actual value
                unit: "Messages"
            },
            chatUsagePerWeek: {
                title: "Chat Usage Per Week",
                value: weekUsage, // Replace weekUsage with the actual value
                unit: "Chats"
            },
            chatUsagePerDay: {
                title: "Chat Usage Per Day",
                value: graphData, // Replace graphData with the actual value
                unit: "Chats"
            }
        };
        

        if (!projectInstances) {
            return Response.json(
                new apiError(400, "No Project Found")
            )
        }
        console.log(projectInstances, graphData, "projectInstances");

        return Response.json(
            new apiResponse(200, analyticsData)
        )
    } catch (error: any) {
        return Response.json(
            new apiError(400, error.message)
        )
    }
}