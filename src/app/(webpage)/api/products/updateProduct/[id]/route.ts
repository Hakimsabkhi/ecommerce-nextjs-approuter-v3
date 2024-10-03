import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

const extractPublicId = (url: string): string => {
    // Match the public ID from the URL
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  
    // If the format includes folders, split and get the last part
    if (matches) {
      return matches[1];
    }
  
    // Handle cases with folder paths
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  };
// Handler for PUT requests

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    await dbConnect();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'Consulter'&& user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    try {
      // Handle form data
      const formData = await req.formData();
      const name = formData.get('name')as string;
        const description = formData.get('description')as string;
        const ref = formData.get('ref')as string;
        const category = formData.get('category')as string;
        const brand = formData.get('brand')as string;
        const stock = formData.get('stock');
        const price = formData.get('price');
        const discount = formData.get('discount');
        const info = formData.get('info') as string | null;
        const color = formData.get('color') as string | null;
        const material = formData.get('material') as string | null;
        const weight = formData.get('weight') as string | null;
        const warranty = formData.get('warranty') as string | null;
        const dimensions = formData.get('dimensions') as string | null;
      
      const imageFile = formData.get("image") as File | null;
      const id = params.id; // Get ID from params
      const imageFiles: File[] = [];
      const entries = Array.from(formData.entries()); // Convert entries to an array
      for (let i = 0; i < entries.length; i++) {
        const file = formData.get(`images[${i}]`) as File;
        if (file) {
          imageFiles.push(file);
        }
      }
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
  
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
     
  
      // Initialize URLs with existing values
      let imageUrl = existingProduct.imageUrl;
      
  
      // Handle image file upload
      if (imageFile) {
        if (existingProduct.imageUrl) {
          const publicId = extractPublicId(existingProduct.imageUrl);
          if (publicId) {
            
            
            await cloudinary.uploader.destroy('Products/' + publicId);
          }
        }
  
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageStream = new stream.PassThrough();
        imageStream.end(imageBuffer);
  
        const { secure_url: newImageUrl } = await new Promise<any>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "Products" ,
                format: 'webp' 
              },
              (error, result) => {
                if (error)
                  return reject(
                    new Error(`Image upload failed: ${error.message}`)
                  );
                resolve(result);
              }
            );
            imageStream.pipe(uploadStream);
          }
        );
  
        imageUrl = newImageUrl; // Update imageUrl with the uploaded URL
      }
   // Upload images to Cloudinary
 const uploadedImages = await Promise.all(
  imageFiles.map(async (imageFile) => {
    const imageBuffer = await imageFile.arrayBuffer();
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(imageBuffer));

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'Products/images',
          format: 'webp',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    return result.secure_url; // Extract the secure_url
  })
);
      
      // Update category with new values
      // Ensure proper type conversions and default values
      if (name !== undefined && name !== null) {
        existingProduct.name = name;
      }
      if (description !== undefined && description !== null) {
        existingProduct.description = description;
      }
      if (ref !== undefined && ref !== null) {
        existingProduct.ref = ref;
      }
      if (category !== undefined && category !== null) {
        existingProduct.category = category;
      }
      if (brand !== undefined && brand !== null) {
        existingProduct.brand = brand;
      }
      if (stock !== undefined && stock !== null && !isNaN(Number(stock))) {
        existingProduct.stock = parseInt(stock as string, 10);
      }
      if (price !== undefined && price !== null && !isNaN(Number(price))) {
        existingProduct.price = parseFloat(price as string);
      }
      if (discount !== undefined && discount !== null && !isNaN(Number(discount))) {
        existingProduct.discount =  Number(discount);
      }
      if (info !== null){
         existingProduct.info = info;
      }
        if (color !== null){
          existingProduct.color = color;
        } 
        if (material !== null) {
          existingProduct.material = material;
        }
        if (weight !== null ){
          existingProduct.weight =weight;
        } 
        if (warranty !== null ){
          existingProduct.warranty = warranty;
        } 
        if (dimensions !== null) {
          existingProduct.dimensions = dimensions;
        }
      if (imageUrl !== undefined && imageUrl !== null) {
        existingProduct.imageUrl = imageUrl;
      }
      if (uploadedImages && uploadedImages.length > 0) {
        const images = existingProduct.images || [];

        existingProduct.images = [...images, ...uploadedImages];
      }
      // Optional: Update the updatedAt field if adding new information
      existingProduct.updatedAt = new Date();
      
     
      existingProduct.user = user;
      await existingProduct.save();
  
      return NextResponse.json(existingProduct, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating product", error },
        { status: 500 }
      );
    }
  }