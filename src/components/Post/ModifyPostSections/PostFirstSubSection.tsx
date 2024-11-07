import Image from 'next/image';
import React, { useState } from 'react';
import { FaUpload, FaPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import BlogSecondSubSection from './PostSecondSubSection';

interface Blogger {
  title: string;
  description: string;
  imageUrl:string;
  image: File | null;
  blogsecondsubsection: blogsecondsubsection[];
}

interface blogsecondsubsection {
  title: string;
  description: string;
  imageUrl:string;
  image: File | null;
}

interface BlogFirstSubSectionProps {
  index: number;
  blogger: Blogger;
  bloggers: Blogger[];
  setBloggers: React.Dispatch<React.SetStateAction<Blogger[]>>;
  removeBlogger: () => void;
  handleImageChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubBloggerImageChange: (index: number, subIndex: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const toRoman = (num: number): string => {
  const romanNumerals: { [key: number]: string } = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    20: "XX",
    30: "XXX",
    40: "XL",
    50: "L",
    60: "LX",
    70: "LXX",
    80: "LXXX",
    90: "XC",
    100: "C",
  };

  let roman = "";
  const digits = [100, 90, 50, 40, 10, 9, 5, 4, 1];

  for (let i = 0; i < digits.length; i++) {
    while (num >= digits[i]) {
      roman += romanNumerals[digits[i]];
      num -= digits[i];
    }
  }

  return roman;
};


const BlogFirstSubSection: React.FC<BlogFirstSubSectionProps> = ({
  index,
  blogger,
  bloggers,
  setBloggers,
  removeBlogger,
  handleImageChange,
  handleSubBloggerImageChange,
  errors,
}) => {

  // Function to add a BlogSecondSubSection (SubBlogger)
  const addSecondSubSection = () => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index].blogsecondsubsection.push({
      title: '',
      description: '',
      imageUrl:'',
      image: null,
    });
    setBloggers(updatedBloggers);
  };

  // Function to remove a BlogSecondSubSection
  const removeSecondSubSection = (subIndex: number) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index].blogsecondsubsection.splice(subIndex, 1);
    setBloggers(updatedBloggers);
  };

  const updateBloggerField = (field: 'title' | 'description', value: string) => {
    setBloggers((prevBloggers) => {
      const updatedBloggers = [...prevBloggers];
      updatedBloggers[index][field] = value;
      return updatedBloggers;
    });
  };

  const updateSubBloggerField = (
    subIndex: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index].blogsecondsubsection[subIndex][field] = value;
    setBloggers(updatedBloggers);
  };

  return (
    <div className="relative mt-4 border-2 p-4 rounded">
    <h2 className="text-2xl font-semibold text-gray-800">  Section {toRoman(index + 1)}</h2>
      {/* Button to remove the first section */}
      <button
        type="button"
        onClick={removeBlogger}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <MdClose size={20} />
      </button>

      <div>
        <label
        htmlFor={`blogger${index}Title`}
        className="block text-sm font-medium text-gray-700">Title {toRoman(index + 1)}</label>
        <input
          type="text"
          value={blogger.title}
          onChange={(e) => updateBloggerField('title', e.target.value)}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            errors[`blogger${index}Title`] ? 'border-red-500' : ''
          }`}
          aria-describedby={`blogger${index}TitleError`}
        />
        {errors[`blogger${index}Title`] && (
          <p id={`blogger${index}TitleError`} className="mt-2 text-sm text-red-600">
            {errors[`blogger${index}Title`]}
          </p>
        )}

      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description {toRoman(index + 1)}</label>
        <textarea
          value={blogger.description}
          onChange={(e) => updateBloggerField('description', e.target.value)}
          className="mt-1 block w-full pl-2 pt-1 rounded-md border-gray-300 shadow-sm"
          rows={4}
          placeholder="Enter blogger description"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Blogger Image</label>
        
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <input type="file" onChange={(e) => handleImageChange(index, e)} className="sr-only" />
          <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
          Upload Image
        </label>
        {blogger.image?.type? (
          <div className="mt-2">
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(blogger.image)}
              alt="Blogger Image Preview"
              className="max-w-full h-auto rounded"
            />
          </div>):(
            <div className="mt-2">
            <Image
              width={100}
              height={100}
              src={blogger.imageUrl}
              alt="Blogger Image Preview"
              className={`${blogger.imageUrl ? "max-w-full h-auto rounded" : "hidden"}`}
            />
          </div>
          )
        }
      </div>

      {/* Dynamically render BlogSecondSubSection */}
     {blogger.blogsecondsubsection.map((subBlogger, subIndex) => (
  <BlogSecondSubSection
  key={subIndex}
  firstindex={index}
  index={subIndex}
  subBlogger={subBlogger}
  handleRemove={() => removeSecondSubSection(subIndex)}
  updateSubBloggerField={updateSubBloggerField}
  handleSubBloggerImageChange={handleSubBloggerImageChange}
  errors={errors}
/>
))} 
      {/* Button to add new Second SubSection */}
      <button
        type="button"
        onClick={addSecondSubSection}
        className="mt-4 inline-flex items-center px-4 py-2 text-white bg-gray-500 hover:bg-gray-400 rounded-md"
      >
        <FaPlus className="mr-2" />
        Add Second Section
      </button>
    </div>
  );
};

export default BlogFirstSubSection;