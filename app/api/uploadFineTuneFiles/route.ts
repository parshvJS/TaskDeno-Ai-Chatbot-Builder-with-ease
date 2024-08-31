import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { uploadOnCloudinary } from "@/lib/uploadOnCloudinary";
import axios from "axios";
import { unlinkSync, writeFile } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";
import { FineTune, Queue } from "taskdeno-mongoose-model";

export async function POST(req: Request) {
    await dbConnect();
    try {
        console.log("Received POST request");
        const formData = await req.formData();
        console.log("Form data received:", formData);
        if (formData.get('projectId') === null) {
            return NextResponse.json(
                new apiError(400, "Please Provide Project Id")
            );
        }

        const files: File[] = [];
        console.log("Extracting files from form data...");
        for (const value of formData.values()) {
            if (value instanceof File) {
                console.log("Found a file:", value.name);
                files.push(value);
            }
        }

        if (files.length <= 0) {
            console.log("Less than 1 file found");
            return NextResponse.json({
                success: false,
                message: "Upload at least 1 file!",
            });
        }

        const urls = [];
        for (const file of files) {
            try {
                const byteArray = await file.arrayBuffer();
                const buffer = Buffer.from(new Uint8Array(byteArray)); // Convert to Buffer with explicit Uint8Array conversion

                const rootPath = process.cwd();
                const publicPath = join(rootPath, 'public', file.name);

                console.log("Writing file to public folder...");
                await new Promise<void>((resolve, reject) => {
                    writeFile(publicPath, buffer as unknown as Uint8Array, (err) => {
                        if (err) {
                            console.error("Error writing file:", file.name, err);
                            reject(err);
                        } else {
                            console.log(`File '${file.name}' uploaded to public folder.`);
                            resolve();
                        }
                    });
                });

                console.log("Uploading to Cloudinary...");
                const cloudinaryUrl = await uploadOnCloudinary(publicPath);
                unlinkSync(publicPath);
                urls.push(cloudinaryUrl);
            } catch (error) {
                console.error("Error uploading file:", file.name, error);
            }
        }

        let newFineTuneDocument;
        if (urls.length !== 0) {
            newFineTuneDocument = new FineTune({
                projectId: formData.get('projectId'),
                fileUrl: urls,
                status: "pending",
                message: "Finetune Process In Queue"
            });
            await newFineTuneDocument.save();

            // Add to queue
            let queue = await Queue.findOne();
            console.log(queue, "is q1");

            if (!queue) {
                queue = await Queue.create({ queueList: [newFineTuneDocument._id] });
            } else {
                queue.queueList.push(newFineTuneDocument._id);
            }
            console.log(queue, "is q2");

            await queue.save();

            if (!newFineTuneDocument || !queue) {
                return NextResponse.json(new apiError(400, "Can't Save Fine Tune Document"));
            }
        }

        return NextResponse.json(new apiResponse(200, newFineTuneDocument, "File Uploaded Successfully!"));

    } catch (error: any) {
        return NextResponse.json(new apiError(400, error.message));
    }
}
