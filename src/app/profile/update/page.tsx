"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("চালিয়ে যেতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      const msg = "নতুন নাম লিখুন";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const { error } = await authClient.updateUser({ name });

    setSaving(false);

    if (error) {
      const msg = "আপডেট করা যায়নি, আবার চেষ্টা করুন";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  };

  if (isPending || !user) return null;

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <div className="mb-5">
        <h1 className="text-xl font-bold leading-normal text-[#1d271f]">
          তথ্য আপডেট করুন
        </h1>
        <p className="text-xs leading-normal text-[#5f6761]">
          আপনার নাম পরিবর্তন করুন।
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-medium leading-normal text-[#1d271f]"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              defaultValue={user.name}
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

          {errorMessage && (
            <p className="text-sm leading-normal text-[#d44a4b]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-10 w-full cursor-pointer rounded-lg bg-[#05893E] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#047a37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "অপেক্ষা করুন..." : "Update Information"}
          </button>
        </form>
      </section>

      <Link
        href="/profile"
        className="mt-5 inline-block text-sm leading-normal text-[#5f6761] hover:text-[#05893E]"
      >
        ← প্রোফাইলে ফিরে যান
      </Link>
    </div>
  );
};

export default UpdateProfilePage;
