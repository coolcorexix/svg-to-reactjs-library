import React, { useState } from 'react';
import * as iconComponents from '../../svg2jsx-icons';
import plainTextSourceCode from '../../svg2jsx-icons/plain-text.json'
import Editor from '../../components/Editor';

function BulkPage() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const iconsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', // Divisible by 4
    padding: '16px', // Divisible by 4

  };

  const handleIconClick = (iconName, IconComponent) => {
    setSelectedIcon({iconName, IconComponent});
  };


  const iconStyle = {
    display: 'flex',
    cursor: 'pointer',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px', // Divisible by 4
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const nameStyle = {
    marginTop: '8px', // Divisible by 4
    textAlign: 'center',
  };

  const panelStyle = {
    padding: '16px', // Divisible by 4
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '16px 0', // Divisible by 4
    backgroundColor: '#f9f9f9',
    display: selectedIcon ? 'block' : 'none',
  };

  return (
    <div>
      <h1>Bulk Page</h1>
      <div style={iconsContainerStyle}>
        {/* Render each icon component */}
        {Object.entries(iconComponents).map(([iconName, IconComponent]) => (
          <div key={IconComponent.name} onClick={() => handleIconClick(iconName, IconComponent)} style={iconStyle}>
            <IconComponent />
            <div style={nameStyle}>{iconName}</div>
          </div>
        ))}
      </div>
      <div style={panelStyle}>
        {selectedIcon && (
          <>
            <h2>{selectedIcon.iconName}</h2>

            <Editor value={plainTextSourceCode[selectedIcon.iconName]} mode="jsx" isReadOnly /> 
          </>
        )}
      </div>
    </div>
  );
}

export default BulkPage;
