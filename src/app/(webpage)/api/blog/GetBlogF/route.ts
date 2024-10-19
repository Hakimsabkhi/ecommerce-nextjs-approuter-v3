import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import  Blog from '@/models/BlogMainSection';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 
  
  
    // Fetch all Blogs 
    const Blogs = await Blog.find({}).exec(); 
    // Return the fetched Blogs 
    return NextResponse.json(Blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}