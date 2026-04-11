"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
              Premium resumes, built to convert
            </div>

            <h1 className="max-w-4xl text-6xl font-extrabold leading-[1.05] tracking-tight text-gray-950 md:text-7xl">
              Build Your Resume
              <br />
              Land More Interviews.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-gray-600">
              Create professional ATS-friendly resumes in minutes and stand out from the crowd.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <SignedOut>
                <Link
                  href="/sign-up"
                  className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started for Free
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/builder"
                  className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>

              <Link
                href="/preview"
                className="inline-flex rounded-full border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                See Preview
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-gray-500">
              <span>ATS-friendly formatting</span>
              <span>Modern templates</span>
              <span>Fast export workflow</span>
            </div>
          </div>

          <div className="justify-self-stretch lg:justify-self-end">
            <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Resume Preview
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-950">
                      Clean, recruiter-ready output
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    Live
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded-full bg-gray-900" />
                      <div className="h-3 w-48 rounded-full bg-gray-300" />
                    </div>

                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded-full bg-blue-200" />
                      <div className="h-3 w-full rounded-full bg-gray-200" />
                      <div className="h-3 w-5/6 rounded-full bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                        <div className="h-3 w-20 rounded-full bg-blue-200" />
                        <div className="h-3 w-full rounded-full bg-gray-200" />
                        <div className="h-3 w-4/5 rounded-full bg-gray-200" />
                      </div>
                      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                        <div className="h-3 w-20 rounded-full bg-blue-200" />
                        <div className="h-3 w-full rounded-full bg-gray-200" />
                        <div className="h-3 w-3/4 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="max-w-lg text-sm leading-6 text-gray-500">
                  Ship a sharper first impression with a layout that feels polished before anyone reads a word.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
