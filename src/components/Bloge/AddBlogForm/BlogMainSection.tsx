import Image from 'next/image';
import React from 'react';
import { FaUpload } from 'react-icons/fa';

interface BlogMainSectionProps {
  blogTitle: string;
  setBlogTitle: (title: string) => void;
  blogDescription: string;
  setBlogDescription: (description: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, setBlogImage: React.Dispatch<React.SetStateAction<File | null>>) => void;
  blogImage: File | null;
  setBlogImage: React.Dispatch<React.SetStateAction<File | null>>;
  errors: { [key: string]: string };
  suggestions: string[];
}

const BlogMainSection: React.FC<BlogMainSectionProps> = ({
  blogTitle,
  setBlogTitle,
  blogDescription,
  setBlogDescription,
  handleImageUpload,
  blogImage,
  setBlogImage,
  errors,
  suggestions,
}) => {
  return (
    <div className="space-y-4">
      {/* Blog Title */}
      <div>
        <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700">
          Blog Title
        </label>
        <input
          type="text"
          id="blogTitle"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className={`mt-1 block w-full pl-2 py-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors.blogTitle ? 'border-red-500' : ''
          }`}
          placeholder="Enter blog title"
        />
      </div>

      {/* Blog Description */}
      <div>
        <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-700">
          Blog Description
        </label>
        <textarea
          id="blogDescription"
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
          placeholder="Enter blog description"
        ></textarea>
      </div>

      {/* Blog Image */}
      <div>
        <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700">
          Blog Image
        </label>
        <input
          type="file"
          id="blogImage"
          onChange={(e) => handleImageUpload(e, setBlogImage)}
          className="sr-only"
        />
        <label
          htmlFor="blogImage"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
          Upload Image
        </label>
        {blogImage && (
          <Image
            width={100}
            height={100}
            src={URL.createObjectURL(blogImage)}
            alt="Blog Image Preview"
            className="mt-2 max-w-full h-auto rounded"
          />
        )}
      </div>
    </div>
  );
};

export default BlogMainSection;
