/* src/app/blog/[postId]/page.tsx */
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

interface PostPageProps {
  params: {
    postId: string;
  };
}

async function fetchPostData(postId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await fetchPostData(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1>{post.data.title}</h1>
      <p>{post.data.content}</p>
    </div>
  );
}
