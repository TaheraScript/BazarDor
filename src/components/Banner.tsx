import Image from "next/image";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <div className="mx-auto m-5 flex max-w-7xl flex-col-reverse items-center justify-between gap-6 rounded-2xl bg-white px-4 py-4 sm:px-6 md:flex-row lg:px-4">
      <div>
        <p className="mt-2 inline-block w-fit rounded-full border border-[#cfe5d7] bg-[#e1f1e7] px-3 py-1 text-xs font-medium text-[#1d271f] sm:text-sm">
          {date}
        </p>

        <h1 className="text-2xl font-bold sm:text-[36px]">
          আজকের বাজারের দাম এক নজরে
        </h1>
        <p className="mb-5 mt-3 text-[16px] font-normal text-[#5f6761]">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
          বিস্তারিত, গড়, সর্বনিম্ন-
          <br className="hidden md:block" />
          সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>

        <a
          href="#সব-পণ্য"
          className="btn btn-sm rounded border-none bg-[#05893E] px-5 font-medium text-white shadow-md sm:btn-md md:mb-13"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      <Image
        src="/bazar-hero.png"
        height={300}
        width={250}
        priority
        className="h-auto w-48 sm:w-60 md:w-62.5"
        alt="a basket with full of bazar"
      />
    </div>
  );
};

export default Banner;
