import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { IoStorefrontOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  rating: number;
 user: {
    _id: string;
    username: string;
  };
  likes:User[]; 
  dislikes:User[];
  createdAt: string;
  updatedAt: string;
}
interface  User{
  _id:string;
  username:string;
  email:string;
}

interface Product {
  _id: string;
  name: string;
 
}

interface ReviewBlockProps {
  productId: string;
  product: Product | null;
  refresh?: boolean; 
}

const fetchReviews = async (productId: string) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const response = await fetch(`/api/review/getAllReviewByProduct?id=${productId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Ensure you return the fetched data
};

const ReviewBlock: React.FC<ReviewBlockProps> = ({ productId, product,refresh }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession() ;
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews(productId);
        setReviews(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, refresh]);
    const handleVote = async (action: 'like' | 'dislike' ,id:string) => {
      if (!session) {
        console.log("User is not logged in");
        return; // Exit the function if the user is not logged in
      } 
      try {
      const formData = new FormData();
      formData.append("action", action);
      const response = await fetch(`/api/review/vote/${id}`, {
        method: 'POST',
       
        body: formData,
      });
 
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      const updatedReviews = await fetchReviews(productId);
      setReviews(updatedReviews);

      
   
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };
  const getDislikeColor = (review:Review) => {
    return review.dislikes.some(user => user.email === session?.user?.email) ? 'red' : 'black';
  };
  const getlikeColor = (review:Review) => {
    return review.likes.some(user => user.email === session?.user?.email) ? 'blue' : 'black';
  };

 
 

  const numberOfReviews = reviews.length;
  



  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 flex items-center justify-between">
        <label htmlFor="review" className="text-lg uppercase">
          {numberOfReviews} reviews for {product?.name}
        </label>
        <select id="review" className="bg-gray-200 border border-gray-300 text-[#525566] rounded-full block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-[#525566] dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option>default</option>
        </select>
      </div>
      {/* bottom */}
      <div className="grid grid-cols-2 max-md:grid-cols-1">
        {reviews.length === 0 ? (
         
           <hr className="h-px w-[200%] bg-gray-200 border-0 dark:bg-gray-700"/>
        
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="w-full max-lg:w-full flex flex-col p-4">
              <div className="flex flex-col gap-8 border-2 border-[#525566] rounded-t-lg px-4 py-8">
                <div className="flex flex-col gap-8">
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold uppercase">{review.name}</p>
                      <p className="text-[#525566]">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-primary flex items-center gap-1">
                      {[...Array(review.rating)].map((_, index) => (
                        <FaStar key={index} />
                      ))}
                      {[...Array(5 - review.rating)].map((_, index) => (
                        <FaStar key={index + review.rating} className="text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#525566]">{review.text}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                  <button  onClick={() => handleVote('like',review._id)}>
                    <AiOutlineLike size={25} color={getlikeColor(review)} />
                    </button>
                    <p className="text-2xl">{review.likes ? review.likes.length : 0}</p>
                  </div>

                  <div className="flex items-center gap-2">
                <button  onClick={() => handleVote('dislike',review._id)}>
                    <AiOutlineDislike size={25} color={getDislikeColor(review)} />
                  </button>
                    <p className="text-2xl">{review.dislikes ? review.dislikes.length : 0}</p>
                  </div>

                </div>
              </div>
    


             {review.user && <div className="flex flex-col border-2 bg-gray-200 border-[#525566] rounded-b-lg px-4 py-8">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    
                    <p className="text-[#525566]"> {new Date(review.updatedAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}</p>
                        <div className="flex items-center gap-2">
                      
                      <p className="text-lg font-bold">{review.user?.username}</p>
                      <IoStorefrontOutline size={30} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-[#525566] text-end">
                   {review?.reply}
                  </p>
                </div>
              </div> }
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewBlock;
