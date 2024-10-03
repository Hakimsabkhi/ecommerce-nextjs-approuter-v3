
import React from 'react';
import ProductCard from './Products/ProductPage/ProductCard';


interface Brand {
  _id: string;
  name: string;
}

interface Products {
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
  statuspage:string;
}

// Function to fetch categories data
const fetchProduct = async (): Promise<Products[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/fgetAllProduct`, {
      method: 'GET',
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    }); // Adjust the API endpoint
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Products[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Furniture = async () => {
    const products=await fetchProduct();

    return (
        <div className="desktop  max-md:w-[95%] flex flex-col justify-center items-center gap-10 py-8">
            <div className="flex  w-full flex-col gap-2  items-center   ">
                <h3 className="font-bold text-4xl text-gray-800">Collection of The Promotion</h3>
                            </div>                            
            <div className="grid grid-cols-4  w-full  max-xl:grid-cols-2 group    gap-8  max-md:gap-3">
                {products.map((item, _id) => (
                   item.statuspage === "promotion" && (
                    <ProductCard key={item._id} item={item} />
                  )
                ))}
            </div>                            
        </div>
    );
}

export default Furniture;





