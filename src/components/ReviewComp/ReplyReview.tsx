"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ReviewData {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
interface user {
  _id: string;
  name: string;
}
const ReplyReview: React.FC = () => {
  
  const { review: id } = useParams<{ review?: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [review, setReviewData] = useState<ReviewData>({
    _id: "",
    name: "",
    email: "",
    text: "",
    reply: "",
    user: {
      _id: "",
      username: "",
    },
    createdAt: "",
    updatedAt: "",
  });
  // Move fetchReviewData outside of useEffect so it can be reused
  const fetchReviewData = useCallback(async () => {
    try {
      const response = await fetch(`/api/review/getReviewById/${id}`);
      if (!response.ok) {
        throw new Error("Error fetching review data");
      }
      const data = await response.json();
      setReviewData(data);
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReviewData();
    }
  }, [id, fetchReviewData]);
  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reply = formData.get("reply")?.toString();
    if (reply) {
      try {
        const response = await fetch(`/api/review/updateReviwerById/${id}`, {
          method: "PUT",
         
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error updating review reply");
        }
       
       if (inputRef.current) {
        inputRef.current.value = "";
       
      }
      fetchReviewData();
      
       
      } catch (error) {
        console.error("Error updating review reply:", error);
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
      
    }
  };
  const createdAtDate = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const updatedAtDate = new Date(review.updatedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <div className="top-[20%] p-6 w-[90%] left-[5%] relative">
     <div className="text-center text-xs text-gray-500 leading-none"> {createdAtDate}
      </div>
      <div className="flex w-full  space-x-3 max-w-2xl">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
          <Image
            alt={review.name}
            src={
              "https://res.cloudinary.com/dx499gc6x/image/upload/v1725270570/categories/pcvgp7u9obrtrjzhybsd.webp"
            }
            width={500}
            height={500}
          />
        </div>
        <div>
          <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm">{review.text}</p>
          </div>
          <span className="text-xs p-2 text-gray-500 leading-none">{review.name}</span>
          <span className="text-xs text-gray-500 leading-none">
            {new Date(review.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
     {updatedAtDate !== createdAtDate && review.user && <div className="text-center text-xs text-gray-500 leading-none"> {updatedAtDate} 
      </div>}
      {review?.user && (
        <div className=" flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
          <div>
            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
              <p className="text-sm">{review?.reply}</p>
            </div>
            <span className="text-xs text-gray-500 leading-none">
              {new Date(review.updatedAt).toLocaleTimeString()}
            </span>
            <span className="text-xs p-2 text-gray-500 leading-none">{review?.user?.username}</span>
          </div>
        
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
            {" "}
            <Image
              alt={review?.user?.username}
              src={
                "https://res.cloudinary.com/dx499gc6x/image/upload/v1725270570/categories/pcvgp7u9obrtrjzhybsd.webp"
              }
              width={500}
              height={500}
            />
          </div>

        </div>
      )}
      <div className="bg-gray-300 p-1">
      <form onSubmit={handleReplySubmit} className="bg-gray-300 p-1">
        <input
          ref={inputRef} 
          className=" items-center h-10 w-full rounded px-3 text-sm"
          name="reply"
          type="text"
          placeholder="Type your reply"
          onKeyDown={handleKeyDown}
        />
         </form>
      </div>
    </div>
  );
};

export default ReplyReview;
