
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { SlBag } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import CartModal from "../CartModal";
import { luxehome } from "@/assets/image";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import Total from "./Total";

interface Category {
  id: string;
  name: string;
  logoUrl: string;
}

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const cartmodalRef = React.useRef<HTMLDivElement>(null);
  const items = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  //for search
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  // Toggle cart modal with useCallback for performance optimization
  const toggleCartModal = React.useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // Handle clicks outside the cart modal
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartmodalRef.current &&
        !cartmodalRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (items) {
      // Ensure items is defined and calculate total quantity
      const quantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, [items]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Call the API whenever the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const res = await fetch(
          `/api/searchProduct?searchTerm=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error searching for products:", error);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `/api/searchProduct?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setProducts(data.products); // Update products state with the search results
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };
  const handleLinkClick = () => {
    setSearchTerm(''); // Clear the search term
    
  };
  return (
    
      <div className="flex w-[80%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page">
          <div>
            <Image
              width={250}
              height={250}
              className="h-auto lg:w-[400px] xl:w-[300px] rounded-[5px] max-lg:hidden"
              src={luxehome}
              alt="Luxe Home logo"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <div className="relative w-[800px]">
          <input
            className="w-full h-12 px-4 py-2 rounded-full max-lg:hidden border border-gray-300"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products"
            aria-label="Search for products"
          />
          <button
            className="absolute h-full px-4 group right-0 top-1/2 -translate-y-1/2 rounded-r-full text-[#15335D]"
            aria-label="Search"
            onClick={handleSearch}
          >
            <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
          </button>
          {/* Display results */}
          {products.length > 0 && (
            <ul className="absolute top-14 w-full bg-white shadow-lg rounded-lg z-50">
              {products.map((product: any) => (
                <li
                  key={product._id}
                  className="p-4 border-b"
                >
                  <Link href={`/${product.category.name}/${product._id}`} 
                    onClick={handleLinkClick}
                  className=" gap-2 flex items-center justify-start font-bold text-[25px]">
                  {/* Product Image */}
                  <Image
                    width={50}
                    height={50}
                    src={product.imageUrl}
                    alt={product.name}
                    className="rounded-md"
                  />

                  {/* Product Name */}
                  <span className="ml-4">{product.name}</span>

                  {/* Product Price & Discount */}
                  <span className="ml-auto text-[20px] text-gray-500">
                    {product.discount ? (
                      <>
                        {/* Show discounted price */}
                        <span className="line-through mr-2 text-red-500">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-green-500">
                          $
                          {(
                            (product.price * (100 - product.discount)) /
                            100
                          ).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      // Show regular price if no discount
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4 w-[200px] text-white">
          <FiHeart size={25} />
          <div className="relative" ref={cartmodalRef}>
            <div className="relative cursor-pointer" onClick={toggleCartModal}>
              <SlBag size={25} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
                <p>{totalQuantity}</p>
              </span>
            </div>
            {isCartOpen && items.length > 0 && <CartModal items={items} />}
          </div>

          <Total items={items} />
        </div>
      </div>
  
  );
};

export default Header;
