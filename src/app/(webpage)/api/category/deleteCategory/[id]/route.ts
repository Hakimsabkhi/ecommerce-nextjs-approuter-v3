
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
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
    const { id } = params;
  
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing category ID" },
        { status: 400 }
      );
    }
  
    try {
      const products = await Product.find({ category: id });
      if (products.length > 0) {
        return NextResponse.json(
          { message: "Cannot delete category with associated products" },
          { status: 400 }
        );
      }
  
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
      if (category.imageUrl) {
        const publicId = extractPublicId(category.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`categories/${publicId}`);
        }
      }
  
      if (category.logoUrl) {
        const publicId = extractPublicId(category.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`categories/logos/${publicId}`);
        }
      }
      if (category.bannerUrl) {
        const publicId = extractPublicId(category.bannerUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`categories/banner/${publicId}`);
        }
      }
  
      await Category.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "Category deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting category" },
        { status: 500 }
      );
    }
  }
  
  function extractPublicId(url: string): string {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  }
  