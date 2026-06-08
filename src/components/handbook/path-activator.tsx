"use client";

import { setReadingPath } from "./reading-path-selector";
import type { ReadingPathId } from "@/lib/reading-path-meta";

export function PathLink({
  path,
  href,
  className,
  children,
}: {
  path: ReadingPathId;
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        setReadingPath(path);
        window.location.href = href;
      }}
    >
      {children}
    </a>
  );
}
