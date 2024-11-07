'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Subtitlesubtitle {
  text: string;
}

interface Subtitle {
  subtitle: string;
  subtitlesubtitles: Subtitlesubtitle[];
}

interface Title {
  _id: string;
  title: string;
  subtitles: Subtitle[];
  imageUrl?: string;
}

export default function HomePage() {
  const [titles, setTitles] = useState<Title[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch('/api/titles');
        if (!response.ok) {
          throw new Error('Failed to fetch titles');
        }
    
        const data = await response.json();
        console.log("Fetched titles data:", data);
    
        // Check if data is an array; otherwise, set an empty array
        setTitles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching titles:', error);
      }
    };
    

    fetchTitles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Titles</h1>
        <Link href="/addtitle">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add Title
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Main Title</th>
            <th className="py-2 px-4 border-b">Subtitles</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {titles.map((titleItem) => (
            <tr key={titleItem._id} className="text-center">
              <td className="py-2 px-4 border-b">
                {titleItem.imageUrl ? (
                  <Image
                    src={titleItem.imageUrl}
                    alt="Main Title Image"
                    width={50}
                    height={50}
                    className="object-cover rounded-md"
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="py-2 px-4 border-b">{titleItem.title}</td>
              <td className="py-2 px-4 border-b">
                {titleItem.subtitles.map((subtitle, subIndex) => (
                  <div key={subIndex}>
                    <strong>{subtitle.subtitle}</strong>
                    <ul className="list-disc list-inside ml-4">
                      {subtitle.subtitlesubtitles.map((subsubtitle, subsubIndex) => (
                        <li key={subsubIndex}>{subsubtitle.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">
                <Link href={`/update/${titleItem._id}`}>
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                    Update
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
