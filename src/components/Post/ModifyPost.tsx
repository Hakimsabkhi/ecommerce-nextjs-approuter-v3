"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BlogMainSection from "./ModifyPostSections/PostMainSection";
import BlogFirstSubSection from "./ModifyPostSections/PostFirstSubSection";
import { toast } from "react-toastify";

interface SubBlogger {
  title: string;
  description: string;
  imageUrl:string;
  image: File | null;
  
}

interface Blogger {
  title: string;
  description: string;
  imageUrl:string;
  image: File | null;
  blogsecondsubsection: SubBlogger[];
}

const ModifyPost = () => {
  const params = useParams() as { id: string };
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogImagemain, setBlogImagemain] = useState("");
  const route = useRouter();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [category, setCategory] = useState("");
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Function to add a new BlogFirstSubSection
  const addFirstSubSection = () => {
    const newBlogger: Blogger = {
      title: "",
      description: "",
      imageUrl:"",
      image: null,
      blogsecondsubsection: [],
    };
    setBloggers([...bloggers, newBlogger]);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/PostCategory/getAllCategory");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`/api/blog/PostIdForUpdate/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch blog data');
        const data = await response.json();
        // Populate state with fetched data
        setBlogTitle(data.title);
        setBlogDescription(data.description);
        setCategory(data.category);
        setBloggers(data.blogfirstsubsection)
        setBlogImagemain(data.imageUrl)
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchCategories();
    fetchBlogData();
  }, [params.id]);
    
    
  // Function to remove a BlogFirstSubSection by index
  const removeFirstSubSection = (index: number) => {
    const updatedBloggers = [...bloggers];
    updatedBloggers.splice(index, 1); // Remove the blogger at the specified index
    setBloggers(updatedBloggers);
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files)
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
      updatedBloggers[bloggerIndex].blogsecondsubsection[subIndex].image = file;
      setBloggers(updatedBloggers);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate the form data
    const newErrors: { [key: string]: string } = {};
    bloggers.forEach((blogger, index) => {
      if (!blogger.title) {
        newErrors[`blogger${index}Title`] = "Title is required.";
      }
      blogger.blogsecondsubsection.forEach((subBlogger, subIndex) => {
        if (!subBlogger.title) {
          newErrors[`subBlogger${index}${subIndex}Title`] =
            "Sub-Blogger title is required.";
        }
      });
    });
    if (!blogTitle.trim()) newErrors.blogTitle = "Blog title is required";
    if (!blogDescription.trim()) newErrors.blogDescription = "Blog description is required";
    //if (!blogImage) newErrors.blogImage = "Blog image is required";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // Stop if there are errors

    // Submit the valid form data
    const formData = new FormData();
    formData.append("id",params.id);
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
        console.log( blogger.image)
      }
    
      // Append the number of sub-bloggers
      formData.append(
        `bloggers[${index}][subBloggerCount]`,
        blogger.blogsecondsubsection.length.toString()
      );
    
      // Iterate over each sub-blogger and append their data
      blogger.blogsecondsubsection.forEach((subBlogger, subIndex) => {
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
      const response = await fetch("/api/blog/updatePost", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the blog data");
      }

      const result = await response.json();
      console.log("Success:", result);
      // Handle success (e.g., show a notification, clear form, etc.)
      // Optionally reset form state or redirect here
      route.push("/admin/blog")
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
    <div className="container mx-auto mt-4 border-2 p-4 rounded">
      <h1 className="flex justify-center text-3xl font-bold uppercase">Update Blog</h1>
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
            blogImagemain={blogImagemain}
            blogImage={blogImage}
            setBlogImage={setBlogImage}
            errors={errors}
            suggestions={[]}
            category={category}               // Add the current category
            setCategory={setCategory}         // Add the function to set the category
            categories={categories}           // Pass the categories array
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
                handleSubBloggerImageChange={handleSubBloggerImageChange}
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
          <div className="flex justify-end ">
          <button
            type="button"
            onClick={()=>route.push("/admin/blog")}
            className="inline-flex items-center px-4 py-2 text-white bg-gray-500 hover:bg-gray-400 rounded-md mt-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" ml-4 inline-flex items-center px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded-md mt-4"
          >
            Update
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyPost;