
import React from 'react';
import Image from 'next/image';


export default function Banner() {
    /* const totalImages = slideData.length;
    const currentSlide = slideData[page - 1]; */

    return (
        <div className="relative md:h-[600px] bg-white rounded shadow-lg mb-6">
            <Image
                className="w-full md:h-full rounded shadow-lg bg-white"
                fill
                style={{ objectFit: 'cover' }} 
                alt="banner"
                src='https://res.cloudinary.com/dx499gc6x/image/upload/v1723913588/pic3_pssxyx.png' // This assumes `pic3` is the image you want to display
                sizes="(max-width: 900px) 400px, 900px"
                loading="eager"
                decoding="async"
            />
        </div>
    );
}
