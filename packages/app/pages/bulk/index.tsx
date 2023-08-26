import { CSSProperties, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as icons from "@svg2tsx/library";

function copyToClipboard(textToCopy: string) {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;

  // Set the textarea to be invisible
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select the text in the textarea
  textarea.select();

  // Execute the copy command
  document.execCommand("copy");

  // Remove the textarea from the document
  document.body.removeChild(textarea);
}

function BulkPage() {
  const [inputValue, setInputValue] = useState(""); // Initialize state for the input value
  const [components, setComponents] = useState<
    {
      name: string;
      Component: React.FC;
    }[]
  >([]);

  useEffect(() => {
    // Create an array to store the components
    const loadedComponents = [];

    // Loop through the properties of the MyLibrary object
    for (const key in icons) {
      console.log("🚀 ~ file: index.tsx:27 ~ useEffect ~ key:", key);
      if (icons.hasOwnProperty(key)) {
        console.log("1");
        // Check if the property is a component
        if (typeof icons[key] === "function") {
          console.log("2");
          loadedComponents.push({
            name: key,
            Component: icons[key],
          });
        }
      }
    }
    console.log(
      "🚀 ~ file: index.tsx:21 ~ useEffect ~ loadedComponents:",
      loadedComponents
    );

    // Set the components in the state
    setComponents(loadedComponents);
  }, []);

  const handleChange = (e) => {
    // Update the inputValue state when the input changes
    setInputValue(e.target.value);
  };
  const [setSelectedIcon] = useState(null);
  const iconsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px", // Divisible by 4
    padding: "16px", // Divisible by 4
  };

  const handleIconClick = (iconName, IconComponent) => {
    setSelectedIcon({ iconName, IconComponent });
  };

  const iconStyle: CSSProperties = {
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px", // Divisible by 4
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const nameStyle: CSSProperties = {
    marginTop: "8px", // Divisible by 4
    textAlign: "center",
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <h1>Look-up Page</h1>
      <input
        type="text"
        value={inputValue} // Set the input value to the state value
        onChange={handleChange} // Attach the onChange event handler
      />
      <div></div>

      <div style={iconsContainerStyle}>
        {components
          .filter(({ name }) =>
            name
              .toLocaleLowerCase()
              .includes(inputValue.toLocaleLowerCase().replace(/\s/g, ""))
          )
          .map(({ name: iconName, Component: IconComponent }) => {
            return (
              <div
                style={iconStyle}
                key={iconName}
                onClick={() => {
                  copyToClipboard(iconName);
                  toast("Copied to clipboard");
                }}
              >
                <IconComponent />
                <div style={nameStyle}>{iconName}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BulkPage;
