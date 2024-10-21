import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import  BlogMainSection from '@/models/BlogMainSection';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await User.findOne({ email: token.email }).exec();
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}
export async function GET(req: NextRequest) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await User.find({})
  
    // Fetch all Blogs 
    const Blogs = await BlogMainSection.find({}).populate('user','_id username email role').exec(); 
    // Return the fetched Blogs 
    return NextResponse.json(Blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}