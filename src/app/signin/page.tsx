"use client";

import { useEffect, useState } from "react"; // REQUIREMENT: useEffect added for the redirect toast
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast"; // REQUIREMENT: toast on login success / error
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // REQUIREMENT: toast when the user was redirected here from a protected route
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect")) {
      toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    const { data, error } = await authClient.signIn.email({
      ...user,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      const msg = "ইমেইল বা পাসওয়ার্ড সঠিক নয়";
      setErrorMessage(msg);
      toast.error(msg); // REQUIREMENT: error toast on failed login
      return;
    }

    if (data) {
      toast.success("সফলভাবে সাইন ইন হয়েছে"); // REQUIREMENT: success toast on login
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      setErrorMessage("Google দিয়ে সাইন ইন করা যায়নি");
      toast.error("Google দিয়ে সাইন ইন করা যায়নি"); // REQUIREMENT: toast
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "github", // REQUIREMENT: was "google", so the GitHub button opened Google login
      callbackURL: "/",
    });

    if (error) {
      setErrorMessage("Github দিয়ে সাইন ইন করা যায়নি");
      toast.error("Github দিয়ে সাইন ইন করা যায়নি"); // REQUIREMENT: toast
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-[28px] font-bold leading-normal text-[#1d271f]">
          সাইন ইন
        </h1>
        <p className="text-sm leading-normal text-[#5f6761]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="w-full rounded-2xl border border-gray-200 bg-[#fafcfa] p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium leading-normal text-[#1d271f]"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none placeholder:text-[#5f6761] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium leading-normal text-[#1d271f]"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none placeholder:text-[#5f6761] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

          {errorMessage && (
            <p className="text-sm leading-normal text-[#d44a4b]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full cursor-pointer rounded-lg bg-[#05893E] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#047a37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs leading-normal text-[#5f6761]">অথবা</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-2 text-[13px] font-semibold text-[#1d271f] transition-colors hover:bg-gray-50"
          >
            <FcGoogle size={18} />
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-2 text-[13px] font-semibold text-[#1d271f] transition-colors hover:bg-gray-50"
          >
            <FaGithub size={18} />
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-4 text-center text-sm leading-normal text-[#1d271f]">
          অ্যাকাউন্ট নেই?{" "}
          {/* REQUIREMENT: route is /signup, not /sign-up */}
          <Link href="/signup" className="text-[#05893E] hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm leading-normal text-[#5f6761] hover:text-[#05893E]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default SignInPage;