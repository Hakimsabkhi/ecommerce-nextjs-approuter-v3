import React from 'react';
import Image from 'next/image';
import { aboutbrand,facebook,linkedin,pinterest,aboutchair,abouttable,aboutarmchair,aboutstorage, } from '@/assets/image';
//import {Product} from '@/assets/data'; // Ensure the path is correct
interface Product {
    _id: string;
    name: string;
    description: string;
    ref: string;
    price: number;
    imageUrl?: string;
    brand?: Brand; // Make brand optional
    stock: number;
    discount?: number;
    color?: string;
    material?: string;
    status?: string;
  }
  
  interface Brand {
    _id: string;
    place:string;
    name: string;
    imageUrl:string;
  }
const ThirdBlock: React.FC<{ product: Product | null }> = ({ product }) => {
    return (
        <main className=' desktop max-lg:w-[95%] my-10 bg-white rounded-lg flex max-lg:flex-col justify-between '>
        {product?(
            <div className="flex max-lg:flex-col gap-20">
                <div className="w-[50%] max-lg:w-full flex flex-col justify-between gap-4">
                    <div className="relative w-full pb-[100%]"> {/* Square container */}
                        {product.brand?.imageUrl ? (
                        <Image
                            className="absolute inset-0 w-full h-full object-cover"
                            src={product.brand.imageUrl}
                            alt={product.brand.name || "Brand Image"}
                            fill
                        />
                        ) : (
                        <p className="absolute  inset-0 flex items-center justify-center">No brand image available</p>
                        )}
                    </div>
                </div>
                <div className='w-[50%] max-lg:w-full flex flex-col gap-8  justify-center'>
                    <div className="flex max-md:flex-col items-center justify-between">
                        <p className="text-3xl  uppercase">{product.brand?.name}</p>
                        <div className="flex items-center gap-3">
                            <p className="text-[#525566]">Share:</p>    
                            <Image src={facebook} alt="facebook"  />    
                            <Image src={linkedin} alt="linkedin"  />    
                            <Image src={pinterest} alt="pinterest"  />
                            <button className="text-white bg-primary hover:bg-[#15335D] h-10 w-[40%] px-4 font-bold  rounded-md">
                                <p>contact us</p>
                            </button>
                        </div>                    
                    </div>
                    <p>{product.brand?.place}</p>
                    <p className="text-[#525566]">The company reinterprets tradition by calling upon international designers to work with them and developing new technologies and materials to guarantee innovative and surprising results. Passion is the engine that drives the brand – together with its renowned creatives and high-profile collaborators – to search for original solutions using advanced materials, methods, tools, and technologies.</p>
                    <div className="flex items-center justify-around">
                        <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center">
                            <Image  src={aboutchair} alt="pinterest"  />
                        </div>
                        <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center">
                            <Image  src={abouttable}  alt="pinterest"  />
                        </div>
                        <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center">
                            <Image  src={aboutarmchair} alt="pinterest"  />
                        </div>
                        <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center">
                            <Image  src={aboutstorage} alt="pinterest"  />
                        </div>
                    </div>
                    <p className="text-[#525566]">Nordic design inspires HAY&apos;s taste for clean lines, simple geometric shapes, and quality materials like wood, metal, and textiles. Anyway, you still use Lorem Ipsum and rightly so, as it will always have a place in the web workers toolbox.</p>
                </div>       
            </div>
        ):
            (<div className="h-[840px]"></div>)
        }
            
        </main>
    );
}

export default ThirdBlock;
