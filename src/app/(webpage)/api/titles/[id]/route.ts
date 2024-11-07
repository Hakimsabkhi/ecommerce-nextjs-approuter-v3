

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Title } from '@/models/Title';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const title = await Title.findById(id).lean();
    if (!title) return NextResponse.json({ message: 'Title not found' }, { status: 404 });
    return NextResponse.json(title);
  } catch (error) {
    console.error('Error fetching title:', error);
    return NextResponse.json({ message: 'Error fetching title' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const updatedData = await request.json();

  try {
    const result = await Title.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) return NextResponse.json({ message: 'Title not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating title:', error);
    return NextResponse.json({ message: 'Error updating title' }, { status: 500 });
  }
}
