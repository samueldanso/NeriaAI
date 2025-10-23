import type { SVGProps } from "react";

export default function SingularityNET(props: SVGProps<SVGSVGElement>) {
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
      <title>{"SingularityNET MeTTa"}</title>
      <defs>
        <linearGradient
          id="singularity-gradient"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#F7931E" />
          <stop offset="100%" stopColor="#FFD23F" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#singularity-gradient)" />
      <path d="M8 8h8v8H8z" fill="white" opacity="0.9" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#FF6B35"
        fontSize="6"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        MeTTa
      </text>
    </svg>
  );
}
