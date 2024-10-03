import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand"; // Import Brand model
import cloudinary from "@/lib/cloudinary";
import upload from "@/lib/multer"; // Adjust the path according to your project structure
import stream, { Readable } from "stream";
import { promisify } from "util";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

// Middleware function for uploading files
const uploadFiles = promisify(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ])
);

// Utility function to extract public ID from the image URL
const extractPublicId = (url: string): string => {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};
const fileToBuffer = async (file: File): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(Buffer.from(reader.result as ArrayBuffer));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// GET function to handle GET requests
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing brand ID" },
      { status: 400 }
    );
  }

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching brand" },
      { status: 500 }
    );
  }
}

