"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { mackay, share, comment, left, right } from "@/assets/image";
import { itemsblog } from "@/assets/data";
import { FaArrowLeft, FaArrowRight, FaReadme } from "react-icons/fa6";

const Blog: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8; // Adjust the number of items per page as needed

    // Calculate the total number of pages
    const totalPages = Math.ceil(itemsblog.length / itemsPerPage);

    // Get the items to display on the current page
    const currentItems = itemsblog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 800, behavior: 'smooth' });
    };

    return (
        <div className='py-8 w-[96%] mx-auto items-center flex flex-col gap-5 justify-center'>
            {/* <div className='grid grid-cols-4 gap-8 max-2xl:gap-4  group max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3'>
                {currentItems.map((item, index) => (
                    <div key={index} className='flex flex-col cursor-pointer duration-500 lg:group-hover:scale-[0.95] lg:hover:!scale-100 justify-center items-center w-[322px] max-2xl:w-[300px]'>
                        <div className="relative justify-center w-[322px] max-2xl:w-[300px] flex">
                            <div className="absolute flex items-center justify-between w-[95%] bottom-1">
                                <div className='flex gap-2 items-center'>
                                    <Image className='w-5 h-5' src={mackay} alt="person" />
                                    <p className='text-white'>Mr.mackay</p>
                                </div>
                                <div className='flex gap-2'>
                                    <Image src={share} alt="share" />
                                    <Image src={comment} alt="comment" />
                                </div>
                            </div>
                            <Image className='rounded-t-lg w-[322px] max-2xl:w-[300px]' src={item.src} alt="steak" />
                        </div>
                        <div className='flex flex-col rounded-b-lg gap-2 bg-white w-[322px] max-2xl:w-[300px] h-[214px] pl-2'>
                            <p className="text-[#525566]">{item.date}</p>
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col gap-2">
                                    <p className="text-[#525566] text-xl font-bold">{item.titlexl}</p>
                                    <p className="text-[#525566] text-2xl font-bold">{item.title}</p>
                                    <p className="text-[#525566]">{item.text}</p>
                                </div>
                                <p className="text-orange-800">Continue reading</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}
            <div className='grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 w-full group gap-10     '>
                {currentItems.map((item, index) => (
                    <div key={index} className='flex cursor-pointer duration-500  lg:group-hover:scale-[0.95] lg:hover:!scale-100 flex-col items-center relative'>
                        <div className=" w-full   ">
                            <Image className=' w-full' src={item.src} alt="" />
                        </div>
                        <div className='flex flex-col border-x-2 border-b-2 gap-2 items-center bg-white w-full h-[235px]'>
                            <div className="w-[302px]  max-sm:w-[90%] pt-2 ">
                                <p className="text-[#525566]    ">{item.date}</p>
                                <div className="flex flex-col  gap-5 max-md:gap-2 ">
                                    <div className="flex flex-col  gap-2">
                                        <p className="text-[#525566] text-xl font-bold">{item.titlexl}</p>
                                        <p className="text-[#525566] text-2xl max-sm:text-xl font-bold">{item.title}</p>
                                        <p className="text-[#525566]">{item.text} </p>
                                    </div>
                                    <button aria-label="read more about blog" className="bg-primary hover:bg-[#15335D] rounded-lg w-full h-14 items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white  ">
                                        <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform  ease text-xl  ">continue reading</p>
                                        <p className="  text-white absolute flex items-center justify-center w-full h-full duration-500 translate-x-[-35%] translate-y-[3%] opacity-0 lg:group-hover/box:opacity-100 ease  ">
                                            <FaReadme className="w-8  h-8" aria-hidden="true" fill="currentColor" />
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>))}
            </div>
            <div className='flex justify-center items-center gap-x-4 '>
                <div
                    className="flex items-center gap-1 cursor-pointer  "
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <FaArrowLeft
                        className='cursor-pointer'

                    />
                    <p className="text-sm font-semibold">
                        PREVIOUS
                    </p>
                </div>
                {Array.from({ length: totalPages }, (_, i) => (
                    <p
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`cursor-pointer text-xl rounded-full py-3 px-5 ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
                    >
                        {i + 1}
                    </p>
                ))}
                <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <p className="text-sm font-semibold">
                        NEXT
                    </p>
                    <FaArrowRight
                        className='cursor-pointer'

                    />
                </div>
            </div>
        </div>
    );
}

export default Blog;

