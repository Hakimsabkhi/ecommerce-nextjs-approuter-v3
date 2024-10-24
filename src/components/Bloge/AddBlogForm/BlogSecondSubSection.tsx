import Image from 'next/image';
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaPlus, FaUpload } from 'react-icons/fa';
import BlogThird from './BlogThirdSubSection';


interface BlogSecondSubSection {
  title: string;
  description: string;
  image: File | null;
  blogthirdsubsection: BlogThirdSubSection[];
}

interface BlogThirdSubSection {
  title: string;
  description: string;
  image: File | null;
}
interface BlogSecondSubSectionProps {
  index: number;
  
  handleRemove: () => void;
  currentSubBlogger:BlogSecondSubSection;
  setCurrentSubBlogger: React.Dispatch<React.SetStateAction<BlogSecondSubSection>>;
  handleImageSecondChange:(e: React.ChangeEvent<HTMLInputElement>) =>void;
  removeThirdSubSection:(subIndex: number)=>void;
  currentSubThirdBlogger:BlogThirdSubSection;
  handleImageThirdChange:(e: React.ChangeEvent<HTMLInputElement>) =>void;
  handleTitleThirdChange:(e: React.ChangeEvent<HTMLInputElement>) =>void;
  handleDescriptionThirdChange:(e: React.ChangeEvent<HTMLTextAreaElement>) =>void;
  addThirdSubSection:() =>void;
}

const BlogSecondSubSection: React.FC<BlogSecondSubSectionProps> = ({
  index,
 
  handleRemove,
  currentSubBlogger,
  setCurrentSubBlogger,
  handleImageSecondChange,
  removeThirdSubSection,
  currentSubThirdBlogger,
  handleImageThirdChange,
  handleTitleThirdChange,
  handleDescriptionThirdChange,
  addThirdSubSection,



}) => {
  
  return (
    <div className="relative mt-4 border-2 p-4 rounded">
      <h2 className="text-2xl font-semibold text-gray-800">
        SubSection {index + 1}
      </h2>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <MdClose size={20} />
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sub First Title
        </label>
        <input
          type="text"
          value={currentSubBlogger.title}
          onChange={(e) => setCurrentSubBlogger((prev) => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full py-2.5 pl-2 rounded-md border-gray-300 shadow-sm"
          placeholder="Enter sub-blogger title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sub Blogger Description
        </label>
        <textarea
          value={currentSubBlogger.description}
          onChange={(e) => setCurrentSubBlogger((prev) => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm"
          rows={3}
          placeholder="Enter sub-blogger description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sub Blogger Image
        </label>
        
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
          Upload Image
          <input type="file" accept="image/*"    onChange={handleImageSecondChange} className="sr-only" />
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

      {currentSubBlogger.blogthirdsubsection.map((subBloggerItem, subSecondIndex) => (
        <BlogThird
          key={subSecondIndex}
          index={subSecondIndex}
          handleRemove={() => removeThirdSubSection(subSecondIndex)}
          handleImageThirdChange={handleImageThirdChange}
     handleTitleThirdChange={handleTitleThirdChange}
     handleDescriptionThirdChange={handleDescriptionThirdChange}
     currentSubThirdBlogger={currentSubThirdBlogger}

        />
      ))}

      <button
        type="button"
        onClick={addThirdSubSection}
        className="mt-4 inline-flex items-center px-4 py-2 text-white bg-gray-500 hover:bg-gray-400 rounded-md"
      >
        <FaPlus className="mr-2" />
        Add Third Section
      </button>
    </div>
  );
};

export default BlogSecondSubSection;
