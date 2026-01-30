"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <h2 className="text-5xl font-extrabold mb-6 leading-tight text-gray-900">
          Build Your Resume<br />
          Land More Interviews.
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Create professional ATS-friendly resumes in minutes
          and stand out from the crowd.
        </p>

        {/* CTA Button */}
        <SignedOut>
          <Link
            href="/sign-up"
            className="inline-block bg-yellow-400 px-10 py-4 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
          >
            Get Started for Free
          </Link>
        </SignedOut>

        <SignedIn>
          <Link
            href="/builder"
            className="inline-block bg-yellow-400 px-10 py-4 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
          >
            Go to Dashboard
          </Link>
        </SignedIn>

      </section>


      {/* PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="bg-gray-100 rounded-2xl p-14 text-center text-gray-600 shadow-sm">

          <p className="text-2xl font-semibold mb-2">
            Resume Preview
          </p>

          <p className="text-sm">
            (We’ll add a real preview here soon)
          </p>

        </div>

      </section>

    </div>
  );
}
