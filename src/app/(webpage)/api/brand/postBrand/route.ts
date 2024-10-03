import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Brand from '@/models/Brand';
import cloudinary from '@/lib/cloudinary';
import upload from '@/lib/multer'; // Adjust the path according to your project structure
import stream from 'stream';
import { promisify } from 'util';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';


const uploadFiles = promisify(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]));



export async function POST(req: NextRequest) {
    await connectToDatabase();
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
      const name = formData.get('name') as string | null;
      const place = formData.get('place') as string | null;
      const imageFile = formData.get('image') as File | null;
      const logoFile = formData.get('logo') as File | null;
  
  
      if (!name ) {
        return NextResponse.json({ message: 'Name is required' }, { status: 400 });
      }
  
      const existingBrand = await Brand.findOne({ name });
      if (existingBrand) {
        return NextResponse.json({ message: 'Brand with this name already exists' }, { status: 400 });
      }
  
      let imageUrl = '';
      let logoUrl = '';
  
      if (imageFile) {
        const imageBuffer = await imageFile.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));
  
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'brands/images',
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
  
      if (logoFile) {
        const logoBuffer = await logoFile.arrayBuffer();
        const logoBufferStream = new stream.PassThrough();
        logoBufferStream.end(Buffer.from(logoBuffer));
  
        const logoResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'brands/logos',
              format: 'webp' 
             },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
  
          logoBufferStream.pipe(uploadStream);
        });
  
        logoUrl = logoResult.secure_url;
      }
  
      const newBrand = new Brand({ name,place, logoUrl, imageUrl,user });
      await newBrand.save();
      return NextResponse.json(newBrand, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
    }
  }