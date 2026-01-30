"use client";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600">
            AI Resume Builder
          </h1>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="#" className="hover:text-blue-600">
              Resume Builder
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Job Tracker
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Tools
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Resources
            </Link>
          </nav>

          {/* AUTH AREA */}
          <div className="flex gap-3 items-center">

            {/* When Logged Out */}
            <SignedOut>

              <Link
                href="/sign-in"
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Log in
              </Link>

              <Link
                href="/sign-up"
                className="px-5 py-2 bg-yellow-400 rounded font-semibold hover:bg-yellow-500"
              >
                Sign Up
              </Link>

            </SignedOut>

            {/* When Logged In */}
            <SignedIn>

              {/* Greeting */}
              <p className="text-sm text-gray-700 hidden sm:block">
                Hi, {user?.firstName || "User"} 👋
              </p>

              <Link
                href="/builder"
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>

              {/* Profile + Logout */}
              <UserButton afterSignOutUrl="/" />

            </SignedIn>

          </div>

        </div>
      </header>


      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">

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
