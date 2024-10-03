"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaEye, FaCartPlus, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useParams } from 'next/navigation'; // Use 'next/navigation' for Next.js App Router
import{star } from '@/assets/image';
import ProductCard from '../ProductPage/ProductCard';
const noimage ='https://res.cloudinary.com/dx499gc6x/image/upload/v1723623372/na_mma1mw.webp';
interface ProductData {
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
  place: string;
  name: string;
  imageUrl: string;
}

const FifthBlock: React.FC = () => {
  const params = useParams<{ product?: string }>(); // Adjust params based on your route setup
  const categoryId = params.product; // Safe access
  const [products, setProducts] = useState<ProductData[]>([]);
  const [clickedStates, setClickedStates] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const response = await fetch(`/api/search/${categoryId}`);
          const data = await response.json();
          setProducts(data);
          setClickedStates(new Array(data.length).fill(false)); // Initialize clickedStates based on product length
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleClick = (index: number) => {
    setClickedStates(prevStates =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  const firstFourProducts = products.slice(0, 4);
    return (
        <main className='max-lg:hidden desktop bg-white py-10 flex justify-center '>
            <div className="grid grid-cols-5 w-full h-[481px] max-md:grid-cols-2 group  max-xl:grid-cols-3  gap-8  max-md:gap-3">
                {firstFourProducts.map((item, index) => (
                    <ProductCard key={item._id} item={item} />
                ))}
            </div>
        </main>
    );
}

export default FifthBlock;
