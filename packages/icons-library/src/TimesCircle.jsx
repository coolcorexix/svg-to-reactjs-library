import React from "react";

function Icon({ color = "#172B4D", width = 16, height = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      viewBox="0 0 16 16"
    >
      <g clipPath="url(#clip0_10_1292)">
        <g clipPath="url(#clip1_10_1292)">
          <path
            fill={color}
            d="M8 .25A7.749 7.749 0 00.25 8 7.749 7.749 0 008 15.75 7.749 7.749 0 0015.75 8 7.749 7.749 0 008 .25zm0 14A6.228 6.228 0 011.75 8 6.248 6.248 0 018 1.75c3.438 0 6.25 2.813 6.25 6.25A6.248 6.248 0 018 14.25zm3.156-8.188c.156-.125.156-.375 0-.53l-.687-.688c-.156-.157-.406-.157-.531 0L8 6.78 6.031 4.844c-.125-.157-.375-.157-.531 0l-.688.687c-.156.157-.156.407 0 .532L6.75 8 4.812 9.969c-.156.125-.156.375 0 .531l.688.688c.156.156.406.156.531 0L8 9.25l1.938 1.938c.124.156.374.156.53 0l.688-.688c.156-.156.156-.406 0-.531L9.22 8l1.937-1.938z"
          ></path>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_10_1292">
          <path fill={color} d="M0 0H16V16H0z"></path>
        </clipPath>
        <clipPath id="clip1_10_1292">
          <path fill={color} d="M0 0H16V16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default Icon;
