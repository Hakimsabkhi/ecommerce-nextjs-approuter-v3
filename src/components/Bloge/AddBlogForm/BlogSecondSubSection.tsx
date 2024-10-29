import Image from 'next/image';
import React from 'react';
import { MdClose } from 'react-icons/md';

interface SubBlogger {
  title: string;
  description: string;
  image: File | null;
}

interface BlogSecondSubSectionProps {
  index: number;
  firstindex:number;
  subBlogger: SubBlogger;
  handleRemove: () => void;
  updateSubBloggerField: (subIndex: number, field: 'title' | 'description', value: string) => void;
  handleSubBloggerImageChange: (index: number, subIndex: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const BlogSecondSubSection: React.FC<BlogSecondSubSectionProps> = ({
  index,
  firstindex,
  subBlogger,
  handleRemove,
  updateSubBloggerField,
  handleSubBloggerImageChange,
  errors,
}) => {
  return (
    <div className="relative mt-4 border-2 p-4 rounded">
      <h2 className="text-2xl font-semibold text-gray-800">SubSection {index + 1}</h2>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <MdClose size={20} />
      </button>

      <div>
        <label
           htmlFor={`subBlogger${firstindex}${index}Title`}
        className="block text-sm font-medium text-gray-700">Sub First Title</label>
        <input
          type="text"
          value={subBlogger.title}
          onChange={(e) => updateSubBloggerField(index, 'title', e.target.value)}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors[`subBlogger${firstindex}${index}Title`]
              ? "border-red-500"
              : ""
          }`}
          placeholder="Enter sub-blogger title"
          aria-describedby={`subBlogger${firstindex}${index}TitleError`}
        />
        {errors[`subBlogger${firstindex}${index}Title`] && (
          <p
            id={`subBlogger${firstindex}${index}TitleError`}
            className="mt-2 text-sm text-red-600"
          >
            {errors[`subBlogger${firstindex}${index}Title`]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Description</label>
        <textarea
          value={subBlogger.description}
          onChange={(e) => updateSubBloggerField(index, 'description', e.target.value)}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm"
          rows={3}
          placeholder="Enter sub-blogger description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sub Blogger Image</label>
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <input type="file" onChange={(e) => handleSubBloggerImageChange(firstindex,index, e)} accept="image/*" className="sr-only" />
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