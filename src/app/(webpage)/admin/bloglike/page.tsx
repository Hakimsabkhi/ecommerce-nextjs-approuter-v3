"use client";
import { comment } from "@/assets/image";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface blog {
  _id: string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  blogCategory: blogCategory;
  imageUrl: string;
  user: User;
  numbercomment: number;
  createdAt: string;
}
interface User {
  _id: string;
  username: string;
}
interface blogCategory {
  _id: string;
  name: string;
}
interface comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
  };
  likes: User[];
  createdAt: string;
}
interface User {
  _id: string;
  username: string;
  email: string;
}
const page = () => {
  const [postlist, setpostlist] = useState<blog[]>([]);

 
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const blogsPerPage = 5;
  const filteredBlogs = useMemo(() => {
    return postlist.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, postlist]);

  const currentBlogs = useMemo(() => {
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    return filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  }, [currentPage, filteredBlogs, blogsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBlogs.length / blogsPerPage);
  }, [filteredBlogs.length, blogsPerPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/comments/getbolgcomments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setpostlist(data); // Assuming data is an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  console.log(postlist);
  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold pt-4 ">List blog comment</h1>
        <input
        type="text"
        placeholder="Search blogs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <table className="table-auto w-full mt-4 uppercase">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">ImageURL</th>

            <th className="px-4 py-2">Author</th>
           
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog) => (
            <tr key={blog._id} className="bg-white text-black">
              <td className="border px-4 py-2">{blog.title}</td>
              <td className="border px-4 py-2">{blog.blogCategory?.name}</td>
              <td className="border px-4 py-2">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[100px] relative">
                  {" "}
                  {/* Set a desired height for the div */}
                  <Link href={blog.imageUrl}>
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      quality={100}
                      layout="fill" // Makes image fill the container
                      objectFit="cover" // Ensures image covers the div without stretching/distorting
                      className="rounded-xl" // Optional: rounded corners on the image
                    />
                  </Link>
                </div>
              </td>

              <td className="border px-4 py-2">{blog?.user?.username}</td>

              <td className="border px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/bloglike/${blog._id}`} className="bg-gray-600 p-6 rounded-md text-white hover:bg-gray-500">
                            {blog.numbercomment} Comments
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default page;
