import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface BlogThirdSubSection {
  title: string;
  description: string;
  image: File | null;
}
interface BlogThirdSubSectionProps {
  index: number;
  handleRemove: () => void;
  handleImageThirdChange: (e: React.ChangeEvent<HTMLInputElement>)=>void;
  handleTitleThirdChange: (e: React.ChangeEvent<HTMLInputElement>)=>void;
  handleDescriptionThirdChange: (e: React.ChangeEvent<HTMLTextAreaElement>)=>void;
  currentSubThirdBlogger:BlogThirdSubSection
}

const toLetterSequence = (num: number): string => {
  const letters: string = "abcdefghijklmnopqrstuvwxyz";
  if (num < 1 || num > letters.length) {
    return "";
  }
  return letters[num - 1];
};

const BlogThirdSubSection: React.FC<BlogThirdSubSectionProps> = ({
  index,
  handleRemove,
  handleImageThirdChange,
  handleTitleThirdChange,
  handleDescriptionThirdChange,
  currentSubThirdBlogger
}) => {
  
  return (
    <div className="relative mt-4 border-2 p-4 rounded">
      <h2 className="text-2xl font-semibold text-gray-800"> SubSection {toLetterSequence(index + 1)}</h2>
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
          value={currentSubThirdBlogger.title}
          onChange={handleTitleThirdChange}
          className="mt-1 block w-full py-2.5 pl-2 rounded-md border-gray-300 shadow-sm"
          placeholder="Enter sub-blogger title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Description</label>
        <textarea
          value={currentSubThirdBlogger.description}
          onChange={handleDescriptionThirdChange}
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
          <input type="file" accept="image/*" onChange={handleImageThirdChange} className="sr-only" />
        </label>

        {currentSubThirdBlogger.image && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(currentSubThirdBlogger.image)}
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
