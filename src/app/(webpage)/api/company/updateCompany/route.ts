import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/models/Company"; // Import Brand model
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import Address from "@/models/Address";
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
export async function PUT( req: NextRequest ){
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
      const id =formData.get('id') as string ;
      const IAddress=formData.get('idAddress')as string;
      const name = formData.get('name') as string | null;
      const addres = formData.get('address') as string | null;
      const city = formData.get('city') as string | null;
      const governorate = formData.get('governorate') as string | null;
      const zipcode = formData.get('zipcode') as string | null;
      const phone = formData.get('phone') as number | null;
      const email = formData.get('email') as string | null;
      const facebook = formData.get('facebook') as string | null;
      const linkedin = formData.get('linkedin') as string | null;
      const instagram = formData.get('instagram') as string | null;
      const imageFile = formData.get('image') as File | null;

  
      if (!id) {
        return NextResponse.json(
          { message: "id is required" },
          { status: 400 }
        );
      }
  
      const existingCompany = await Company.findById(id);
      if (!existingCompany) {
        return NextResponse.json({ message: "Company not found" }, { status: 404 });
      }
  
   
  
      // Initialize URLs with existing values
      let logoUrl = existingCompany.logoUrl;
   
  
      // Handle image file upload and deletion of the old image
      if (imageFile) {
        if (existingCompany.logoUrl) {
          const publicId = extractPublicId(existingCompany.logoUrl);
          if (publicId) {
            await cloudinary.uploader.destroy('company' + publicId);
            
          }
        }
  
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageStream = new stream.PassThrough();
        imageStream.end(imageBuffer);
  
        const { secure_url: newImageUrl } = await new Promise<any>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "company",
                format: 'webp' 
               },
              (error, result) => {
                if (error) return reject(new Error(`Image upload failed: ${error.message}`));
                resolve(result);
              }
            );
            imageStream.pipe(uploadStream);
          }
        );
  
        logoUrl = newImageUrl; // Update imageUrl with the uploaded URL
      }
  
  
      // Update adress with new values
      if(IAddress){
        const existingAddress= await Address.findById(IAddress);
        if (!existingAddress) {
          return NextResponse.json({ message: "Address not found" }, { status: 404 });
        }
        if (addres !== null) existingAddress.address = addres;
        if (city !== null) existingAddress.city = city;
        if (governorate !== null) existingAddress.governorate = governorate;
        if (zipcode !== null) existingAddress.zipcode = zipcode;
        existingAddress.user=user;
        await existingAddress.save();
      }
    
      // Update company with new values if provided
      if (name !== null) existingCompany.name = name;
      if (phone !== null) existingCompany.phone = phone;
      if (email !== null) existingCompany.email = email;
      if (facebook !== null) existingCompany.facebook = facebook;
      if (linkedin !== null) existingCompany.linkedin = linkedin;
      if (instagram !== null) existingCompany.instagram = instagram;
      existingCompany.logoUrl = logoUrl;
      existingCompany.user = user;
      existingCompany.updatedAt = new Date();
      await existingCompany.save(); // Save the updated brand
      return NextResponse.json(existingCompany, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating brand", error },
        { status: 500 }
      );
    }
  }
  