import Image from 'next/image';
import React from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface Blogger {
  title: string;
  description: string;
  image?: File | null;
}

interface BlogFirstSubSectionProps {
  index: number;
  blogger: Blogger;
  bloggers: Blogger[];
  setBloggers: React.Dispatch<React.SetStateAction<Blogger[]>>;
  removeBlogger: (index: number) => void;
  handleImageChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const BlogFirstSubSection: React.FC<BlogFirstSubSectionProps> = ({
  index,
  blogger,
  bloggers,
  setBloggers,
  removeBlogger,
  handleImageChange,
  errors,
}) => {
  const updateBloggerField = (field: 'title' | 'description', value: string) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index][field] = value;
    setBloggers(updatedBloggers);
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => removeBlogger(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Remove blogger"
      >
        <MdClose size={20} />
      </button>

      <div>
        <label
          htmlFor={`blogger${index}Title`}
          className="block text-sm font-medium text-gray-700"
        >
          Blogger Title
        </label>
        <input
          type="text"
          id={`blogger${index}Title`}
          value={blogger.title}
          onChange={(e) => {
            const updatedBloggers = [...bloggers];
            updatedBloggers[index].title = e.target.value;
            setBloggers(updatedBloggers);
          }}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors[`blogger${index}Title`] ? 'border-red-500' : ''
          }`}
          placeholder="Enter blogger title"
          aria-describedby={`blogger${index}TitleError`}
        />
        {errors[`blogger${index}Title`] && (
          <p id={`blogger${index}TitleError`} className="mt-2 text-sm text-red-600">
            {errors[`blogger${index}Title`]}
          </p>
        )}

        <label htmlFor={`blogger${index}Description`} className="block text-sm font-medium text-gray-700">
          Blogger Description
        </label>
        <textarea
          id={`blogger${index}Description`}
          value={blogger.description}
          onChange={(e) => {
            const updatedBloggers = [...bloggers];
            updatedBloggers[index].description = e.target.value;
            setBloggers(updatedBloggers);
          }}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors[`blogger${index}Description`] ? 'border-red-500' : ''
          }`}
          placeholder="Enter blogger description"
          aria-describedby={`blogger${index}DescriptionError`}
        />
        {errors[`blogger${index}Description`] && (
          <p id={`blogger${index}DescriptionError`} className="mt-2 text-sm text-red-600">
            {errors[`blogger${index}Description`]}
          </p>
        )}

        <div>
          <label
            htmlFor={`blogger${index}Image`}
            className="block text-sm font-medium text-gray-700"
          >
            Blogger Image
          </label>
          <input
            type="file"
            id={`blogger${index}Image`}
            accept="image/*"
            onChange={(e) => handleImageChange(index, e)}
            className="sr-only"
          />
          <label
            htmlFor={`blogger${index}Image`}
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
            Upload Image
          </label>
          {blogger.image && (
            <div className="flex justify-center">
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(blogger.image)}
                alt="Blogger Image Preview"
                className="mt-2 w-fit h-80 rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogFirstSubSection;
