import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";

import BlogMainSection from "@/models/PostSections/PostMainSectionModel";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";
import BlogFirstSubSection, { IBlogFirstSubSection } from "@/models/PostSections/PostFirstSubSectionModel";
import BlogSecondSubSection from "@/models/PostSections/PostSecondSubSectionModel";

const extractPublicId = (url: string): string => {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  };

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });

    if (!user || !['Admin', 'Consulter', 'SuperAdmin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: "Invalid or missing blog ID" }, { status: 400 });
    }

    try {
        const existingBlog = await BlogMainSection.findById(id)
            .populate({
                path: 'blogfirstsubsection',
                populate: { path: 'blogsecondsubsection' }
            })
            .exec();

        if (!existingBlog) {
            throw new Error('Blog not found');
        }

        // Remove images from Cloudinary for the main blog
        if (existingBlog.imageUrl) {
            const publicId = extractPublicId(existingBlog.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`blog/${publicId}`);
        }
    
        }

        // Process blogfirstsubsection
        if (Array.isArray(existingBlog.blogfirstsubsection)) {
            for (const firstSub of existingBlog.blogfirstsubsection) {
                const blogFirst: IBlogFirstSubSection = firstSub as IBlogFirstSubSection;

                // Remove images for blogsecondsubsection
                if (blogFirst.blogsecondsubsection) {
                    const blogSecondSubs = await BlogSecondSubSection.find({ _id: { $in: blogFirst.blogsecondsubsection } });
                    for (const secondSub of blogSecondSubs) {
                        if (secondSub.imageUrl) {
                            const publicId = extractPublicId(secondSub.imageUrl);
                           
                            if (publicId) {
                              await cloudinary.uploader.destroy(`blog/bloggers/subbloggers/${publicId}`);
                             
                            }
                        
                            
                        }
                    }
                    
                    // Delete blogsecondsubsection
                    await BlogSecondSubSection.deleteMany({ _id: { $in: blogFirst.blogsecondsubsection } });
                }

                // Remove images for blogfirstsubsection
                if (blogFirst.imageUrl) {
                    const publicId = extractPublicId(blogFirst.imageUrl);
                    if (publicId) {
                      await cloudinary.uploader.destroy(`blog/bloggers/${publicId}`);
                    }
                
                   
                    
                }
            }

            // Delete blogfirstsubsection
            await BlogFirstSubSection.deleteMany({ _id: { $in: existingBlog.blogfirstsubsection.map(sub => (sub as IBlogFirstSubSection)._id) } });
        }

        // Finally, delete the main blog document
        await BlogMainSection.findByIdAndDelete(id);
        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
    }
}
