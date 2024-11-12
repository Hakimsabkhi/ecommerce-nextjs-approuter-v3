
import Blog from '@/components/fPost/Post';
import Blogbanner from '@/components/blogbanner';
import React from 'react';
interface blog {
    title: string;
    description: String;
    imageUrl: string;
    slug: string;
    vadmin:string;
    createdAt:string;
  }
 




async function  getBlogs()  {
   
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/listpostcustomer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next:{revalidate:0}
      });
 
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
  }
const Page = async () => {
    const blogs = await getBlogs();
    console.log(blogs)
    return (
        <div>
            <Blogbanner/>
            <Blog blogs={blogs}/>
        </div>
    );
}

export default Page;
