import React from 'react';
import Image from 'next/image';
import { decor1 } from "@/assets/image";
const Rules = () => {
    return (
        <div className=' py-8 h-fit desktop  max-md:w-[95%] flex flex-col gap-10 justify-center items-center'>
            <div className='max-md:text-center text-left max-md:w-full w-full  '>
                <h3 className='font-bold max-md:text-2xl text-4xl text-gray-800'>
                    Rules of choosing furniture
                </h3>
            </div>
            <div className='flex max-md:w-full w-full max-md:flex-col  gap-16'>
                <div className='w-fit'>
                    <Image className='w-[600px]  rounded-md shadow-lg' src={decor1} alt="decor" />
                </div>
                <div className='gap-8 w-fit flex-col justify-center flex'>
                    <p className=' text-black max-md:text-center text-2xl font-bold'>Whether living on your own or with a family , your livingroom is an important</p>
                    <p className='text-xl text-[#525566]'>this room is where your family spends time together, and it is the room most of your guests will spend the majority of their time in. Choosing furniture that creates a pleasant, welcoming appearance while holding up against the wear and tear of everyday life is the key in getting this space to work for your needs </p>
                    <ul className="text-[#525566]">
                        <li className='text-xl '>Choose items in a single color scheme and style</li>
                        <li className='text-xl '>Consider the area of the room</li>
                        <li className='text-xl '>Do not buy unnecessary pieces of furniture</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default Rules;
