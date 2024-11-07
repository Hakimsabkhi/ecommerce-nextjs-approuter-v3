'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

interface Subtitlesubtitle {
  text: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Subtitle {
  subtitle: string;
  subtitlesubtitles: Subtitlesubtitle[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Title {
  title: string;
  subtitles: Subtitle[];
  imageUrl?: string;
}

function AddTitle() {
  const [title, setTitle] = useState<string>('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titlesList, setTitlesList] = useState<Title[]>([]);

  // Add a new subtitle
  const addSubtitleField = () => {
    setSubtitles([...subtitles, { subtitle: '', subtitlesubtitles: [], imageUrl: '' }]);
  };

  const deleteSubtitleField = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  const addSubtitlesubtitleField = (subtitleIndex: number) => {
    const newSubtitles = [...subtitles];
    newSubtitles[subtitleIndex].subtitlesubtitles.push({ text: '', imageUrl: '' });
    setSubtitles(newSubtitles);
  };

  const deleteSubtitlesubtitleField = (subtitleIndex: number, subsubtitleIndex: number) => {
    const newSubtitles = [...subtitles];
    newSubtitles[subtitleIndex].subtitlesubtitles = newSubtitles[subtitleIndex].subtitlesubtitles.filter(
      (_, i) => i !== subsubtitleIndex
    );
    setSubtitles(newSubtitles);
  };

  const handleSubtitleChange = (index: number, value: string) => {
    const newSubtitles = [...subtitles];
    newSubtitles[index].subtitle = value;
    setSubtitles(newSubtitles);
  };

  const handleSubtitlesubtitleChange = (subtitleIndex: number, subsubtitleIndex: number, value: string) => {
    const newSubtitles = [...subtitles];
    newSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].text = value;
    setSubtitles(newSubtitles);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubtitleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSubtitles = [...subtitles];
      newSubtitles[index].imageUrl = URL.createObjectURL(file);
      newSubtitles[index].imageFile = file; // Temporarily store file for upload
      setSubtitles(newSubtitles);
    }
  };

  const handleSubtitlesubtitleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    subtitleIndex: number,
    subsubtitleIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSubtitles = [...subtitles];
      newSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].imageUrl = URL.createObjectURL(file);
      newSubtitles[subtitleIndex].subtitlesubtitles[subsubtitleIndex].imageFile = file; // Temporarily store file for upload
      setSubtitles(newSubtitles);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadResponse.json();
    return uploadData.url;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    // Upload the main title image
    const uploadedImageUrl = image ? await uploadImage(image) : '';
  
    // Upload images for each subtitle and subtitlesubtitle
    const updatedSubtitles = await Promise.all(
      subtitles.map(async (subtitle) => {
        const subtitleImageUrl = subtitle.imageFile ? await uploadImage(subtitle.imageFile) : subtitle.imageUrl;
        const updatedSubtitlesubtitles = await Promise.all(
          subtitle.subtitlesubtitles.map(async (subsubtitle) => {
            const subsubtitleImageUrl = subsubtitle.imageFile
              ? await uploadImage(subsubtitle.imageFile)
              : subsubtitle.imageUrl;
            return {
              text: subsubtitle.text,
              imageUrl: subsubtitleImageUrl,
            };
          })
        );
        return {
          subtitle: subtitle.subtitle,
          imageUrl: subtitleImageUrl,
          subtitlesubtitles: updatedSubtitlesubtitles,
        };
      })
    );
  
    // Prepare the final data without `imageFile`
    const dataToSend = {
      title,
      imageUrl: uploadedImageUrl,
      subtitles: updatedSubtitles,
    };
  
    // Send data to backend
    const response = await fetch('/api/titles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
  
    if (response.ok) {
      const savedTitle = await response.json();
      setTitlesList([...titlesList, savedTitle.data]);
      setTitle('');
      setSubtitles([]);
      setImage(null);
      setPreviewUrl(null);
    } else {
      console.error("Failed to save the title data");
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Main Title"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Main Title Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Main Title Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <Image src={previewUrl} alt="Image preview" width={128} height={128} className="object-cover rounded-md" />
          )}
        </div>

        {/* Subtitles */}
        {subtitles.map((subtitleItem, subtitleIndex) => (
          <div key={subtitleIndex} className="border p-4 rounded-md space-y-2 bg-gray-50">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={subtitleItem.subtitle}
                onChange={(e) => handleSubtitleChange(subtitleIndex, e.target.value)}
                placeholder={`Subtitle ${subtitleIndex + 1}`}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => deleteSubtitleField(subtitleIndex)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>

            {/* Subtitle Image */}
            <input type="file" accept="image/*" onChange={(e) => handleSubtitleImageChange(e, subtitleIndex)} />
            {subtitleItem.imageUrl && (
              <Image src={subtitleItem.imageUrl} alt="Subtitle Image" width={64} height={64} className="rounded-md" />
            )}

            {/* Subtitlesubtitles */}
            {subtitleItem.subtitlesubtitles.map((subsubtitle, subsubtitleIndex) => (
              <div key={subsubtitleIndex} className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={subsubtitle.text}
                  onChange={(e) => handleSubtitlesubtitleChange(subtitleIndex, subsubtitleIndex, e.target.value)}
                  placeholder={`Subtitlesubtitle ${subsubtitleIndex + 1}`}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => deleteSubtitlesubtitleField(subtitleIndex, subsubtitleIndex)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>

                {/* Subtitlesubtitle Image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSubtitlesubtitleImageChange(e, subtitleIndex, subsubtitleIndex)}
                />
                {subsubtitle.imageUrl && (
                  <Image
                    src={subsubtitle.imageUrl}
                    alt="Subtitlesubtitle Image"
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSubtitlesubtitleField(subtitleIndex)}
              className="mt-2 text-blue-500 hover:text-blue-700 font-semibold"
            >
              Add Subtitlesubtitle
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubtitleField}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
        >
          Add Subtitle
        </button>

        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold"
        >
          Submit
        </button>
      </form>

      {/* Display List */}
      <ul className="mt-6 space-y-4">
        {titlesList.map((t, index) => (
          <li key={index} className="border p-4 rounded-md bg-gray-100">
            <strong className="text-lg">{t.title}</strong>
            {t.imageUrl && (
              <Image src={t.imageUrl} alt="Main Title Image" width={128} height={128} className="object-cover rounded-md" />
            )}
            <ul className="mt-2 space-y-2">
              {t.subtitles.map((s, subIndex) => (
                <li key={subIndex} className="ml-4">
                  <strong>{s.subtitle}</strong>
                  {s.imageUrl && (
                    <Image src={s.imageUrl} alt="Subtitle Image" width={64} height={64} className="rounded-md" />
                  )}
                  <ul className="mt-1 ml-4 list-disc list-inside text-gray-700">
                    {s.subtitlesubtitles.map((ss, subsubIndex) => (
                      <li key={subsubIndex}>
                        {ss.text}
                        {ss.imageUrl && (
                          <Image src={ss.imageUrl} alt="Subtitlesubtitle Image" width={32} height={32} className="rounded-md" />
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddTitle;
