'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Subtitlesubtitle {
  text: string;
  imageUrl?: string;
  imageFile?: File;
}

interface Subtitle {
  subtitle: string;
  subtitlesubtitles: Subtitlesubtitle[];
  imageUrl?: string;
  imageFile?: File;
}

interface Title {
  _id: string;
  title: string;
  subtitles: Subtitle[];
  imageUrl?: string;
}

export default function UpdateTitlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [titleData, setTitleData] = useState<Title | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchTitle = async () => {
      const response = await fetch(`/api/titles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTitleData(data);
      }
    };

    fetchTitle();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (titleData) {
      setTitleData({
        ...titleData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubtitleImageChange = (e: ChangeEvent<HTMLInputElement>, subtitleIndex: number) => {
    const file = e.target.files?.[0];
    if (titleData && file) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[subtitleIndex].imageFile = file;
      updatedSubtitles[subtitleIndex].imageUrl = URL.createObjectURL(file);
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const handleSubtitlesubtitleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    subtitleIndex: number,
    subsubtitleIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (titleData && file) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].imageFile = file;
      updatedSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].imageUrl = URL.createObjectURL(file);
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const handleSubtitleChange = (index: number, value: string) => {
    if (titleData) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[index].subtitle = value;
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const handleSubtitlesubtitleChange = (subtitleIndex: number, subsubtitleIndex: number, value: string) => {
    if (titleData) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].text = value;
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const addSubtitle = () => {
    if (titleData) {
      setTitleData({
        ...titleData,
        subtitles: [...titleData.subtitles, { subtitle: '', subtitlesubtitles: [], imageUrl: '' }],
      });
    }
  };

  const addSubtitlesubtitle = (subtitleIndex: number) => {
    if (titleData) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[subtitleIndex].subtitlesubtitles.push({ text: '', imageUrl: '' });
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const deleteSubtitle = (subtitleIndex: number) => {
    if (titleData) {
      const updatedSubtitles = titleData.subtitles.filter((_, index) => index !== subtitleIndex);
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const deleteSubtitlesubtitle = (subtitleIndex: number, subsubtitleIndex: number) => {
    if (titleData) {
      const updatedSubtitles = [...titleData.subtitles];
      updatedSubtitles[subtitleIndex].subtitlesubtitles = updatedSubtitles[subtitleIndex].subtitlesubtitles.filter(
        (_, index) => index !== subsubtitleIndex
      );
      setTitleData({ ...titleData, subtitles: updatedSubtitles });
    }
  };

  const handleSaveUpdate = async () => {
    if (titleData) {
      // Step 1: Delete old main image if a new one is uploaded
      if (newImage && titleData.imageUrl) {
        await fetch(`/api/deleteImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: titleData.imageUrl }),
        });
      }

      // Step 2: Upload main image if selected
      let uploadedImageUrl = titleData.imageUrl || '';
      if (newImage) {
        const formData = new FormData();
        formData.append('file', newImage);
        const uploadResponse = await fetch(`/api/uploadImage`, {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        uploadedImageUrl = uploadData.url;
      }

      // Step 3: Handle subtitle and subtitlesubtitle images
      const updatedSubtitles = await Promise.all(
        titleData.subtitles.map(async (subtitle) => {
          let subtitleImageUrl = subtitle.imageUrl;
          if (subtitle.imageFile) {
            const formData = new FormData();
            formData.append('file', subtitle.imageFile);
            const response = await fetch('/api/uploadImage', { method: 'POST', body: formData });
            const data = await response.json();
            subtitleImageUrl = data.url;
          }

          const updatedSubtitlesubtitles = await Promise.all(
            subtitle.subtitlesubtitles.map(async (subsubtitle) => {
              let subsubtitleImageUrl = subsubtitle.imageUrl;
              if (subsubtitle.imageFile) {
                const formData = new FormData();
                formData.append('file', subsubtitle.imageFile);
                const response = await fetch('/api/uploadImage', { method: 'POST', body: formData });
                const data = await response.json();
                subsubtitleImageUrl = data.url;
              }
              return { text: subsubtitle.text, imageUrl: subsubtitleImageUrl };
            })
          );

          return { subtitle: subtitle.subtitle, imageUrl: subtitleImageUrl, subtitlesubtitles: updatedSubtitlesubtitles };
        })
      );

      // Step 4: Update the title with new data
      const response = await fetch(`/api/titles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...titleData, imageUrl: uploadedImageUrl, subtitles: updatedSubtitles }),
      });

      if (response.ok) {
        router.push('/');
      }
    }
  };

  if (!titleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Title</h1>

      <input
        type="text"
        name="title"
        value={titleData.title}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Main Title"
      />

      {/* Main Title Image */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">Main Title Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <Image src={previewUrl} alt="New Image Preview" width={128} height={128} className="object-cover rounded-md" />}
        {titleData.imageUrl && !previewUrl && <Image src={titleData.imageUrl} alt="Current Image" width={128} height={128} className="object-cover rounded-md" />}
      </div>

      {/* Subtitles and Subtitlesubtitles */}
      {titleData.subtitles.map((subtitle, subtitleIndex) => (
        <div key={subtitleIndex} className="border p-4 rounded-md mb-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={subtitle.subtitle}
              onChange={(e) => handleSubtitleChange(subtitleIndex, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              placeholder={`Subtitle ${subtitleIndex + 1}`}
            />
            <button
              type="button"
              onClick={() => deleteSubtitle(subtitleIndex)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>

          <input type="file" accept="image/*" onChange={(e) => handleSubtitleImageChange(e, subtitleIndex)} />
          {subtitle.imageUrl && <Image src={subtitle.imageUrl} alt="Subtitle Image" width={64} height={64} className="rounded-md" />}

          {/* Subtitlesubtitles */}
          {subtitle.subtitlesubtitles.map((subsubtitle, subsubtitleIndex) => (
            <div key={subsubtitleIndex} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={subsubtitle.text}
                onChange={(e) => handleSubtitlesubtitleChange(subtitleIndex, subsubtitleIndex, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={`Subtitlesubtitle ${subsubtitleIndex + 1}`}
              />

              <input type="file" accept="image/*" onChange={(e) => handleSubtitlesubtitleImageChange(e, subtitleIndex, subsubtitleIndex)} />
              {subsubtitle.imageUrl && <Image src={subsubtitle.imageUrl} alt="Subtitlesubtitle Image" width={32} height={32} className="rounded-md" />}

              <button
                type="button"
                onClick={() => deleteSubtitlesubtitle(subtitleIndex, subsubtitleIndex)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSubtitlesubtitle(subtitleIndex)}
            className="mt-2 text-blue-500 hover:text-blue-700 font-semibold"
          >
            Add Subtitlesubtitle
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubtitle}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
      >
        Add Subtitle
      </button>

      <button onClick={handleSaveUpdate} className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 mt-4">Save Changes</button>
      <button onClick={() => router.push('/')} className="px-4 py-2 bg-red-500 text-white rounded-md mt-4">Cancel</button>
    </div>
  );
}
