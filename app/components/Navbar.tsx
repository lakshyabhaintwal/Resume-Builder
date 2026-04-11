"use client";

import Link from "next/link";
import {
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Wait for Clerk
  if (!isLoaded) return null;

  const isActive = (path: string) =>
    pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-950"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            AI
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Resume Builder
          </span>
        </Link>

        {/* CENTER SEARCH */}
        <div className="mx-8 hidden flex-1 lg:flex">
          <div className="w-full max-w-md">
            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="mr-3 h-4 w-4 text-gray-400"
              >
                <path
                  d="M14.167 14.167 17.5 17.5M15.833 9.167a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search templates, guides, and tools"
                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 lg:gap-6">
          <nav className="hidden items-center gap-5 xl:flex">
            <NavItem
              href="/builder"
              active={isActive("/builder")}
            >
              Builder
            </NavItem>

            <NavItem
              href="/jobs"
              active={isActive("/jobs")}
            >
              Jobs
            </NavItem>

            <NavItem
              href="/tools"
              active={isActive("/tools")}
            >
              Tools
            </NavItem>
          </nav>

          {!isSignedIn && (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Log in
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}

          {isSignedIn && (
            <>
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-xs text-gray-500">
                  Welcome
                </span>

                <span className="font-semibold text-gray-900">
                  {user?.firstName || "User"}
                </span>
              </div>

              <Link
                href="/builder"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Dashboard
              </Link>

              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({
  href,
  active,
  children,
}: any) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        active
          ? "text-blue-600"
          : "text-gray-700 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  );
}
