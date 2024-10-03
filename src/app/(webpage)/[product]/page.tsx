import React from 'react';
import Products from '@/components/Products';
import Chairsbanner from '@/components/Chairsbanner';

import { ICategory } from '@/models/Category';
import { notFound } from 'next/navigation';

interface HomePageProps {
  params: {
    product?: string;
  };
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand: brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status
  ?: string;
}
interface brand{
_id:string;
name:string;
}

// Function to fetch category data by ID
const fetchCategoryData = async (id: string): Promise<ICategory | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/searchcategory/${id}` , {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    })
    if (!res.ok) {
     console.log('Category not found');
     return notFound();
    }
    const data: ICategory = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return notFound();
  }
};

// Function to fetch products data by category ID
const fetchProductsData = async (id: string): Promise<ProductData[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/search/${id}`, {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    }) // Adjust the API endpoint
    if (!res.ok) {
      throw new Error('Products not found');
    }
    const data: ProductData[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products data:', error);
    return [];
  }
};

// Function to fetch brand data
const fetchBrandData = async (): Promise<brand[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/brand/getAllBrand`, {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    })// Adjust the API endpoint
    if (!res.ok) {
      throw new Error('Brand not found');
    }
    const data: brand[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return [];
  }
};

export default async function HomePage({ params }: HomePageProps) {
  const id = params?.product;
  const category = id ? await fetchCategoryData(id) : null;
  const products = id ? await fetchProductsData(id) : [];
  const brand = await fetchBrandData();

  return (
    <div>
      <Chairsbanner category={category || undefined} />
      {/* Uncomment the following line to render products */}
      <Products products={products} brands={brand} /> 
    </div>
  );
}
