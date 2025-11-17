"use client";

import React from "react";

interface AixerisLoadingProps {
    label?: string;
    darkBackground?: boolean;
}

export function AixerisLoading({
    label = "Yüklənir...",
    darkBackground = true,
}: AixerisLoadingProps) {
    return (
        <div
            className={`w-full h-full flex flex-col items-center justify-center ${darkBackground ? "bg-[#0A1A2F]" : "bg-transparent"
                } text-[#00E5CC]`}
        >
            <div className="relative w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(0,229,204,0.35)]">
                <svg
                    width="96"
                    height="96"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="mainGradientLoading" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00E5CC" />
                            <stop offset="50%" stopColor="#00B4A2" />
                            <stop offset="100%" stopColor="#8B6FFF" />
                        </linearGradient>
                    </defs>

                    {/* Outer circle */}
                    <circle
                        cx="256"
                        cy="256"
                        r="200"
                        stroke="url(#mainGradientLoading)"
                        strokeWidth="8"
                        fill="none"
                        opacity="0.9"
                    />

                    {/* Globe grid */}
                    <path
                        d="M106,256 A150,150 0 0,1 406,256"
                        stroke="url(#mainGradientLoading)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M106,256 A150,150 0 0,0 406,256"
                        stroke="url(#mainGradientLoading)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M256,106 A150,150 0 0,1 256,406"
                        stroke="url(#mainGradientLoading)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M256,106 A150,150 0 0,0 256,406"
                        stroke="url(#mainGradientLoading)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />

                    {/* Inner nodes */}
                    <circle cx="256" cy="256" r="10" fill="url(#mainGradientLoading)" />

                    {/* Rotating arrows inside globe */}
                    <g className="aixeris-spinner-arrows">
                        <path
                            d="M256 170 C 310 180 340 215 348 256"
                            stroke="url(#mainGradientLoading)"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.9"
                        />
                        <path
                            d="M332 230 L352 262 L317 262"
                            fill="url(#mainGradientLoading)"
                            opacity="0.95"
                        />

                        <path
                            d="M256 342 C 202 332 172 297 164 256"
                            stroke="url(#mainGradientLoading)"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.9"
                        />
                        <path
                            d="M180 282 L160 250 L195 250"
                            fill="url(#mainGradientLoading)"
                            opacity="0.95"
                        />
                    </g>
                </svg>
            </div>

            {label && (
                <p className="text-sm text-gray-200 tracking-wide">
                    {label}
                </p>
            )}

            <style jsx>{`
        .aixeris-spinner-arrows {
          transform-origin: 256px 256px;
          animation: aixeris-spin 10s linear infinite;
        }

        @keyframes aixeris-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
}


