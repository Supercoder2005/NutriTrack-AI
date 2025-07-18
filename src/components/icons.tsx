import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
      <path d="M15.5 8.5c-1-1-2-1.5-3.5-1.5s-2.5.5-3.5 1.5" />
      <path d="M12 15.5c-1.5 0-2.8-1-3.5-2.5" />
      <path d="M15.5 13c-.7 1.5-2 2.5-3.5 2.5s-2.8-1-3.5-2.5" />
      <path d="M8.5 8.5c1 1 2 1.5 3.5 1.5s2.5-.5 3.5-1.5" />
    </svg>
  );
}
