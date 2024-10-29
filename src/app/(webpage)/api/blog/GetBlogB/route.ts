import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import  BlogMainSection from '@/models/BlogMainSection';
import BlogCategory from '@/models/BlogCategory';



export async function GET(req: NextRequest) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 
  
    await BlogCategory.find();
    // Fetch all Blogs 
    const Blogs = await BlogMainSection.find({ vadmin: "not-approve" }).populate('blogCategory').exec(); 
    // Return the fetched Blogs 
    return NextResponse.json(Blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}