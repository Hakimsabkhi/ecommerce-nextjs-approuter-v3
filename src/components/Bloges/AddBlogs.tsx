"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaPlus, FaUpload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

// Define TypeScript interfaces for better type safety
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

const AddBlogs = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const route=useRouter();
  const [bloggers, setBloggers] = useState<Blogger[]>([
    {
      title: "",
      description: "",
      image: null,
      subBloggers: [{ title: "", description: "", image: null }],
    },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const updatedBloggers = [...bloggers];
      updatedBloggers[index].image = file;
      setBloggers(updatedBloggers);
    }
  };

  const handleSubBloggerImageChange = (
    bloggerIndex: number,
    subIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const updatedBloggers = [...bloggers];
      updatedBloggers[bloggerIndex].subBloggers[subIndex].image = file;
      setBloggers(updatedBloggers);
    }
  };

  const addBlogger = () => {
    setBloggers([
      ...bloggers,
      {
        title: "",
        description: "",
        image: null,
        subBloggers: [{ title: "", description: "", image: null }],
      },
    ]);
  };

  const removeBlogger = (index: number) => {
    const updatedBloggers = bloggers.filter((_, i) => i !== index);
    setBloggers(updatedBloggers);
  };

  const addSubBlogger = (index: number) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index].subBloggers.push({
      title: "",
      description: "",
      image: null,
    });
    setBloggers(updatedBloggers);
  };

  const removeSubBlogger = (index: number, subIndex: number) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers[index].subBloggers.splice(subIndex, 1);
    setBloggers(updatedBloggers);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate the form data
    const newErrors: { [key: string]: string } = {};
    bloggers.forEach((blogger, index) => {
      if (!blogger.title) {
        newErrors[`blogger${index}Title`] = "Title is required.";
      }
      blogger.subBloggers.forEach((subBlogger, subIndex) => {
        if (!subBlogger.title) {
          newErrors[`subBlogger${index}${subIndex}Title`] =
            "Sub-Blogger title is required.";
        }
      });
    });
    if (!blogTitle.trim()) newErrors.blogTitle = "Blog title is required";
    if (!blogDescription.trim()) newErrors.blogDescription = "Blog description is required";
    if (!blogImage) newErrors.blogImage = "Blog image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // Stop if there are errors

    // Submit the valid form data
    const formData = new FormData();
    formData.append("blogTitle", blogTitle);
    formData.append("blogDescription", blogDescription);
    if (blogImage) formData.append("blogImage", blogImage);
  
    bloggers.forEach((blogger, index) => {
      // Append blogger's title
      formData.append(`bloggers[${index}][title]`, blogger.title);
    
      // Append blogger's description, defaulting to an empty string if not provided
      formData.append(
        `bloggers[${index}][description]`,
        blogger.description || ""
      );
    
      // Append blogger's image if it exists
      if (blogger.image) {
        formData.append(`bloggers[${index}][image]`, blogger.image);
      }
    
      // Append the number of sub-bloggers
      formData.append(
        `bloggers[${index}][subBloggerCount]`,
        blogger.subBloggers.length.toString()
      );
    
      // Iterate over each sub-blogger and append their data
      blogger.subBloggers.forEach((subBlogger, subIndex) => {
        formData.append(
          `bloggers[${index}][subBloggers][${subIndex}][title]`,
          subBlogger.title
        );
        formData.append(
          `bloggers[${index}][subBloggers][${subIndex}][description]`,
          subBlogger.description || ""
        );
    
        // Append sub-blogger's image if it exists
        if (subBlogger.image) {
          formData.append(
            `bloggers[${index}][subBloggers][${subIndex}][image]`,
            subBlogger.image
          );
        }
      });
    });
    
    // Append the total number of bloggers
    formData.append("bloggerCount", bloggers.length.toString());
    
    try {
      const response = await fetch("/api/blog/PostBlog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the blog data");
      }

      const result = await response.json();
      console.log("Success:", result);
      // Handle success (e.g., show a notification, clear form, etc.)
      // Optionally reset form state or redirect here
      route.push("/admin/bloglist/")
    } catch (error) {
      toast.error('title blog exists')
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    }
  };
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file); // Set the File object directly
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">Add Blogs</h2>
        <form onSubmit={handleSubmit}>
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
                <p
                  id="blogDescriptionError"
                  className="mt-2 text-sm text-red-600"
                >
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
                  {blogImage && (
                    <Image
                      width={100}
                      height={100}
                      src={URL.createObjectURL(blogImage)}
                      alt={blogImage.name}
                      className="max-w-full h-auto rounded"
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
          <div className="mt-4">
            {bloggers.map((blogger, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-4 mb-4 relative"
              >
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
                      errors[`blogger${index}Title`] ? "border-red-500" : ""
                    }`}
                    placeholder="Enter blogger title"
                    aria-describedby={`blogger${index}TitleError`}
                  />
                  {errors[`blogger${index}Title`] && (
                    <p
                      id={`blogger${index}TitleError`}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors[`blogger${index}Title`]}
                    </p>
                  )}
                </div>
                <label htmlFor={`blogger${index}Description`} className="block text-sm font-medium text-gray-700">Blogger Description</label>
                <textarea
                  id={`blogger${index}Description`}
                  value={blogger.description}
                  onChange={(e) => {
                    const updatedBloggers = [...bloggers];
                    updatedBloggers[index].description = e.target.value;
                    setBloggers(updatedBloggers);
                  }}
                  className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${errors[`blogger${index}Description`] ? 'border-red-500' : ''}`}
                  placeholder="Enter blogger description"
                  aria-describedby={`blogger${index}DescriptionError`}
                />
                {errors[`blogger${index}Description`] && <p id={`blogger${index}DescriptionError`} className="mt-2 text-sm text-red-600">{errors[`blogger${index}Description`]}</p>}

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
                      className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 `}
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
              </div>
            ))}
          </div>
            <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addBlogger}
            className="mt-4 inline-flex items-center px-4 py-2 text-white bg-gray-500 hover:bg-gray-400 rounded-md"
          >
            <FaPlus className="mr-2" />
            Add Blogger
          </button>

          <button
            type="submit"
            className="mt-4 inline-flex items-center px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md"
          >
            Submit
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
