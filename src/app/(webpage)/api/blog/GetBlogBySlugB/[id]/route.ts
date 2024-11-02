import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlogMainSection from '@/models/BlogMainSection';
import BlogFirstSubSection from '@/models/BlogFirstSubSection';
import BlogSecondSubSection from '@/models/BlogSecondSubSection';
import User from '@/models/User';
import BlogCategory from '@/models/BlogCategory';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 

    const slugblog = params.id;

    // Validate the slugblog parameter
    if (!slugblog || typeof slugblog !== 'string') {
      return NextResponse.json(
        { message: 'Blog name is required and should exist' },
        { status: 400 }
      );
    }

    // Fetch all necessary data
    await User.find();
    await BlogCategory.find();
    await BlogSecondSubSection.find();
    await BlogFirstSubSection.find().populate('blogsecondsubsection')
  
    // Fetch the blog with the given slug
    const blog = await BlogMainSection.findOne({ slug: slugblog, vadmin: "not-approve" })
  .populate('blogCategory')
  .populate('user',"username")
  .populate({
    path: 'blogfirstsubsection',
    populate: {
      path: 'blogsecondsubsection'
    
    }
  })
  .exec();

  
      console.log(blog)

    // Check if the blog was found
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Return the fetched blog
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
