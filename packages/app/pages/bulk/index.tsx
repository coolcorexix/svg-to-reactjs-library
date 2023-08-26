import * as icons from "@svg2tsx/library";
import { CSSProperties, useState } from "react";


function BulkPage() {
  const [inputValue, setInputValue] = useState(''); // Initialize state for the input value

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
      <h1>Bulk Page</h1>
      <input
        type="text"
        value={inputValue} // Set the input value to the state value
        onChange={handleChange} // Attach the onChange event handler
      />
      <div style={iconsContainerStyle}>
        {Object.entries(icons).filter(
          ([iconName]) => iconName.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        ).map(([iconName, IconComponent]: [string, React.FC]) => {
          return (
            <div
              style={iconStyle}
              key={iconName}
              onClick={() => handleIconClick(iconName, IconComponent)}
            >
              <IconComponent />
              <div style={nameStyle}>
                {iconName}
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BulkPage;
