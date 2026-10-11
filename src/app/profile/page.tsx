"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsBoxArrowLeft } from "react-icons/bs";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("চালিয়ে যেতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (isPending || !user) return null;

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10">
      <div className="mb-5">
        <h1 className="text-xl font-bold leading-normal text-[#1d271f]">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs leading-normal text-[#5f6761]">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      <section className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
        <div className="flex min-w-0 items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#05893E] text-2xl font-semibold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0">
            <p className="truncate text-lg font-medium leading-normal text-[#1d271f]">
              {user.name}
            </p>
            <p className="truncate text-sm leading-normal text-[#5f6761]">
              {user.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[#d44a4b] bg-transparent px-3 text-xs font-medium leading-normal text-[#d44a4b] transition-colors hover:bg-[#d44a4b]/10"
        >
          <BsBoxArrowLeft />
          সাইন আউট
        </button>
      </section>

      <Link
        href="/profile/update"
        className="flex h-10 w-full items-center justify-center rounded-lg bg-[#05893E] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#047a37]"
      >
        তথ্য আপডেট করুন
      </Link>
    </div>
  );
};

export default ProfilePage;
