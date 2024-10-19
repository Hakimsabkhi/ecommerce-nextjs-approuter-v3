
import React from 'react';


import Blogcomp from './blogcomp/Blogcomp';
import Blogcomment from './blogcomp/Blogcomment';
import Blogright from './blogcomp/Blogright';
interface blog {
    title: string;
    description: String;
    imageUrl: string;
    bloggers: bloggers[];
    slug: string;
    user:{
      username:string;
    }
    vadmin:string;
    createdAt:string;
  }
  interface bloggers{
    title: string;
    description: String;
    imageUrl: string;
    subbloggers: Subbloggers[];
  }
  interface Subbloggers{
    title: string;
    description: String;
    imageUrl: string;
  }
  interface blogprops{
    blog:blog
  }
const BlogPost: React.FC<blogprops> = ({ blog }) => {
    return (
        /* whole page */
        <div className="desktop flex py-8 max-lg:py-20 gap-10 ">
            {/* First Half */}
            <div className='w-[900px] max-lg:w-full flex flex-col gap-16'>
                {/* 1 */}
                <Blogcomp blog={blog}/>
                {/* 2 */}
               <Blogcomment/>
            </div>
            {/* Second Half */}
            <Blogright/>
        </div>
    );
};

export default BlogPost;
