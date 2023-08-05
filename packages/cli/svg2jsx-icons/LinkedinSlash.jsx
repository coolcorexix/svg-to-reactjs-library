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
      <path
        fill={color}
        d="M1 2.468v11.523c0 .556.447 1.009.997 1.009h9.968L8.61 11.165V13H6.534V8.793l-1.3-1.485V13H3.156V6.319H4.37L1 2.469zM13.01 10.47V9.338c0-1.8-.391-3.185-2.491-3.185-.417 0-.776.094-1.075.242L4.724 1H14c.55 0 1 .453 1 1.01v10.735l-1.99-2.275zM1.51 1.129c-.117.067-.22.157-.302.264l.302-.264z"
      ></path>
      <path
        fill={color}
        d="M.874.941L1.95.001l13.176 15.058L14.05 16 .874.941z"
      ></path>
    </svg>
  );
}

export default Icon;
