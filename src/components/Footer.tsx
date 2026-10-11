const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-[#fafcfa]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left">
        <p className="text-xs leading-normal text-[#1d271f]">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="text-xs leading-normal text-[#1d271f]">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;
