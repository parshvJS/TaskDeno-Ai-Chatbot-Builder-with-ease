import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { checkNodeData, clearNode, createExecutionMap } from "@/lib/createExecutionMap";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ExecutionProcess, Project } from 'taskdeno-mongoose-model'

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { nodes, edges, projectId } = await req.json();
        console.log("7 hre 1");
        if (!nodes || !edges || !projectId) {
            console.log("7 hre");
            return NextResponse.json(
                new apiError(404, "Provide Relevant information")
            );
        }
        if (nodes.length == 1 || edges.length == 0) {
            console.log("2342342342342342342344234224234234424");
            await Project.findByIdAndUpdate(projectId, {
                isPublished: false
            });
            return NextResponse.json(
                new apiError(404, "Please Create Executable Workflow")
            );
        }
        console.log("7 hre 2");
        const existingProcessDetails = await ExecutionProcess.findOne({
            projectId: projectId
        });


        console.log("7 hre 3");

        const executionMap = createExecutionMap(nodes, edges);

        let filteredNodes: [{}] = [];
        nodes?.forEach((node: any, index: number) => {
            if (index === 0) {
                filteredNodes.push({
                    flaged: false
                });
                return;
            }
            console.log(node, "pppppppp");

            filteredNodes.push(clearNode(node));
        });
        console.log("7 hre 4");
        var detailsSuccess;
        var project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                new apiError(400, "Current Project is not recogenized!")
            );
        }
        if (existingProcessDetails) {
            console.log("7 hre 5 ");
            const detailsSuccess = await ExecutionProcess.findOneAndUpdate({
                projectId: projectId
            }, {
                projectId: projectId,
                refinedNodes: filteredNodes,
                executionMap: executionMap,
                variable: project.variables,
                aiPrompt: project.aiPrompts,
                aiModel: project.aiModel
            });
            console.log("detailsSuccess after findOneAndUpdate:", detailsSuccess);
            if (!detailsSuccess) {
                console.log("7 hre 8");
                await Project.findByIdAndUpdate(projectId, {
                    isPublished: false
                });
                return NextResponse.json(
                    new apiError(400, "can't perform instructions")
                );
            }
        } else {
            console.log("7 hre 6");
            detailsSuccess = await ExecutionProcess.create({
                projectId: projectId,
                refinedNodes: filteredNodes,
                executionMap: executionMap,
                variable: project.variables,
                aiPrompt: project.aiPrompts,
                aiModel: project.aiModel
            });
            console.log("detailsSuccess after create:", detailsSuccess);
            if (!detailsSuccess) {
                console.log("7 hre 8");
                await Project.findByIdAndUpdate(projectId, {
                    isPublished: false
                });
                return NextResponse.json(
                    new apiError(400, "can't perform instructions")
                );
            }
        }
        console.log("7 hre 7");

        console.log("7 hre 9");

        project = await Project.findByIdAndUpdate(projectId, {
            isPublished: true
        });
        if (!project) {
            return NextResponse.json(
                new apiError(400, "Current Project is not recogenized!")
            );
        }
        return NextResponse.json(
            new apiResponse(200, detailsSuccess, "All Systems details are ready to Operate! Go To intagration page.")
        );
    } catch (error: any) {
        console.log(error)

        throw new Error(error.message)

    }
}