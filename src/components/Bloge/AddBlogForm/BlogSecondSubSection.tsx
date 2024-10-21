import Image from 'next/image';
import React from 'react';
import { MdClose } from 'react-icons/md';

interface SubBlogger {
  title: string;
  description: string;
  image: File | null;
}

interface BlogSecondSubSectionProps {
  index: number; // Add index to the props
  subBlogger: SubBlogger;
  handleRemove: () => void;
}


const BlogSecondSubSection: React.FC<BlogSecondSubSectionProps> = ({
  index, // Receive the index prop
  subBlogger,
  handleRemove,
}) => {
  return (
    <div className="relative mt-4 border-2 p-4 rounded">
         <h2 className="text-2xl font-semibold text-gray-800"> SubSection {index + 1}</h2>
      {/* Button to remove the second section */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <MdClose size={20} />
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub First Title</label>
        <input
          type="text"
          value={subBlogger.title}
          className="mt-1 block w-full py-2.5 pl-2 rounded-md border-gray-300 shadow-sm"
          placeholder="Enter sub-blogger title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Description</label>
        <textarea
          value={subBlogger.description}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm"
          rows={3}
          placeholder="Enter sub-blogger description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Image</label>
        <input type="file" accept="image/*" className="sr-only" />
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Upload Image
        </label>
        {subBlogger.image && (
          <div className="flex justify-center">
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(subBlogger.image)}
              alt="Sub-Blogger Image Preview"
              className="mt-2 w-fit h-80 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSecondSubSection;
