import React from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegSmileBeam } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
function Blogcomment() {
  return (
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
  )
}

export default Blogcomment