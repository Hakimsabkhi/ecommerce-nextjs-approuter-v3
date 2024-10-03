"use client";
import React, { useState, MouseEvent } from "react";
import Image from "next/image";
import { star } from "@/assets/image";
import { IoCheckboxOutline } from "react-icons/io5";

import Head from "next/head";
import ProductQ from "./ProductQ";

import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../../store/cartSlice";
import { RootState } from "../../../store";
import { toast } from "react-toastify";

const noimage =
  "https://res.cloudinary.com/dx499gc6x/image/upload/v1723623372/na_mma1mw.webp";

interface Product {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  brand?: Brand; // Make brand optional
  stock: number;
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
}

interface Brand {
  _id: string;
  place: string;
  name: string;
  imageUrl: string;
}
interface FirstBlockProps {
  product: Product | null;
}
const FirstBlock: React.FC<FirstBlockProps> = ({ product }) => {
  const [count, setCount] = useState<number>(0);
  const [mainImage, setMainImage] = useState<string>(
    product?.imageUrl || noimage
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.imageUrl || noimage
  );
  const hasNoImages =
    Array.isArray(product?.images) && product.images.length === 0;
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  const handleImageClick = (image: string) => {
    setMainImage(image); // Set the clicked image as the main image
    setSelectedImage(image); // Set the selected image
  };

  const increment = () => setCount(count + 1);
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };
  const items = useSelector((state: RootState) => state.cart.items);
  console.log(items);
  const dispatch = useDispatch();
 
  const addToCartHandler = (product: Product, quantity: number) => {
     // Ensure dispatch is available
  
    // Dispatch the action with item and quantity
    dispatch(addItem({ item: product, quantity }));
  
    // Show success notification
    toast.success(`${product.name} added to cart with quantity ${quantity}!`);
  };
  return (
    <>
      <Head>
        <link rel="preload" as="image" href={product?.imageUrl || noimage} />
      </Head>
      <main className="w-full bg-white pb-10 pt-20 flex justify-center">
        {product ? (
          <div className="flex gap-10 max-2xl:flex-col w-[80%] max-lg:w-[95%] max-lg:h-[1062px] items-center">
            <div className="relative w-[50%] gap-2 pb-5 items-center">
              <div
                className="relative w-[500px] h-[500px] overflow-hidden cursor-zoom-in	"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={mainImage}
                  alt={product.name || "Product image"}
                  layout="fill"
                  objectFit="cover"
                  loading="eager"
                  className="transition-transform duration-300 ease-in-out"
                />
                {isZoomed && (
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: "200%",
                      backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                      transform: "scale(1.5)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <div className="flex gap-8 max-sm:justify-around">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer max-md:w-[30%] max-sm:w-[20%] ${
                        selectedImage === image
                          ? "border-2 border-[#15335D]"
                          : ""
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                        layout="responsive" // Ensures the image scales correctly
                        width={500} // Example width, can be adjusted
                        height={500} // Example height, can be adjusted
                        style={{ objectFit: "cover", height: "50%" }} // Adjust height to 50% of parent container
                      />
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              className={`flex flex-col ${
                hasNoImages ? "w-[50%]" : "w-full"
              } gap-5`}
            >
              <p className="text-3xl font-bold">{product.name}</p>
              <div className="flex gap-4 items-center">
                <p className="flex items-center font-bold">
                  SKU <span className="text-[#525566]">: {product.ref}</span>
                </p>
                <p className="text-[#525566] font-bold flex items-center gap-2">
                  <IoCheckboxOutline size={25} /> {product.status}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex gap-1">
                  <Image
                    className="size-4 max-md:size-4"
                    src={star}
                    alt="star"
                  />
                  <Image
                    className="size-4 max-md:size-4"
                    src={star}
                    alt="star"
                  />
                  <Image
                    className="size-4 max-md:size-4"
                    src={star}
                    alt="star"
                  />
                  <Image
                    className="size-4 max-md:size-4"
                    src={star}
                    alt="star"
                  />
                  <Image
                    className="size-4 max-md:size-4"
                    src={star}
                    alt="star"
                  />
                </div>
                <p>(2 customer reviews)</p>
              </div>
              <p>{product.info}</p>

              <ProductQ product={product} addToCartHandler={addToCartHandler} />
            </div>
          </div>
        ) : (
          <div className="h-[465.59px] max-lg:h-[1062px]"></div>
        )}
      </main>
    </>
  );
};

export default FirstBlock;
