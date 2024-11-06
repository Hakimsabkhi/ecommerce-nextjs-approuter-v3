import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import BlogMainSection from "@/models/PostSections/PostMainSectionModel";
import BlogFirstSubSection from "@/models/PostSections/PostFirstSubSectionModel";
import BlogSecondSubSection from "@/models/PostSections/PostSecondSubSectionModel"; // Use singular for consistency
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import uploadeImage from "@/lib/uploadeImage";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    //fatcg the user

    // Find the user by email
    const user = await User.findOne({ email: token.email });

    if (
      !user ||
      (user.role !== "Admin" &&
        user.role !== "Consulter" &&
        user.role !== "SuperAdmin")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Access is denied" },
        { status: 404 }
      );
    }
    const formData = await req.formData();

    const blogTitle = formData.get("blogTitle") as string;
    const blogDescription = formData.get("blogDescription") as string;
    const blogImage = formData.get("blogImage") as File | null; // Use File instead of Blob
    const bloggerCount = formData.get("bloggerCount") as string;
    const blogCategory = formData.get("blogCategory");

    // Upload the main blog image if it exists

    let blogImageUrl = "";
    if (blogImage) {
      try {
        blogImageUrl = await uploadeImage("blog", blogImage);
      } catch (error) {
        console.error("Error uploading blog image:", error);
        // Optionally, you can handle the error or set a fallback URL.
      }
    }

    const bloggersIds: string[] = [];
    for (let i = 0; i < Number(bloggerCount); i++) {
      const title = formData.get(`bloggers[${i}][title]`) as string;
      const description = formData.get(`bloggers[${i}][description]`) as
        | string
        | null;
      const bloggerImage = formData.get(`bloggers[${i}][image]`) as File | null; // Use File instead of Blob

      let bloggerImageUrl = "";
      if (bloggerImage) {
        try {
            bloggerImageUrl = await uploadeImage("blog/bloggers", bloggerImage);
          } catch (error) {
            console.error("Error uploading blog image:", error);
            // Optionally, you can handle the error or set a fallback URL.
          }
        
      }

      // Create Blogger
      const newBlogger = new BlogFirstSubSection({
        title,
        description,
        imageUrl: bloggerImageUrl,
      });
      const savedBlogger = await newBlogger.save();

      // Handle sub-bloggers for each blogger

      const subBloggerCount = formData.get(
        `bloggers[${i}][subBloggerCount]`
      ) as string;

      const subBloggerIds: string[] = [];

      for (let j = 0; j < Number(subBloggerCount); j++) {
        const subTitle = formData.get(
          `bloggers[${i}][subBloggers][${j}][title]`
        ) as string;
        const subDescription = formData.get(
          `bloggers[${i}][subBloggers][${j}][description]`
        ) as string | null;
        const subImage = formData.get(
          `bloggers[${i}][subBloggers][${j}][image]`
        ) as File | null; // Use File instead of Blob

        let subBloggerImageUrl = "";
        if (subImage) {
            try {
                subBloggerImageUrl = await uploadeImage("blog/bloggers/subbloggers", subImage);
              } catch (error) {
                console.error("Error uploading blog image:", error);
                // Optionally, you can handle the error or set a fallback URL.
              }
          
        }

        // Create and save sub-blogger
        const newSubBlogger = new BlogSecondSubSection({
          title: subTitle,
          description: subDescription,
          imageUrl: subBloggerImageUrl,
        });
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
    const newBlog = new BlogMainSection({
      title: blogTitle,
      description: blogDescription || "", // Default to an empty string if description is null
      imageUrl: blogImageUrl || "", // Default to an empty string if no image was uploaded
      blogfirstsubsection: bloggersIds,
      blogCategory: blogCategory,
      user,
    });

    await newBlog.save();

    return NextResponse.json(
      {
        message: "Blog created successfully",
        blog: newBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      {
        message: "Failed to process request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
