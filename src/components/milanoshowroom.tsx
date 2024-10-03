import React from 'react';
import Image from 'next/image';
import { lladrologo, poliformlogo, minottilogo, kettallogo, tacchinilogo, milanoroom1, milanoroom2, milanoroom3,  } from "@/assets/image";
const Milanoshowroom = () => {
    return (
        <div className='flex flex-col py-8 gap-4 items-center justify-center'>
            <div className='flex w-4/5 items-center justify-between max-lg:flex-col max-lg:gap-8'>
                <div className='w-1/3 flex flex-col gap-4 max-lg:w-full max-lg:text-start'>
                    <p className='text-4xl font-semibold'>Milano showroom</p>
                    <p className='text-gray-400'>Furniture is an invariable attribute of any room. it is they who give it the right atmosphere, making the space cozy and comfortbale. More and more often, customers want to place an order in an onli e store, when you can sit down at the computer in your free time, arrange the furniture in the photo and calmly buy the furniture you like.</p>
                    <div className='flex gap-4'>
                        <Image src={lladrologo} alt="brand" />
                        <Image src={poliformlogo} alt="brand" />
                        <Image src={tacchinilogo} alt="brand" />
                        <Image src={kettallogo} alt="brand" />
                        <Image src={minottilogo} alt="brand" />
                    </div>
                </div>
                <div className='w-1/3 flex-col  flex gap-4 max-lg:w-full max-lg:justify-center max-lg:flex max-lg:flex-colr max-lg:items-center max-lg:gap-1 max-lg:text-center'>
                    <div className='flex-col flex '>
                        <p>Milano Piazzale</p>
                        <p>Ferrara</p>
                        <p>Via Mincio,4,10139</p>
                    </div>
                    <div className='flex gap-1  items-center'>
                        <p>Monday-Friday</p>
                        <p className='text-sm text-gray-400'>09:00-17:00</p>
                    </div>
                    <div>
                        <p>xtemos@gmail.com</p>
                        <p>(686) 492-1044</p>
                    </div>
                    <button className='w-[40%] bg-orange-400 hover:bg-[#15335D] h-10 font-bold items-center justify-center rounded-md text-white   '>
                        <p >make a route</p>
                    </button>
                </div>
            </div>
            <div className=' flex max-xl:flex-col gap-5  justify-center '>
                <Image src={milanoroom1} alt="milano" />
                <Image src={milanoroom2} alt="milano" />
                <Image src={milanoroom3} alt="milano" />
            </div>



        </div>
    );
}

export default Milanoshowroom;
