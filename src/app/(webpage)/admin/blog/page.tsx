"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";

type Postmain = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  user: { _id: string; username: string;role:string };
  slug: string;
  vadmin: string;
  blogCategory:blogCategory;
  createdAt: Date;
  updatedAt: Date;
};
interface blogCategory{
_id:string;
name:string;
slug:string;
}

const BlogTable: React.FC = () => {
  const [postlist, setpostlist] = useState<Postmain[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setselectedPost] = useState<Postmain | null>(null);

  const blogsPerPage = 5;

  const handleDeleteClick = (blog: Postmain) => {
    setselectedPost(blog);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setselectedPost(null);
  };

  const deleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blog/DeletePost/${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setpostlist((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogId)
      );

      toast.success("Blog deleted successfully!");
    } catch (err: any) {
      toast.error(`Failed to delete blog: ${err.message}`);
    } finally {
      handleClosePopup();
    }
  };

  const updateBlogStatus = async (blogId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/blog/updatePostStatus/${blogId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      setpostlist((prevData) =>
        prevData.map((item) =>
          item._id === blogId ? { ...item, vadmin: newStatus } : item
        )
      );
 
      const data = await response.json();
      console.log("Blog status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update blog status:", error);
      toast.error("Failed to update blog status");
    }
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("/api/blog/ListPostadmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        console.log(data)
        setpostlist(data);
      } catch (err: any) {
        setError(`[Blog_GET] ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Blogs</p>
        <div className="grid grid-cols-2 gap-2 items-center justify-center">
        <Link href="blog/postcategory" className="w-full">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg pl-4 pr-4  h-10">
            CATEGORY BLOG
          </button>
        </Link>
        <Link href="blog/addpost" className="w-full">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg  pl-4 pr-4  h-10">
            Add a new blog
          </button>
        </Link>
        </div>
      </div>
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
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          
          {currentBlogs.map((blog) => (
            <tr key={blog._id} className="bg-white text-black">
               <td className="border px-4 py-2">{blog.title}</td>
               <td className="border px-4 py-2">{blog.blogCategory?.name}</td>
                            <td className="border px-4 py-2">
                <Link href={blog.imageUrl}className="flex justify-center" >
                 <Image src={blog.imageUrl} alt={blog.title} width={30} height={30} />
                </Link>
              </td>
             
             
              <td className="border px-4 py-2">{blog?.user?.username}</td>
              <td className="border px-4 py-2">{blog?.user?.role}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    className={`w-50 text-black rounded-md p-2 ${
                      blog.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={blog.vadmin}
                    onChange={(e) =>
                      updateBlogStatus(blog._id, e.target.value)
                    }
                  >
                    <option value="approve" className="text-white uppercase">
                      Approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not approve
                    </option>
                  </select>
                  <Link href={`/admin/blog/edit/${blog._id}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                      Modify
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(blog)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={selectedPost?._id === blog._id}
                  >
                    {selectedPost?._id === blog._id ? "Processing..." : "DELETE"}
                  </button>

              {blog.blogCategory && <Link
                    href={`/${blog.vadmin === "approve" ? "" : "admin/"}blog/${blog.blogCategory.slug}/${
                      blog.slug
                    }`}
                  >
                    <button className="bg-gray-800 text-white w-36 h-10 hover:bg-gray-600 rounded-md uppercase">
                      See Blog
                    </button>
                  </Link> }
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
      {isPopupOpen && selectedPost && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteBlog}
          id={selectedPost._id}
          name={selectedPost.title}
        />
      )}
    </div>
  );
};

export default BlogTable;
