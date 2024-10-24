"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BlogMainSection from "./AddBlogForm/BlogMainSection";
import BlogFirstSubSection from "./AddBlogForm/BlogFirstSubSection";

interface Blogger {
  title: string;
  description: string;
  image: File | null;
  subBloggers: BlogSecondSubSection[]; // Ensure subBloggers is used properly here
}

interface BlogSecondSubSection {
  title: string;
  description: string;
  image: File | null;
  blogthirdsubsection: BlogThirdSubSection[]; // Add blogthirdsubsection here if needed
}

interface BlogThirdSubSection {
  title: string;
  description: string;
  image: File | null;
}


const AddBlogs = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const route = useRouter();

  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Function to add a new BlogFirstSubSection
  const addFirstSubSection = () => {
    const newBlogger: Blogger = {
      title: "",
      description: "",
      image: null,
      subBloggers: [],
    };
    setBloggers([...bloggers, newBlogger]);
  };

  // Function to remove a BlogFirstSubSection by index
  const removeFirstSubSection = (index: number) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers.splice(index, 1); // Remove the blogger at the specified index
    setBloggers(updatedBloggers);
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const updatedBloggers = [...bloggers];
      updatedBloggers[index].image = file;
      setBloggers(updatedBloggers);
    }
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validation and form submission logic here
  };

  return (
    <div className="container mx-auto mt-4 border-2 p-4 rounded">
      <div className="">
        <h2 className="text-2xl font-semibold text-gray-800">Main Blog Section</h2>
        <form onSubmit={handleSubmit}>
          {/* Main Blog Section */}
          <BlogMainSection
            blogTitle={blogTitle}
            setBlogTitle={setBlogTitle}
            blogDescription={blogDescription}
            setBlogDescription={setBlogDescription}
            handleImageUpload={(e, setter) => setter(e.target.files?.[0] || null)}
            blogImage={blogImage}
            setBlogImage={setBlogImage}
            errors={errors}
            suggestions={[]}
          />

          {/* Dynamically render all BlogFirstSubSection components */}
          {bloggers.map((blogger, index) => (
            <div key={index}>
              <BlogFirstSubSection
                index={index}
                blogger={blogger}
                bloggers={bloggers}
                setBloggers={setBloggers}
                removeBlogger={() => removeFirstSubSection(index)} // Remove the specific section
                handleImageChange={handleImageChange}
                errors={errors}
              />
            </div>
          ))}

          {/* Button to add new First SubSection */}
          <button
            type="button"
            onClick={addFirstSubSection}
            className="inline-flex items-center px-4 py-2 text-white bg-gray-500 hover:bg-gray-400 rounded-md mt-4"
          >
            Add First Section
          </button>

          <button
            type="submit"
            className=" ml-4 inline-flex items-center px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
