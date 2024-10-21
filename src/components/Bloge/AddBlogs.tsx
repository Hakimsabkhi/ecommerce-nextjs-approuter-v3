"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { toast } from "react-toastify";
import BlogMainSection from "./AddBlogForm/BlogMainSection";
import BlogFirstSubSection from "./AddBlogForm/BlogFirstSubSection";
import BlogSecondSubSection from "./AddBlogForm/BlogSecondSubSection";

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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [category, setCategory] = useState("");
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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/Category/getAllCategory");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    
    fetchCategories();
   
  }, []);
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
    if (!category)newErrors.category = "Blog Category is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // Stop if there are errors

    // Submit the valid form data
    const formData = new FormData();
    formData.append("blogTitle", blogTitle);
    formData.append("blogDescription", blogDescription);
    formData.append("blogCategory", category);
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
        <BlogMainSection
            blogTitle={blogTitle}
            setBlogTitle={setBlogTitle}
            blogDescription={blogDescription}
            setBlogDescription={setBlogDescription}
            handleImageUpload={handleImageUpload}
            blogImage={blogImage}
            setBlogImage={setBlogImage}
            errors={{
              blogTitle: errors.blogTitle,
              blogDescription: errors.blogDescription,
              blogImage: errors.blogImage,
            }}
            suggestions={[]}
            category={category}               // Add the current category
            setCategory={setCategory}         // Add the function to set the category
            categories={categories}           // Pass the categories array
          
          />
          <div className="mt-4">
            {bloggers.map((blogger, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-4 mb-4 relative"
              >
               
               <BlogFirstSubSection
                  index={index}
                  blogger={blogger}
                  bloggers={bloggers}
                  setBloggers={setBloggers}
                  removeBlogger={removeBlogger}
                  handleImageChange={handleImageChange}
                  errors={errors}
                />
              <BlogSecondSubSection
                  index={index}
                  blogger={blogger}
                  bloggers={bloggers}
                  setBloggers={setBloggers}
                  addSubBlogger={addSubBlogger}
                  removeSubBlogger={removeSubBlogger}
                  handleSubBloggerImageChange={handleSubBloggerImageChange}
                  errors={errors}
                />
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
