import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { userId, activeProjectId } = await req.json();
        console.log("i am data inner : ----------------------", userId, activeProjectId);

        const projectData = await Project.findById(activeProjectId).select("-nodes -egdes -aiPrompts")
        if (!projectData) {
            return Response.json({
                success: false,
                statusCode: 404,
                message: "no related Chatbot project found In system",
                data: null
            })
        }
        // security check
        if (projectData.userId != userId) {
            return Response.json({
                success: true,
                statusCode: 201,
                message: "You Are Not Owner Of This Project",
                data: null
            })
        }

        return Response.json({
            success: true,
            statusCode: 200,
            message: "Successfully found data!",
            data: projectData
        })

    } catch (error: any) {
        return Response.json({
            success: false,
            statusCode: 501,
            message: error.message,
            data: null
        })
    }
}