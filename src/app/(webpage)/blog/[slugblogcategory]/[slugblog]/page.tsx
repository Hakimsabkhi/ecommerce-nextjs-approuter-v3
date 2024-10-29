import BlogPost from '@/components/fblog/BlogPost';
import { notFound } from 'next/navigation';
import React from 'react';
interface blog {
  title: string;
  description: String;
  imageUrl: string;
  blogfirstsubsection: blogfirstsubsection[];
  slug: string;
  user:{
    username:string;
  }
  blogCategory:blogCategory;
  vadmin: string;
  createdAt: string;
}
interface blogCategory{
  _id:string
  name:string
}
interface blogfirstsubsection {
  title: string;
  description: String;
  imageUrl: string;
  blogsecondsubsection: blogsecondsubsection[];
}
interface blogsecondsubsection {
  title: string;
  description: String;
  imageUrl: string;
}
const fetchBlogData = async (id: string): Promise<blog> => {
  
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/GetBlogBySlugF/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
      });
  
      if (!res.ok) {
        notFound();
      }
  
      const data: blog = await res.json();
    
      return data;
    
  };
  
  export default async function Page({ params }: { params: {slugblog: string } }) {
    const id = params?.slugblog;

 
    if (!id) {
      return notFound();
    }

    const blog = await fetchBlogData(id);
    
   
    return (
        <div>
            <BlogPost blog={blog} />
        </div>
    );
}

