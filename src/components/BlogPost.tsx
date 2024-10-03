import Image from 'next/image';
import React from 'react';
import { blogpost1, blogpost2, blogpost3 } from "@/assets/image";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegSmileBeam } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const BlogPost = () => {
    return (
        /* whole page */
        <div className="desktop flex py-8 max-lg:py-20 gap-10 ">
            {/* First Half */}
            <div className='w-[900px] max-lg:w-full flex flex-col gap-16'>
                {/* 1 */}
                <div className="flex flex-col w-full gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-6">
                        <p className="text-4xl font-bold">Welcome to Blog Post</p>
                        <div className="flex flex-col gap-2">
                            <p className='text-gray-400 text-sm'>Posted on January 1, 2023 by Start Bootstrap</p>
                            <div className='flex items-center gap-2'>
                                <p className='text-xs px-4 py-2 rounded-md bg-gray-600 text-white'>Web Design</p>
                                <p className='text-xs px-4 py-2 rounded-md bg-gray-600 text-white'>Freebies</p>
                            </div>
                        </div>
                    </div>
                    {/* Post */}
                    <div className="flex flex-col gap-6">
                        <div className='flex flex-col gap-5'>
                            <Image src={blogpost1} alt="blogpost" />
                            <div className='flex flex-col gap-4'>
                                <p>Science is an enterprise that should be cherished as an activity of the free human mind. Because it transforms who we are, how we live, and it gives us an understanding of our place in the universe.</p>
                                <p>The universe is large and old, and the ingredients for life as we know it are everywhere, so there&apos;s no reason to think that Earth would be unique in that regard. Whether or not the life became intelligent is a different question, and we&apos;ll see if we find that.</p>
                                <p>If you get asteroids about a kilometer in size, those are large enough and carry enough energy into our system to disrupt transportation, communication, the food chains, and that can be a really bad day on Earth.</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <p className='text-4xl font-bold '>I have odd cosmic thoughts every day</p>
                            <div className='flex flex-col gap-4'>
                                <p>For me, the most fascinating interface is Twitter. I have odd cosmic thoughts every day and I realized I could hold them to myself or share them with people who might be interested.</p>
                                <p>Venus has a runaway greenhouse effect. I kind of want to know what happened there because we&apos;re twirling knobs here on Earth without knowing the consequences of it. Mars once had running water. It&apos;s bone dry today. Something bad happened there as well.</p>
                                <Image src={blogpost2} alt="blogpost" />
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <p className='text-4xl font-bold '>I have odd cosmic thoughts every day</p>
                            <div className='flex flex-col gap-4'>
                                <p>For me, the most fascinating interface is Twitter. I have odd cosmic thoughts every day and I realized I could hold them to myself or share them with people who might be interested.</p>
                                <p>Venus has a runaway greenhouse effect. I kind of want to know what happened there because we&apos;re twirling knobs here on Earth without knowing the consequences of it. Mars once had running water. It&apos;s bone dry today. Something bad happened there as well.</p>
                                <Image src={blogpost3} alt="blogpost" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* 2 */}
                <div className='w-full border-2 p-8 rounded-lg flex flex-col gap-4 bg-[#EFEFEF]'>
                    <div className='flex flex-col gap-8'>
                        <p className='text-4xl font-bold'>Comments</p>
                        <div className="relative">
                            <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5 h-40" required />
                            <button className='text-xs px-4 py-2 rounded-md bg-gray-600 text-white absolute top-[60%] right-1/2 translate-x-1/2 translate-y-1/2'>Post Comment</button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className="flex justify-between items-center">
                            <p className='text-4xl max-md:text-xl '>3 comments</p>
                            <select className="px-4 py-1 rounded-md ">
                                <option>Recent</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className='flex flex-col gap-1'>
                                <p className='text-xl font-bold'>Jenny Wilson</p>
                                <p className='text-sm text-gray-400'>1 week ago</p>
                            </div>
                            <p className='text-sm '>
                                These running shoes are the best I&apos;ve ever owned. They&apos;re lightweight, supportive, and my feet feel great even after long runs. The cushioning is perfect for absorbing impact.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className='flex items-center border-2 py-1 border-gray-400 rounded-md'>
                                    <p className="text-xs">10</p>
                                    <AiOutlineLike />
                                </div>
                                <FaRegSmileBeam size={25} className='text-gray-400' />
                                <div className='flex items-center border-l-2 border-gray-400 gap-2 pl-2'>
                                    <div className='text-gray-400 flex items-center gap-2'>
                                        <p className='text-gray-400'>2 replies</p>
                                        <IoIosArrowDown />
                                    </div>
                                    <p>reply</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pl-8 pt-6 border-l-2 flex flex-col gap-4 border-gray-700'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <p className="font-bold text-3xl">Kevin Patel</p>
                                <p className='text-gray-400 text-md'>5 days ago</p>
                            </div>
                            <p className='text-sm'>
                                Totally! I ran a half marathon in them last weekend and had zero discomfort. Have you tried them on trails?
                            </p>
                            <div className="flex items-center gap-2">
                                <div className='flex items-center gap-1 border-2 py-1 px-1 border-gray-400 rounded-[4px]'>
                                    <p className="text-xs">5</p>
                                    <AiOutlineLike />
                                </div>
                                <FaRegSmileBeam size={25} className='text-gray-400' />
                                <div className='flex items-center border-l-2 border-gray-400 gap-2 pl-2'>
                                    <p>reply</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <p className="font-bold text-3xl">James Anderson</p>
                                <p className='text-gray-400 text-md'>2 days ago</p>
                            </div>
                            <p className='text-sm'>
                                I&apos;ve been considering getting these. How do they hold up for indoor workouts?
                            </p>
                            <div className="flex items-center gap-2">
                                <div className='flex items-center border-2 py-1 px-1 gap-1 border-gray-400 rounded-[4px]'>
                                    <p className="text-xs">5</p>
                                    <AiOutlineLike />
                                </div>
                                <FaRegSmileBeam size={25} className='text-gray-400' />
                                <div className='flex items-center border-l-2 border-gray-400 gap-2 pl-2'>
                                    <div className='text-gray-400 flex items-center gap-2'>
                                        <p className='text-gray-400'>1 reply</p>
                                        <IoIosArrowDown />
                                    </div>
                                    <p>reply</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Second Half */}
            <div className='w-[300px] flex flex-col gap-10 max-lg:hidden'>
                <div className='flex flex-col gap-4'>
                    <p className='text-4xl font-bold'>Search</p>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5" placeholder="Search..." required />
                </div>
                <div className='flex flex-col gap-4'>
                    <p className='text-4xl font-bold'>Categories</p>
                    <div className='flex flex-col gap-2'>
                        <p className='text-blue-600 underline cursor-pointer'>Web Design</p>
                        <p className='text-blue-600 underline cursor-pointer'>Freebies</p>
                        <p className='text-blue-600 underline cursor-pointer'>JavaScript</p>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <p className='text-4xl font-bold'>Side Widget</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, ipsam, eligendi, in quo sunt possimus non incidunt odit vero aliquid similique quaerat nam nobis illo aspernatur vitae fugiat numquam repellat.</p>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
