
import Blog from '@/components/fblog/Blog';
import { notFound } from 'next/navigation';

import React from 'react';
interface blog {
    title: string;
    description: String;
    imageUrl: string;
    slug: string;
    blogCategory:{slug:string};
    vadmin:string;
    createdAt:string;
  }
 



  const fetchBlogData = async (id: string): Promise<blog[]> => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/GetBlogBySlugCategoryB/${id}`, {
        method: 'GET',
       
        next: { revalidate: 0 },
    });
    if (!res.ok) {
     notFound()
    }
    const data: blog[]  = await res.json();
    
    return data;
};

export default async function Page({ params }: { params: { slugblogcategory: string } }) {
  const id = params.slugblogcategory;
      const blog = await fetchBlogData(id);

    // Pass the blog data as an array
    return (
        <div>
            <Blog blogs={blog} />
        </div>
    );
}