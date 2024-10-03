import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

import stream from "stream";

import User from "@/models/User";

import { getToken } from 'next-auth/jwt';


export async function POST(req: NextRequest) {
  await connectToDatabase();
  //check token
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
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const ref = formData.get('ref') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const stock = formData.get('stock') as string;
    const discount = formData.get('discount') as string;
    const price = formData.get('price') as string;
    const info = formData.get('info') as string;
    const material = formData.get('material') as string;
    const  dimensions = formData.get('dimensions') as string;
    const color = formData.get('color') as string;
    const weight = formData.get('weight') as string;
    const warranty = formData.get('warranty')as string ;
    const statuspage = formData.get('statuspage')as string ;
    const imageFiles: File[] = [];
    const entries = Array.from(formData.entries()); // Convert entries to an array
    for (let i = 0; i < entries.length; i++) {
      const file = formData.get(`images[${i}]`) as File;
      if (file) {
        imageFiles.push(file);
      }
    }
    



    const imageFile = formData.get('image') as File | null;
    if (!name || !ref || !info || !brand || !stock || !price || !user) {
      return NextResponse.json({ message: 'Required fields: name, info, ref, category, brand, stock, price' }, { status: 400 });
    }
    const existingProducts = await Products.findOne({ ref });
            if (existingProducts) {
              return NextResponse.json({ message: 'Product with this ref already exists' }, { status: 400 });
            }

  

    let imageUrl = '';


    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(imageBuffer));

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'Products',
            format: 'webp' 
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

      imageUrl = result.secure_url; // Extract the secure_url from the result
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


    const newProducts = new Products({ name,info,description,ref,material,color,warranty,dimensions,category,brand,stock,price ,discount , imageUrl, user ,weight, images: uploadedImages,statuspage});
    await newProducts.save(); 
    return NextResponse.json(newProducts, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating Product' }, { status: 500 });
  }
}