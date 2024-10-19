import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import  BlogMainSection from '@/models/BlogMainSection';
import BlogFirstSubSection from '@/models/BlogFirstSubSection';
import BlogSecondSubSection from '@/models/BlogSecondSubSection';
import User from '@/models/User';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 
    const slugblog = params.id;
    if (!slugblog || typeof slugblog !== 'string') {
      return NextResponse.json(
        { message: 'Blog name is required and should be existe' },
        { status: 400 }
      );
    }
    await User.find();
    await BlogSecondSubSection.find();
    await BlogFirstSubSection.find().populate("blogsecondsubsection");
    
    // Fetch all Blogs 
    const Blogs = await BlogMainSection.findOne({ slug: slugblog })
    .populate("user") // Populate the user field
    .populate("bloggers") // Populate the bloggers field
    .populate({
        path: 'bloggers',
        populate: {
            path: 'subbloggers' // Populate subbloggers within bloggers
        }
    })
    .exec();
    // Return the fetched Blogs 
    return NextResponse.json(Blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}