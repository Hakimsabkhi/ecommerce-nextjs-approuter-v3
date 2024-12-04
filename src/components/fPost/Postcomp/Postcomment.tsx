'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { FormEvent, useEffect, useState } from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegSmileBeam } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
interface Postsecondsubsection {
    secondtitle: string;
    description: string;
    imageUrl?: string;
    imageFile?: File; // Temporary property to store the selected file before upload
  }
  
  interface Postfirstsubsection {
    fisttitle: string;
    description: string;
    Postsecondsubsections: Postsecondsubsection[];
    imageUrl?: string;
    imageFile?: File; // Temporary property to store the selected file before upload
  }
  
  interface blog {
    _id:string;
    title: string;
    description: string;
    Postfirstsubsections: Postfirstsubsection[];
    blogCategory: blogCategory;
    imageUrl?: string;
    user:User;
    numbercomment:number;
    createdAt:string;
    
  }
  interface User{
   _id:string;
   username:string
  }
  interface blogCategory {
    _id: string;
    name: string;
  }
  interface comment {
    _id:string;
    text:string;
    reply:string;
    user: {
      _id: string;
      username: string;
    };
    likes:User[]; 
    createdAt:string;
    updatedAt:string;
  }
  interface  User{
    _id:string;
    username:string;
    email:string;
  }

  interface Blogcommentprops{
    blog:blog
  }
const Blogcomment:React.FC<Blogcommentprops> = ({ blog })=>{
    const { data: session, status } = useSession()
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<comment[]>([]);
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/comments/getComments/${blog._id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const comments= await response.json(); // Assuming data is an array of Post objects
        setComments(comments)
      } catch (err: any) {
        console.log('Failed to fetch data'); // Set error message if fetching fails
      }
    };
    useEffect(() => {
     
  
      fetchData();
    }, []);
    const timeAgo = (date: string): string => {
      const now = new Date();
      const commentDate = new Date(date);
      const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
      const minutes = Math.floor(diffInSeconds / 60);
      const hours = Math.floor(diffInSeconds / 3600);
      const days = Math.floor(diffInSeconds / 86400);
      const weeks = Math.floor(diffInSeconds / 604800);
    
      if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    };
    const handleVote = async (action: 'like' | 'dislike' ,id:string) => {
      if (!session) {
        console.log("User is not logged in");
        return; // Exit the function if the user is not logged in
      } 
      console.log(action,id)
      try {
      const formData = new FormData();
      formData.append("action", action);
      const response = await fetch(`/api/comments/vote/${id}`, {
        method: 'POST',
        body: formData,
      });
 
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      fetchData();

      
   
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  
   // Handle textarea change
   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     setComment(e.target.value);
   };
 
   // Handle form submit
   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     const post=blog._id;
      // Optionally validate the comment before sending it
    if (!comment.trim()) {
        console.log('Comment cannot be empty');
        return;
      }
  
      try {
        // Send comment to the server using a POST request
        const response = await fetch('/api/comments/postComments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment , post}),
        });
  
        if (response.ok) {
          // If the response is successful, you can clear the comment and log success
          fetchData();
          setComment('');
        } else {
          // Handle the error if the API call fails
          console.error('Error submitting comment:', response.statusText);
        }
      } catch (error) {
        // Handle any unexpected errors, like network issues
        console.error('Error submitting comment:', error);
      }
    };
    const totalcomment=comments.length;
    
  const getlikeColor = (coments:comment) => {
    return coments.likes.some(user => user.email === session?.user?.email) ? 'blue' : '#9CA3AF';
  };

  return (
    <div className='w-full border-2 p-8 rounded-lg flex flex-col gap-4 bg-[#EFEFEF]'>
                    <p className='text-4xl font-bold'>Comments</p>
                  {session?.user!=null ?(<form onSubmit={handleSubmit}  className='flex flex-col gap-8'>
                       
                       <div className="grid grid-cols-1 gap-2">
                           <textarea 
                            value={comment} // Bind the value of the textarea to the state
                            onChange={handleChange} // Update state on textarea change
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5 h-40" required />
                        
                           <button
                            type="submit"
                           className='text-xs  px-4 py-2 rounded-md bg-gray-600 text-white '>Comment</button>
                       </div>
                   </form>):(<div className='flex justify-center'><Link href="/signin"className='bg-[#15335E] w-full pt-4 pb-4 text-white font-bold uppercase text-4xl rounded-md flex justify-center hover:bg-gray-500'>signin</Link></div>)}  
                    <div className='flex flex-col gap-4'>
                        <div className="flex justify-between items-center">
                            <p className='text-4xl max-md:text-xl '>{totalcomment} comments</p>
                            
                        </div>
                        {comments.map((comment) => (        <div className="flex flex-col gap-3">
                            <div className='flex flex-col gap-1'>
                                <p className='text-xl font-bold'>{comment.user.username}</p>
                                <p className='text-sm text-gray-400'>              {timeAgo(comment.createdAt)}
                                </p>
                            </div>
                            <p className='text-sm '>
                               {comment.text}
                            </p>
                            <div className="flex items-center  gap-2">
                               
                                    
                              <button  onClick={() => handleVote('like',comment._id)}>
                              <AiOutlineLike  className="md:hidden mb-0.5" size={12}  color={getlikeColor(comment)} />
                              <AiOutlineLike  className="max-md:hidden mb-1" size={17}  color={getlikeColor(comment)} />
                              </button>
                              <p className=" text-md  max-md:text-xs text-[#525566]">{comment.likes ? comment.likes.length : 0}</p>
                            
                               
                                
                               {comment.reply &&( <div className='flex items-center border-l-2 border-gray-400 gap-2 pl-2'>
                                    <div className='text-gray-400 flex items-center gap-2'>
                                        
                                          <div className='flex flex-col gap-1'>
                                              <p className='text-sm '>
                                                  {comment.reply}
                                                </p>
                                              <p className='text-xl font-bold'>{blog.user.username}</p>
                                              <p className='text-[10px] flex justify-end text-gray-400'>  {timeAgo(comment.updatedAt)} </p>
                                          </div>     
                                    </div>
                                 
                                </div>)}
                            </div>
                        </div>))}
                    </div>
                
                </div>
  )
}

export default Blogcomment