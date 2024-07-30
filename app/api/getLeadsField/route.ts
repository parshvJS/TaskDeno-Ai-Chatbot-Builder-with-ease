import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { Project } from "taskdeno-mongoose-model";

export async function POST(req: Request) {
    await dbConnect();

    try {
        console.log("hello");
        
        const { projectId } = await req.json();
        if (!projectId) {
            return Response.json(
                new apiError(400, "Please Provide Project id to fetch all leads fields")
            )
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return Response.json(
                new apiError(400, "Project With corresponsing id not found!")
            )
        }
        console.log(project, '0111120202033o2375248753485734857934857938475983475')
        const leadField: Array<string> = project.leadsField;
        const variables: Array<string> = project.variables;
        const response: Array<{ field: string, isSelected: boolean }> = [];

        // to check if what elemenets are aleady avaiable in leads field and what not
        variables.forEach((vari: string) => {
            if (leadField.includes(vari)) {
                const newElem = {
                    field: vari,
                    isSelected: true
                }
                response.push(newElem)
            }
            else {
                const newElem = {
                    field: vari,
                    isSelected: false
                }
                response.push(newElem)
            }
        });

        return Response.json(
            new apiResponse(200, response, "Lead fields fetched successfully!")
        )

    } catch (error: any) {
        return Response.json(
            new apiError(400, error.message)
        )

    }
}