import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { Document } from "mongoose";
import { Lead } from "taskdeno-mongoose-model";

export interface ILead extends Document {
    projectId: string;
    leadsField: Array<string>;
    leadsData: Array<Object>;
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { projectId, paginationNum = 1, paginationSize = 15 } = await req.json()
        if (!projectId) {
            return Response.json(
                new apiError(400, "Please Provide Projectid for this operation")
            )
        }
        const skip = (paginationNum - 1) * paginationSize;

        const leads = await Lead.findOne({ projectId: projectId });
        if (!leads) {
            return Response.json(
                new apiError(400, "Can't find leads of provided project id")
            )
        }
        if (leads.leadsData.length == 0) {
            return Response.json(
                new apiResponse(201, leads, "No Leads Data Found")
            )
        }
        const totalLeads = leads.leadsData.length;
        const leadsData = leads.leadsData.slice(skip, skip + paginationSize);
        const cookedLeads = {
            data: {
                leadsData,
                leadsField: leads.leadsField
            },
            pagination: {
                totalLeads,
                totalPages: Math.ceil(totalLeads / paginationSize),
                currentPage: paginationNum,
                pageSize: parseInt(paginationSize),
            }
        }
        return Response.json(
            new apiResponse(200, cookedLeads, "Fetched Leads Data Successfully")
        )
    } catch (error: any) {
        return Response.json(
            new apiError(400, "Can't Fetch Leads Data")
        )
    }
}