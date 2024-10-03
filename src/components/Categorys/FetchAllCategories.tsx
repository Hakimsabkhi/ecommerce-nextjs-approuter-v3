"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import { flag } from "@/assets/image";
import LoadingSpinner from "../LoadingSpinner";
import Pagination from "../Pagination";

type Category = {
  _id: string;
  name: string;
  imageUrl: string;
  logoUrl: string;
  user:user;
  createdAt: Date;
  updatedAt: Date;
};
interface user{
_id:string;
username:string;
}

const AddedCategories: React.FC = () => {
  const [addedCategory, setAddedCategory] = useState<Category[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const categoriesPerPage = 5; // Number of categories to display per page
  const [loading, setLoading] = useState(true);
  const [selectedCatgory, setSelectedCatgory] = useState({ id: "", name: "" });
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const handleDeleteClick = (Category: Category) => {
    setLoadingCategoryId(Category._id); 
    setSelectedCatgory({ id: Category._id, name: Category.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCategoryId(null);
  };

  const DeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/category/deleteCategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Refresh categories after deletion
    
      handleClosePopup();
      getCategory();
      toast.success("Category delete successfully!");
    } catch (err: any) {
      /*  setError(`[Category_DELETE] ${err.message}`);
          setError(`Error: ${err.message}`); */
      toast.error("faild Category_DELETE");
    }finally {
      setLoadingCategoryId(null);
    }
  };

  const getCategory = async () => {
    try {
      const response = await fetch("/api/category/getAllCategory");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setAddedCategory(data);
      setFilteredCategory(data);
    } catch (err: any) {
      setError(`[Category_GET] ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const filtered = addedCategory.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, addedCategory]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategory.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategory.length / categoriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      /* loading start */
     <LoadingSpinner/>
      /*  loading end  */
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL categories</p>

        <Link href="categorylist/addcategory" className="w-[15%]">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-full h-10">
            Add a new category
          </button>
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search categories"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <table className="table-auto w-full mt-4 uppercase">
        <thead>
          <tr className="bg-gray-800 ">
            <th className=" px-4 py-2 ">Icon</th>
            <th className=" px-4 py-2 ">ImageURL</th>
            <th className="px-4 py-2  ">Name</th>
            <th className=" px-4 py-2"> Created By</th>
            <th className="px-4 text-center py-2"> Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((item, index) => (
            <tr key={index} className="bg-white text-balck">
              <td className="border px-4 py-2 ">
                <Image src={item.logoUrl} width={30} height={30} alt="icon" />
              </td>
              <td className="border px-4 py-2"><Link href={item.imageUrl}>{item.imageUrl.split('/')[item.imageUrl.split('/').length - 1]}</Link></td>
              <td className="border px-4 py-2">{item.name}</td>

              <td className="border px-4 py-2">{item?.user?.username}</td>
              <td>
               
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/admin/categorylist/${item._id}`}>
                    <button className="bg-gray-800 text-white w-28 h-10  hover:bg-gray-600 rounded-md">
                      Modify
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingCategoryId === item._id}
                  >
                    {loadingCategoryId ===item._id ? "Processing..." : "DELETE"}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteCategory}
                      id={selectedCatgory.id}
                      name={selectedCatgory.name}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        
      <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
  );
};

export default AddedCategories;
