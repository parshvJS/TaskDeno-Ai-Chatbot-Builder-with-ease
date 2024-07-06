import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";

export async function POST(req: Request) {
    await dbConnect();

    try {

        const { userId } = await req.json();
        if (!userId) {
            return Response.json({
                success: false,
                statusCode: 403,
                message: "Can't fetch Data !"
            })
        }

        const userProjectDoc = await Project.find({
            userId: userId
        }).select(["name","_id"])
        
        
        if (userProjectDoc.length === 0) {
            return Response.json({
                success: true,
                statusCode: 201,
                message: "successfully found data !",
                data: -1
            })
        }
        return Response.json({
            success: true,
            statusCode: 200,
            message: "successfully found data !",
            data: userProjectDoc
        })
    } catch (error) {
        
        return Response.json({
            success: false,
            statusCode: 403,
            message: "Can't fetch Data !"
        })

    }   
}