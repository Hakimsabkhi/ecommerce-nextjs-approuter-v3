import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface blogthirdsubsection {
  title: string;
  description: string;
  image: File | null;
}

interface BlogThirdSubSectionProps {
  index: number;
  subBlogger: blogthirdsubsection;
  handleRemove: () => void;
}

const toLetterSequence = (num: number): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";

  if (num < 1 || num > letters.length) {
    return ""; // Return an empty string for out-of-bounds numbers
  }

  return letters[num - 1];
};

const BlogThirdSubSection: React.FC<BlogThirdSubSectionProps> = ({
  index,
  subBlogger,
  handleRemove,
}) => {
  const [currentSubBlogger, setCurrentSubBlogger] = useState<blogthirdsubsection>(subBlogger);

  useEffect(() => {
    setCurrentSubBlogger(subBlogger);
  }, [subBlogger]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Optional chaining for clarity
    setCurrentSubBlogger(prev => ({ ...prev, image: file }));
  };

  return (
    <div className="relative mt-4 border-2 p-4 rounded">
      <h2 className="text-2xl font-semibold text-gray-800">SubSection {toLetterSequence(index + 1)}</h2>
      
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
          value={currentSubBlogger.title}
          onChange={(e) => setCurrentSubBlogger(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full py-2.5 pl-2 rounded-md border-gray-300 shadow-sm"
          placeholder="Enter sub-blogger title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Description</label>
        <textarea
          value={currentSubBlogger.description}
          onChange={(e) => setCurrentSubBlogger(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm"
          rows={3}
          placeholder="Enter sub-blogger description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Image</label>
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
        </label>
        
        {currentSubBlogger.image && (
          <div className="flex justify-center">
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(currentSubBlogger.image)}
              alt="Sub-Blogger Image Preview"
              className="mt-2 w-fit h-80 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogThirdSubSection;

