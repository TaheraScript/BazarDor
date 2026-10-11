"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBoxArrowLeft } from "react-icons/bs";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && !user) router.replace("/sign-in");
  }, [isPending, user, router]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const form = e.currentTarget;

    const formData = new FormData(form);
    const newUserData = Object.fromEntries(formData.entries()) as {
      name: string;
    };

    const name = newUserData.name.trim();

    if (!name) {
      setMessage({ type: "error", text: "নতুন নাম লিখুন" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await authClient.updateUser({ name });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: "আপডেট করা যায়নি, আবার চেষ্টা করুন" });
      return;
    }

    form.reset();
    setMessage({ type: "success", text: "তথ্য আপডেট হয়েছে" });
    router.refresh();
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

      <section className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-4 pb-5">
        <h2 className="mb-4 mt-1 text-sm font-semibold leading-normal text-[#1d271f]">
          তথ্য
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-3 px-4">
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
              className="h-10 w-full rounded-lg border border-gray-200 bg-white/70 px-3 text-sm text-[#1d271f] outline-none focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
            />
          </div>

          {message && (
            <p
              className={`text-sm leading-normal ${
                message.type === "success" ? "text-[#1a9951]" : "text-[#d44a4b]"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-10 w-full cursor-pointer rounded-lg bg-[#05893E] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#047a37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "অপেক্ষা করুন..." : "আপডেট"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
