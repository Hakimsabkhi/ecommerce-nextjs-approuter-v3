import Image from "next/image";
import React from "react";
interface blog {
  title: string;
  description: String;
  imageUrl: string;
  blogfirstsubsection: blogfirstsubsection[];
  slug: string;
  user:{
    username:string;
  }
  vadmin: string;
  createdAt: string;
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
interface Blogcompprops {
  blog: blog;
}

const Blogcomp: React.FC<Blogcompprops> = ({ blog }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Title */}
      <div className="flex flex-col gap-6">
        <p className="text-4xl font-bold">{blog.title}</p>
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-sm">
            Posted on {new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})} by {blog.user.username}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs px-4 py-2 rounded-md bg-gray-600 text-white">
              Web Design
            </p>
            <p className="text-xs px-4 py-2 rounded-md bg-gray-600 text-white">
              Freebies
            </p>
          </div>
        </div>
      </div>
      {/* Post */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <Image
            src={blog.imageUrl}
            width={1000}
            height={1000}
            alt="blogpost"
            className=" h-[320px]"
          />
          <div className="flex flex-col gap-4">{blog.description}</div>
        </div>
        {blog.blogfirstsubsection?.length > 0 ? (
  blog.blogfirstsubsection.map((blogers, index) => (
    <div key={index} className="flex flex-col gap-6">
      <p className="text-4xl font-bold">{blogers.title}</p>
      <div className="flex flex-col gap-4">
       {blogers.description &&<p>{blogers.description}</p>} 
        {blogers.imageUrl&&<Image
          src={blogers.imageUrl } // Fallback if imageUrl is empty
          width={1000}
          height={1000}
          alt={`${blogers.title} image`} // Alt text includes title
             className=" h-[320px]"
        />}
      </div>

      {/* Map over subbloggers instead of bloggers */}
    {/* Map over subbloggers instead of bloggers */}
    {blogers.blogsecondsubsection?.length > 0 && blogers.blogsecondsubsection.map((subblog, subIndex) => (
          <div key={subIndex} className="flex flex-col gap-6">
            <p className="text-xl font-bold">{subblog.title}</p>
            <div className="flex flex-col gap-4">
             {subblog.description && <p>{subblog.description}</p>}
              {subblog.imageUrl && 
                <Image
                  src={subblog.imageUrl}
                  width={2000}
                  height={2000}
                  alt={`${subblog.title} image`} // Alt text includes title
                    className="h-[320px] "
                />
              }
            </div>
          </div>
        ))}
    </div>
  ))
) : (
  <p>No blogs available</p> // Fallback message if blog.bloggers is empty or undefined
)}



        {/* <div className='flex flex-col gap-6'>
                            <p className='text-4xl font-bold '>I have odd cosmic thoughts every day</p>
                            <div className='flex flex-col gap-4'>
                                <p>For me, the most fascinating interface is Twitter. I have odd cosmic thoughts every day and I realized I could hold them to myself or share them with people who might be interested.</p>
                                <p>Venus has a runaway greenhouse effect. I kind of want to know what happened there because we&apos;re twirling knobs here on Earth without knowing the consequences of it. Mars once had running water. It&apos;s bone dry today. Something bad happened there as well.</p>
                                <Image src={blogpost3} alt="blogpost" />
                            </div>
                        </div> */}
      </div>
    </div>
  );
};

export default Blogcomp;
