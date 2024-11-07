import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Title } from '@/models/Title';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { title, imageUrl, subtitles } = await request.json();
    console.log("Received data for new title:", { title, imageUrl, subtitles });

    const newTitle = new Title({
      title,
      imageUrl,
      subtitles,
    });

    console.log("New title document before saving:", newTitle);

    const savedDocument = await newTitle.save();
    console.log("Saved document:", savedDocument);

    return NextResponse.json({
      message: 'Title with subtitles and image saved successfully',
      data: savedDocument,
    });
  } catch (error: unknown) {
    // Explicitly assert `error` as an `Error` type
    if (error instanceof Error) {
      console.error("Error saving new title:", error.message);
      return NextResponse.json(
        { error: 'Failed to save title', details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const titles = await Title.find({}).lean();
    return NextResponse.json(titles);
  } catch (error: unknown) {
    // Explicitly assert `error` as an `Error` type
    if (error instanceof Error) {
      console.error('Error fetching titles:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch titles', details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
