"use client";

export const Copyright = () => {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const copyrightName = process.env.NEXT_PUBLIC_SITE_NAME || "";
  return (
    <p>
      &copy; {copyrightDate} {copyrightName}
      {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""} All
      rights reserved.
    </p>
  );
};
