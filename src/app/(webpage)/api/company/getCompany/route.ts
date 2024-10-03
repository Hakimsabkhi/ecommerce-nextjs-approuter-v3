import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Company from '@/models/Company';
import Address from '@/models/Address';



export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    await Address.find();
    // Fetch all categories but only return the name and imageUrl fields
    const company = await Company.findOne({}).populate('addresse','_id governorate city address zipcode'); // Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error fetching Company:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
  