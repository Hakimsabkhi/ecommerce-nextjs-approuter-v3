import React from "react";
import ProductCard from "./Products/ProductPage/ProductCard";

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
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products/fgetAllProduct`
    ); // Adjust the API endpoint
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: Products[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Sellers: React.FC = async () => {
  const products = await fetchProduct();

  return (
    <div className="desktop max-md:w-[95%] flex flex-col justify-center items-center gap-10 py-8">
      <div className="flex w-full flex-col sm:flex-row items-center justify-between">
        <h3 className="font-bold text-4xl text-[#525566] font-poppins">
          Weekly bestsellers
        </h3>
      </div>
      <div className="grid grid-cols-4 w-full max-md:grid-cols-2 group max-xl:grid-cols-3 gap-8 max-md:gap-3">
        {products.map((item, _id) => (
          item.statuspage==="home-page" &&<ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sellers;
