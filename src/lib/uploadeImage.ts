import cloudinary from "@/lib/cloudinary";
import stream from "stream";

async function uploude(path: string, Image: File): Promise<string> {
    try {
        const subImageBuffer = await Image.arrayBuffer(); // Convert the File to ArrayBuffer
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(subImageBuffer)); // Convert ArrayBuffer to Buffer

        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: path, format: 'webp' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result); // Resolve with the result of the upload
                }
            );
            bufferStream.pipe(uploadStream); // Pipe the buffer stream to Cloudinary's upload stream
        });

        if (result && result.secure_url) {
            return result.secure_url; // Ensure result.secure_url exists before returning
        } else {
            throw new Error('Upload failed, no secure URL returned.');
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export default uploude;
