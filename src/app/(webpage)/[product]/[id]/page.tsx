import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Products/SingleProduct/SecondBlock";
import ThirdBlock from "@/components/Products/SingleProduct/ThirdBlock";
import ForthBlock from "@/components/Products/SingleProduct/ForthBlock";
import FifthBlock from "@/components/Products/SingleProduct/FifthBlock";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  info:string;
  ref: string;
  price: number;
  imageUrl?: string;
  images?: string [];
  brand?: Brand; // Make brand optional
  stock: number;
  dimensions?:string;
  discount?: number;
  warranty?:number;
  weight?:number;
  color?: string;
  material?: string;
  status?: string;
}

interface Brand {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
}

interface User {
  username: string;
}

interface PageProps {
  product: ProductData ;
}

// Fetch product data on the server
 async function getProduct(id: string): Promise<ProductData> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}api/products/fgetProductById/${id}`
    , {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    })
  if (!res.ok) {
    console.log("Product not found");
    notFound();
  }
  const data: ProductData = await res.json();
  return data;
}


// Fetch the product data during server-side rendering
export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound(); // Redirects to a 404 page if the product is not found
  }

  return (
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
      <ThirdBlock product={product} />
      <ForthBlock product={product} />
      <FifthBlock />
    </div>
  );
};


