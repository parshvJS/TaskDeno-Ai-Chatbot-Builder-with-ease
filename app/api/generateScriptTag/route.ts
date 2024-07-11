import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/project.models";
import generateUniqueId from "generate-unique-id";
// take uid ,project id
export async function POST(req: Request) {
    await dbConnect();

    try {
        const { userId, projectId } = await req.json();
        if (!userId || !projectId) {
            return Response.json({
                success: false,
                statusCode: 304,
                message: "User and project id is required !"
            })
        }

        const projectData = await Project.findById(projectId);

        if (!projectData) {
            return Response.json({
                success: false,
                statusCode: 404,
                message: "No Data Found !",
                data: null
            })
        }

        const uid = generateUniqueId({
            length: 16,
            useLetters: false
        })
        const scriptTemplate = `<script async data-id="${uid}" id="chatling-embed-script" type="text/javascript" src="${process.env.httpDomainName}/js/embed.js"></script>`;

        const newProjectData = await Project.findByIdAndUpdate(projectId, {
            scriptTag: scriptTemplate,
            scisScriptTagAvailable: true
        }, { new: true })

        if (!newProjectData) {
            return Response.json({
                success: false,
                statusCode: 500,
                message: "Can't Generate Script tag",
                data: null
            })
        }

        return Response.json({
            success: true,
            statusCode: 200,
            message: "successfully generated adn saved Script tag ",
            data: newProjectData,
            scriptTag: scriptTemplate
        })

    } catch (error: any) {
        return Response.json({
            success: false,
            statusCode: 500,
            message: error.message,
            data: null
        })
    }
}