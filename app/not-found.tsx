import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-6">Page Not Found</h2>
      <p className="mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Suspense>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </Suspense>
    </div>
  );
}
