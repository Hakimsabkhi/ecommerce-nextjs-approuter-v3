import Image from "next/image";
import React from "react";
import { FaUpload } from "react-icons/fa";

interface BlogMainSectionProps {
  blogTitle: string;
  setBlogTitle: (title: string) => void;
  blogDescription: string;
  blogImagemain: string;
  setBlogDescription: (description: string) => void;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    setBlogImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => void;
  blogImage: File | null;
  setBlogImage: React.Dispatch<React.SetStateAction<File | null>>;
  errors: {
    blogTitle?: string;
    blogDescription?: string;
    blogImage?: string;
    category?: string;
  };
  suggestions: string[];
  category: string;
  setCategory: (category: string) => void;
  categories: Category[];
}
interface Category {
  _id: string;
  name: string;
}

const BlogMainSection: React.FC<BlogMainSectionProps> = ({
  blogTitle,
  setBlogTitle,
  blogDescription,
  blogImagemain,
  setBlogDescription,
  handleImageUpload,
  blogImage,
  setBlogImage,
  errors,
  suggestions,
  category,
  setCategory,
  categories,
}) => {

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="blogTitle"
          className="block text-sm font-medium text-gray-700"
        >
          Blog Title
        </label>
        <input
          type="text"
          id="blogTitle"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.blogTitle ? "border-red-500" : ""
          }`}
          required
          placeholder="Enter blog title"
          aria-describedby="blogTitleError"
        />
        {errors.blogTitle && (
          <p id="blogTitleError" className="mt-2 text-sm text-red-600">
            {errors.blogTitle}
          </p>
        )}
        {suggestions.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setBlogTitle(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <div>
          <label
            htmlFor="Category"
            className="block text-sm font-medium text-gray-700"
          >
            Category{" "}
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.category ? "border-red-500" : ""
            }`}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="blogDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Blog Description
        </label>
        <textarea
          id="blogDescription"
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
          className={`mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.blogDescription ? "border-red-500" : ""
          }`}
          rows={4}
          placeholder="Enter blog description"
          aria-describedby="blogDescriptionError"
        ></textarea>
        {errors.blogDescription && (
          <p id="blogDescriptionError" className="mt-2 text-sm text-red-600">
            {errors.blogDescription}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="blogImage"
          className="block text-sm font-medium text-gray-700"
        >
          Blog Image
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="blogImage"
            onChange={(e) => handleImageUpload(e, setBlogImage)}
            className="sr-only"
            accept="image/*"
            aria-describedby="blogImageError"
          />
          <div className="flex items-center justify-center gap-3">
            <label
              htmlFor="blogImage"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                errors.blogImage ? "border-red-500" : ""
              }`}
            >
              <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
              Upload Image
            </label>
            {blogImage?.type ? (
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(blogImage)}
                alt={blogImage.name}
                className="max-w-full h-auto rounded"
              />
            ) : (
              <Image
                width={100}
                height={100}
                src={blogImagemain}
                alt={""}
                className={`${blogImagemain ? "max-w-full h-auto rounded" : "hidden"}`}
                
              />
            )}
          </div>
        </div>
        {errors.blogImage && (
          <p id="blogImageError" className="mt-2 text-sm text-red-600">
            {errors.blogImage}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogMainSection;
