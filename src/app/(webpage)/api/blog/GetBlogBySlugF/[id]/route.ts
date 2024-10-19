import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import  Blog from '@/models/Blog';
import Blogger from '@/models/Blogger';
import Subbloggers from '@/models/Subbloggers';
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
    await Subbloggers.find();
    await Blogger.find().populate("subbloggers");
    
    // Fetch all Blogs 
    const Blogs = await Blog.findOne({ slug: slugblog })
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