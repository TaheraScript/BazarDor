"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsBoxArrowLeft, BsCaretDownFill, BsPersonFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const UserInfo = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },

        onError: () => {
          toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন");
        },
      },
    });
  };

  if (isPending) return <div className="h-9 w-24" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="btn btn-ghost btn-sm rounded px-4 font-medium text-[#1D271F] hover:bg-gray-100"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="btn btn-sm rounded border-none bg-[#05893E] px-5 font-medium text-white shadow-md"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const firstName = displayName.split(" ")[0];
  const showImage = user.image && failedImage !== user.image;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-gray-100"
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image!}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={() => setFailedImage(user.image!)}
            className="h-9 w-9 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#05893E] text-sm font-semibold text-white">
            {firstName.charAt(0).toUpperCase()}
          </span>
        )}

        <span className="text-sm font-medium leading-normal text-[#1d271f]">
          {firstName}
        </span>
        <BsCaretDownFill size={6} className="text-[#5f6761]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5 shadow-xl"
        >
          <p className="truncate text-sm font-bold leading-normal text-[#1d271f]">
            {displayName}
          </p>
          <p className="mb-4 truncate text-xs leading-normal text-[#5f6761]">
            {user.email}
          </p>

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mb-3 flex items-center gap-2 text-sm leading-normal text-[#1d271f] hover:text-[#05893E]"
          >
            <BsPersonFill className="text-[#5f6761]" />
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex cursor-pointer items-center gap-2 text-sm leading-normal text-[#d44a4b] hover:opacity-80"
          >
            <BsBoxArrowLeft />
            সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
