import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import BlogMainSection from "@/models/PostSections/PostMainSectionModel";
import BlogFirstSubSection, { IBlogFirstSubSection } from "@/models/PostSections/PostFirstSubSectionModel";
import BlogSecondSubSection from "@/models/PostSections/PostSecondSubSectionModel"; // Use singular for consistency
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
const extractPublicId = (url: string): string => {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};
export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
        if (!token) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      //fatcg the user
      
          // Find the user by email
          const user = await User.findOne({ email:token.email});
      
          
          if (!user || user.role !== 'Admin' && user.role !== 'Consulter'&& user.role !== 'SuperAdmin') {
            return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
          }

   
   
        const formData = await req.formData();
        const id= formData.get("id")as string;
        

     const blogTitle = formData.get("blogTitle") as string;
        const blogDescription = formData.get("blogDescription") as string;
        const blogImage = formData.get("blogImage") as File | null; // Use File instead of Blob
        const bloggerCount = formData.get("bloggerCount") as string;
        const blogCategory = formData.get("blogCategory");

        const existingBlog = await BlogMainSection.findById(id)
        .populate({
          path: 'blogfirstsubsection',
          populate: {
            path: 'blogsecondsubsection'
          }
        })
        .exec();
  
      if (!existingBlog) {
        console.log('Blog not found');
        return;
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
      
  
   

   if (blogImage) {  
    if (existingBlog.imageUrl) {
      const publicId = extractPublicId(existingBlog.imageUrl);
  if (publicId) {
    await cloudinary.uploader.destroy(`blog/${publicId}`);
      }
    }
   }
        // Upload the main blog image if it exists
        let blogImageUrl = '';
        if (blogImage) {
         
            const imageBuffer = await blogImage.arrayBuffer();
            const bufferStream = new stream.PassThrough();
            bufferStream.end(Buffer.from(imageBuffer));

            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'blog', format: 'webp' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                bufferStream.pipe(uploadStream);
            });
            blogImageUrl = result.secure_url;
        }

        const bloggersIds: string[] = [];
        for (let i = 0; i < Number(bloggerCount); i++) {
            const title = formData.get(`bloggers[${i}][title]`) as string;
            const description = formData.get(`bloggers[${i}][description]`) as string | null;
            const bloggerImage = formData.get(`bloggers[${i}][image]`) as File | null; // Use File instead of Blob
            
            let bloggerImageUrl = '';
            if (bloggerImage) {
                const imageBuffer = await bloggerImage.arrayBuffer();
                const bufferStream = new stream.PassThrough();
                bufferStream.end(Buffer.from(imageBuffer));

                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'blog/bloggers', format: 'webp' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    bufferStream.pipe(uploadStream);
                });
                bloggerImageUrl = result.secure_url;
            }

            // Create Blogger
            const newBlogger = new BlogFirstSubSection({ title, description, imageUrl: bloggerImageUrl });
            const savedBlogger = await newBlogger.save();

            // Handle sub-bloggers for each blogger
          
            const subBloggerCount = formData.get(`bloggers[${i}][subBloggerCount]`) as string;
          
            const subBloggerIds: string[] = [];
               
            for (let j = 0; j < Number(subBloggerCount) ; j++) {
                
                const subTitle = formData.get(`bloggers[${i}][subBloggers][${j}][title]`) as string;
                const subDescription = formData.get(`bloggers[${i}][subBloggers][${j}][description]`) as string | null;
                const subImage = formData.get(`bloggers[${i}][subBloggers][${j}][image]`) as File | null; // Use File instead of Blob

                let subBloggerImageUrl = '';
                if (subImage) {
                    const subImageBuffer = await subImage.arrayBuffer();
                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(Buffer.from(subImageBuffer));

                    const result = await new Promise<any>((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { folder: 'blog/bloggers/subbloggers', format: 'webp' },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        );
                        bufferStream.pipe(uploadStream);
                    });
                    subBloggerImageUrl = result.secure_url;
                }

                // Create and save sub-blogger
                const newSubBlogger = new BlogSecondSubSection({ title: subTitle, description: subDescription, imageUrl: subBloggerImageUrl });
                const savedSubBlogger = await newSubBlogger.save();
               
                // Add saved sub-blogger ID to the array
                subBloggerIds.push(savedSubBlogger._id.toString());
            }

            // Update Blogger with sub-bloggers' IDs
            savedBlogger.blogsecondsubsection = subBloggerIds;
            await savedBlogger.save();

            // Add the blogger ID to the bloggers array
            bloggersIds.push(savedBlogger._id.toString());
        }

        // Create and save the blog
        existingBlog.title = blogTitle;
    existingBlog.description = blogDescription || ''; // Default to an empty string if description is null
    if(blogImageUrl){
    existingBlog.imageUrl = blogImageUrl || ''; // Default to an empty string if no image was uploaded
    }
    existingBlog.blogfirstsubsection = bloggersIds;
    if(blogImageUrl){
    existingBlog.blogCategory = blogCategory as string;
    }
    existingBlog.user = user;

    await existingBlog.save();

       

        return NextResponse.json(
            {
                message: "Blog created successfully",
          /*   blog: newBlog, */
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
            { message: "Failed to process request", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
