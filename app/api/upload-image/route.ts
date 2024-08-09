import { apiResponse } from "@/lib/apiResponse";
import { dbConnect } from "@/lib/dbConnect";
import { uploadOnCloudinary } from "@/lib/uploadOnCloudinary";
import { File } from "buffer";
import { unlinkSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    console.log("Received POST request");
    const formData = await req.formData();
    console.log("Form data received:", formData);

    const files: File[] = [];
    console.log("Extracting files from form data...");
    for (const value of formData.values()) {
      if (value instanceof File) {
        console.log("Found a file:", value.name);
        files.push(value);
      }
    }

    if (files.length <= 0) {
      console.log("Less than 2 files found");
      return NextResponse.json({
        success: false,
        message: "Upload At least 1 Files !",
      });
    }

    console.log("Processing", files.length, "files...");
    const file = files[0];
    console.log("Processing file:", file.name);

    // Convert the ArrayBuffer to a Uint8Array, then to a Buffer
    const byteArray = await file.arrayBuffer();
    const buffer = Buffer.from(byteArray) as unknown as ArrayBufferView; // This should be correct as Buffer accepts ArrayBuffer

    const rootPath = process.cwd();
    const publicPath = join(rootPath, 'public', file.name);

    console.log("Writing file to public folder...");
    await new Promise((resolve, reject) => {
      writeFile(publicPath, buffer, (err) => {
        if (err) {
          console.error("Error writing file:", file.name, err);
          reject(err);
        } else {
          console.log(`File '${file.name}' uploaded to public folder.`);
          resolve('success');
        }
      });
    });
    console.log("Uploading to Cloudinary...");
    const cloudinaryUrl = await uploadOnCloudinary(publicPath);
    unlinkSync(publicPath);
    return Response.json(new apiResponse(200, cloudinaryUrl, "File Uploaded Successfully !"));
  }
  catch {
    return NextResponse.json({
      success: false,
      message: "Error in Uploading File !"
    }, { status: 400 });
  }
}