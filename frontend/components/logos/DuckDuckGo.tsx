import type { SVGProps } from "react";

export default function DuckDuckGo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      style={{
        flex: "none",
        lineHeight: 1,
      }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      {...props}
    >
      <title>{"DuckDuckGo"}</title>
      <defs>
        <linearGradient
          id="duckduckgo-gradient"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#DE5833" />
          <stop offset="100%" stopColor="#FF5722" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#duckduckgo-gradient)" />
      <path
        d="M8 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
        fill="white"
      />
      <path
        d="M12 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
}
