import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlogMainSection from '@/models/BlogMainSection';
import BlogFirstSubSection from '@/models/BlogFirstSubSection';
import BlogSecondSubSection from '@/models/BlogSecondSubSection';
import User from '@/models/User';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (!user || !['Admin', 'Consulter', 'SuperAdmin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
      const formData = await req.formData();
      const title = formData.get('title') as string | null;
      const description = formData.get('description') as string | null;
      const imageFile = formData.get('image') as File | null;
      const firstSubSectionsData = JSON.parse(formData.get('firstSubSections') as string || '[]');

      console.log('Received firstSubSectionsData:', firstSubSectionsData); // Debugging log

      let imageUrl = '';
      if (imageFile) {
          const imageBuffer = await imageFile.arrayBuffer();
          const bufferStream = new stream.PassThrough();
          bufferStream.end(Buffer.from(imageBuffer));

          const result = await new Promise<any>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  { folder: 'blogs', format: 'webp' },
                  (error, result) => {
                      if (error) {
                          return reject(error);
                      }
                      resolve(result);
                  }
              );

              bufferStream.pipe(uploadStream);
          });

          imageUrl = result.secure_url;
      }

      // Step 1: Save each first sub-section with nested second sub-sections
      const firstSubSections = await Promise.all(
          firstSubSectionsData.map(async (subSectionData: any) => {
              const { title, description, imageUrl, blogsecondsubsection: secondSubSectionsData } = subSectionData;

              // Save each second sub-section inside the first sub-section
              const secondSubSections = await Promise.all(
                  (secondSubSectionsData || []).map(async (secondSubSectionData: any) => {
                      const { title, description, imageUrl } = secondSubSectionData;
                      const newSecondSubSection = new BlogSecondSubSection({
                          title,
                          description,
                          imageUrl,
                      });

                      // Save the second sub-section and log if successful
                      await newSecondSubSection.save();
                      console.log('Saved BlogSecondSubSection:', newSecondSubSection);
                      return newSecondSubSection._id;
                  })
              );

              const newFirstSubSection = new BlogFirstSubSection({
                  title,
                  description,
                  imageUrl,
                  blogsecondsubsection: secondSubSections,
              });

              // Save the first sub-section and log if successful
              await newFirstSubSection.save();
              console.log('Saved BlogFirstSubSection:', newFirstSubSection);
              return newFirstSubSection._id;
          })
      );

      console.log('Collected firstSubSections IDs:', firstSubSections); // Debugging log

      // Step 2: Create and save the main blog entry with references to first sub-sections
      const newBlogMainSection = new BlogMainSection({
          title: title || undefined,
          description: description || undefined,
          imageUrl: imageUrl || undefined,
          blogfirstsubsection: firstSubSections,
          user: user._id,
      });

      await newBlogMainSection.save();
      console.log('Saved BlogMainSection:', newBlogMainSection);
      return NextResponse.json(newBlogMainSection, { status: 201 });
  } catch (error) {
      console.error('Error creating blog:', error);
      return NextResponse.json({ message: 'Error creating blog' }, { status: 500 });
  }
}
