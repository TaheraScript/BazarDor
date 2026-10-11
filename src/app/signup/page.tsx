'use client'
import { useState } from "react"; 
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // REQUIREMENT: replaces redirect(), which is not meant for client event handlers
import toast from "react-hot-toast"; // REQUIREMENT: toast on signup / validation error

const SignUpPage = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // REQUIREMENT: loading state so the button can't be clicked twice

    const onSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault()
        setErrorMessage("")
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const { confirmPassword, ...user } = Object.fromEntries(formData.entries()) as {name:string,email:string,password:string,confirmPassword:string}

        // REQUIREMENT: validation error shown as toast + message
        if (user.password !== confirmPassword) {
            const msg = "পাসওয়ার্ড দুটি মিলছে না";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        setLoading(true)
        const { data, error } = await authClient.signUp.email({
            ...user, // REQUIREMENT: confirmPassword is no longer sent to the API
        })
        setLoading(false)

        // REQUIREMENT: show error as toast + message in the form
        if (error) {
            const msg = error.message || "সাইন আপ করা যায়নি, আবার চেষ্টা করুন";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        // REQUIREMENT: after successful registration go to the login page (was "/")
        if (data) {
            toast.success("অ্যাকাউন্ট তৈরি হয়েছে, এখন সাইন ইন করুন");
            router.push("/signin");
        }
    }

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
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm leading-normal text-[#5f6761]">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full rounded-2xl border border-gray-200 bg-[#fafcfa] p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium leading-normal text-[#1d271f]"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none placeholder:text-[#5f6761] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

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
               autoComplete="new-password"
              required
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none placeholder:text-[#5f6761] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium leading-normal text-[#1d271f]"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="আবার লিখুন"
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
            disabled={loading} // REQUIREMENT: disabled while submitting
            className="h-10 w-full cursor-pointer rounded-lg bg-[#05893E] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#047a37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-[#05893E] hover:underline">
            সাইন ইন করুন
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

export default SignUpPage;