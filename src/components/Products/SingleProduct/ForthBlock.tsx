"use client";
import React, { FormEvent, useRef, useState } from "react";
import ReviewBlock from "./ReviewBlock";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useParams } from "next/navigation";
import {  toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Product {
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
  place: string;
  name: string;
  imageUrl: string;
}

interface user {
  username: string;
}

const ForthBlock: React.FC<{ product: Product | null }> = ({ product }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [saveInfo, setSaveInfo] = useState<boolean>(false);
  const params = useParams<{ id?: string }>(); // Adjust params based on your route setup
  const productId = params.id ?? "";
  const { data: session } = useSession();
  const [key, setKey] = useState(0);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalName = name || session?.user?.name || '';
    const finalEmail = email || session?.user?.email || '';

    const reviewData = new FormData();
    reviewData.append("rating", rating.toString());
    reviewData.append("text", review);
    reviewData.append("email", finalEmail);
    reviewData.append("name", finalName);
    reviewData.append("product", productId);
    try {
      const response = await fetch("/api/review/postReviewByProduct", {
          method: "POST",
          body: reviewData,
      });

      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      setName('');
    setEmail('');
    setReview('');
    setRating(0);
    setSaveInfo(false);
      toast.success("Review submitted successfully!");

      // Force re-render by changing key
      setKey(prevKey => prevKey + 1);
  } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Do not add two reviews");
  }
};
  return (
    <main className=" desktop max-lg:w-[95%] my-10 bg-white rounded-lg flex flex-col gap-20  ">
      {/* top */}
      <div className="flex max-lg:flex-col justify-between">
        <div className="w-[50%] max-lg:w-full flex flex-col  gap-8 p-4">
          <div>
            <p className="text-xl ">Customer Review</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-4xl font-bold">{/* {product.rating} */}5</p>
            <div className="text-primary flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <p className="text-[#525566] text-sm">2 reviews</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className=" flex items-center gap-2">
              <div className="flex gap-1 items-center text-primary">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="w-full bg-primary rounded-full h-2.5 dark:bg-gray-700"></div>
              <p className="text-[#525566]">2</p>
            </div>
            <div className=" flex items-center gap-2">
              <div className="flex gap-1 items-center text-primary">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStar />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
              <p className="text-[#525566]">0</p>
            </div>
            <div className=" flex items-center gap-2">
              <div className="flex gap-1 items-center text-primary">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStar />
                <FaRegStar />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
              <p className="text-[#525566]">0</p>
            </div>
            <div className=" flex items-center gap-2">
              <div className="flex gap-1 items-center text-primary">
                <FaStar />
                <FaStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
              <p className="text-[#525566]">0</p>
            </div>
            <div className=" flex items-center gap-2">
              <div className="flex gap-1 items-center text-primary">
                <FaStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"></div>
              <p className="text-[#525566]">0</p>
            </div>
          </div>
        </div>
        <div className="w-[50%] max-lg:w-full p-4 ">
          <div className="flex flex-col  gap-5">
            <p className="text-xl">ADD A REVIEW</p>
            <p className="text-[#525566]">
              Your email adress will not be published. Required fields are
              marked *
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 h-[516px]">
              <div className="flex items-center gap-3">
                <p>Your rating:</p>
                <div className="text-primary flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      onClick={() => setRating(index + 1)}
                      className={`cursor-pointer ${
                        index < rating ? "text-primary" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-4">
                <label>Your review:</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-40 px-2.5 py-3"
                  placeholder=""
                  required
                />
              </label>

           {!session &&   (
            <div>
              <label className="flex flex-col gap-2">
                <label>Name:</label>
                <input
                
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <label>Email:</label>
                <input
                
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                  required
                />
              </label>
              </div>
            )}

              <label className="flex items-center gap-1">                
                <input
                  
                  type="checkbox"
                  checked={saveInfo}
                  onChange={() => setSaveInfo(!saveInfo)}
                  className="w-5 h-5 rounded bg-[#525566]"
                />
                <p className="font-bold">
                  Save my name, email, and website in this browser for the next
                  time I comment.
                </p>
              </label>

              <button
                type="submit"
                className="text-white bg-primary hover:bg-[#15335D] h-10 w-[20%] font-bold rounded-md"
              >
                Submit
              </button>
             
            </form>
          </div>
        </div>
      </div>
      {/* mid */}
     <ReviewBlock product={product} productId={productId} key={key} /> 
    </main>
  );
};

export default ForthBlock;
