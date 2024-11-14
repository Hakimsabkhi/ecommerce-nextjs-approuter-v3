import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="flex justify-center items-center pt-6">
        <Link href="blog"
        className="bg-orange-500 p-6 pl-8 pr-8  border-red-200 border-2 rounded-3xl text-warning-50"
        >Go to Blog</Link>
      </div>
    </>
  );
}
