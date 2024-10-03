"use client";
import React, { useEffect, useState } from 'react';

import AddedProducts from '@/components/Products/FetchAllProducts';
interface User {
    _id: string;
    username: string;
}
type Product = {
    _id: string;
    name: string;
    description: string;
    ref: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
    user: User; // Reference to a User document or User ID
    discount: number;
    status:string;
    statuspage: string;
    createdAt: Date;
    updatedAt: Date;
};

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products/getAllProduct');
                const data = await response.json();
                setProducts(data); // Assuming response.data is an array of products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        
        fetchProducts();
    }, []);

    return (
        <div>
            <AddedProducts products={products} />
        </div>
    );
};

export default Page;
