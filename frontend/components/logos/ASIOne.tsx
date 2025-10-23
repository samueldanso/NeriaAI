import type { SVGProps } from "react";

export default function ASIOne(props: SVGProps<SVGSVGElement>) {
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
      <title>{"ASI:One"}</title>
      <defs>
        <linearGradient
          id="asi-one-gradient"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00D4AA" />
          <stop offset="100%" stopColor="#00A8CC" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#asi-one-gradient)" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        ASI
      </text>
    </svg>
  );
}
