import Image from 'next/image';
import React from 'react'
import { FaPlus, FaUpload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
interface SubBlogger {
    title: string;
    description: string;
    image: File | null;
  }
  
interface Blogger {
  title: string;
  description: string;
  image: File | null;
  subBloggers: SubBlogger[];
}
  interface BlogSecondSubSectionProps {
    index: number;
    blogger: Blogger;
  bloggers: Blogger[];
  setBloggers: React.Dispatch<React.SetStateAction<Blogger[]>>;
    addSubBlogger: (index: number) => void;
    removeSubBlogger: (index: number, subIndex: number) => void;
    handleSubBloggerImageChange: (index: number, subIndex: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
  }
  
  const BlogSecondSubSection: React.FC<BlogSecondSubSectionProps> = ({
    index,
    blogger,
    bloggers,
    setBloggers,
    addSubBlogger,
    removeSubBlogger,
    handleSubBloggerImageChange,
    errors,
  }) => {
  return (
    <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Add Sub-Bloggers
                  </h3>
                  <button
                    type="button"
                    onClick={() => addSubBlogger(index)}
                    className="flex items-center text-gray-500 hover:text-gray-600"
                  >
                    <FaPlus className="mr-1" />
                    Add Sub-Blogger
                  </button>
                  {blogger.subBloggers.map((subBlogger, subIndex) => (
                    <div
                      key={subIndex}
                      className="border border-gray-200 rounded-md p-4 mt-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeSubBlogger(index, subIndex)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        aria-label="Remove sub-blogger"
                      >
                        <MdClose size={20} />
                      </button>
                      <div>
                        <label
                          htmlFor={`subBlogger${index}${subIndex}Title`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sub-Blogger Title
                        </label>
                        <input
                          type="text"
                          id={`subBlogger${index}${subIndex}Title`}
                          value={subBlogger.title}
                          onChange={(e) => {
                            const updatedSubBloggers = [
                              ...bloggers[index].subBloggers,
                            ];
                            updatedSubBloggers[subIndex].title = e.target.value;
                            const updatedBloggers = [...bloggers];
                            updatedBloggers[index].subBloggers =
                              updatedSubBloggers;
                            setBloggers(updatedBloggers);
                          }}
                          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                            errors[`subBlogger${index}${subIndex}Title`]
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Enter sub-blogger title"
                          aria-describedby={`subBlogger${index}${subIndex}TitleError`}
                        />
                        {errors[`subBlogger${index}${subIndex}Title`] && (
                          <p
                            id={`subBlogger${index}${subIndex}TitleError`}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors[`subBlogger${index}${subIndex}Title`]}
                          </p>
                        )}
                      </div>
                      <label htmlFor={`subBlogger${index}${subIndex}Description`} className="block text-sm font-medium text-gray-700">Sub-Blogger Description</label>
                      <textarea
                        id={`subBlogger${index}${subIndex}Description`}
                        value={subBlogger.description}
                        onChange={(e) => {
                          const updatedBloggers = [...bloggers];
                          updatedBloggers[index].subBloggers[subIndex].description = e.target.value;
                          setBloggers(updatedBloggers);
                        }}
                        className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors[`subBlogger${index}${subIndex}Description`] ? 'border-red-500' : ''}`}
                        placeholder="Enter sub-blogger description"
                        aria-describedby={`subBlogger${index}${subIndex}DescriptionError`}
                      />
                      {errors[`subBlogger${index}${subIndex}Description`] && <p id={`subBlogger${index}${subIndex}DescriptionError`} className="mt-2 text-sm text-red-600">{errors[`subBlogger${index}${subIndex}Description`]}</p>}
                      <div>
                        <label
                          htmlFor={`subBlogger${index}${subIndex}Image`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sub-Blogger Image
                        </label>
                        <input
                          type="file"
                          id={`subBlogger${index}${subIndex}Image`}
                          accept="image/*"
                          onChange={(e) =>
                            handleSubBloggerImageChange(index, subIndex, e)
                          }
                          className="sr-only"
                          />
                           <label
                              htmlFor={`subBlogger${index}${subIndex}Image`}
                              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 `}
                            >
                              <FaUpload className="mr-2 h-5 w-5 text-gray-400" />
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
                  ))}
                </div>
  )
}

export default BlogSecondSubSection