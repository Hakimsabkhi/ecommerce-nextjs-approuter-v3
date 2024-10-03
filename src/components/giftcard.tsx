import React from 'react';
import { giftcard1, giftcard2 } from "@/assets/image";
import Image from 'next/image';
import {cards} from "@/assets/data";
import { CiShop, CiShoppingCart,CiUser } from "react-icons/ci";
const Giftcard = () => {
    return (
        <div className='py-8 desktop  max-lg:w-[95%] gap-16 justify-center items-center flex flex-col     '>
            <div className='flex gap-6  w-full justify-between max-lg:flex-col'>
                {cards.map((card,index) => (
                    <div key={index} className='gap-8 flex flex-col items-center'>
                        <div className='relative w-fit '>
                            <div className='absolute flex-col items-center flex top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white '>
                                <p className='text-xl max-lg:text-sm opacity-50'>LUXEHOME</p>
                                <p className='text-4xl max-lg:text-xl  '>{card.name}</p>
                            </div>
                            <Image className='w-[800px]' src={card.src} alt="giftcard" />
                        </div>
                        <div className='flex-col flex items-center justify-center gap-1'>
                            <p className='text-gray-400 max-lg:text-center'>{card.text1}</p>
                            <p className='text-xl max-lg:text-center'>{card.text2}</p>                            
                            <button className="bg-orange-400 hover:bg-[#15335D] rounded-md font-bold  w-28 h-10  items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white  ">
                                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-y-[-100%] ease  ">Buy now</p>
                                <CiShoppingCart  size={25} className="  text-white absolute flex items-center justify-center w-full h-full duration-300 -translate-y-[-100%] lg:group-hover/box:translate-y-0 ease  " aria-hidden="true" fill="currentColor"/>                                                                                                                    
                            </button>
                        </div>
                    </div>
                ))}                              
            </div>
            <div className='flex-col justify-center w-full items-center  gap-2 flex '>
                <p className='text-xl max-lg:text-center'>If you can&apos;t decide on the perfect gift, let them choose with the LUXEHOME gift card</p>
                <div className='text-gray-400 flex-col   '>
                    <p className='max-lg:text-center'>The luxehome Gift Card is easy! just pick the value of the card and your friends or family are free to get exactly what they want it&apos;s perfect for.</p>
                    <p className='justify-center flex max-lg:text-center'>graduations,holidays,back to college shopping, baby showers, weddings and house warming gifts. available in increments of €5-€1000.</p>
                </div>
            </div>
        </div>
    );
}

export default Giftcard;
