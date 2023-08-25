import React, { CSSProperties, useState } from 'react';
import ReactDOM from 'react-dom';
import babel from '@babel/core'
import plainTextSourceCode from '../../svg2jsx-icons/plain-text.json';

import dynamic from 'next/dynamic';
import axios from 'axios';

const Editor = dynamic(() => import('../../components/Editor'), {
  ssr: false, // This will only import the library on the client side
});

function transformJSXToComponent(jsxString) {
  try {
    const { code } = babel.transformSync(jsxString, {
      presets: ['@babel/preset-react'],
    });

    // Create a function from the transformed code and return it
    return new Function('React', code)(require('react'));
  } catch (error) {
    console.error('Error transforming JSX:', error);
    return null;
  }
}

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result.toString());
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

function BulkPage() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('select-file');

  const [jsxFiles, setJsxFiles] = useState([]);
  const iconsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', // Divisible by 4
    padding: '16px', // Divisible by 4
  };

  const handleIconClick = (iconName, IconComponent) => {
    setSelectedIcon({ iconName, IconComponent });
  };

  const iconStyle: CSSProperties = {
    display: 'flex',
    cursor: 'pointer',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px', // Divisible by 4
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const nameStyle: CSSProperties = {
    marginTop: '8px', // Divisible by 4
    textAlign: 'center',
  };

  const panelStyle: CSSProperties = {
    padding: '16px', // Divisible by 4
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '16px 0', // Divisible by 4
    backgroundColor: '#f9f9f9',
    display: selectedIcon ? 'block' : 'none',
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    // Convert the FileList object into an array
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);
  };
  if (viewMode === 'select-file') {
    return (
      <div>
        <h2>Multiple File Upload</h2>
        <input type="file" multiple onChange={handleFileChange} accept=".svg" />
        {selectedFiles.length > 0 && (
          <div>
            <h3>Selected Files:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <button
            onClick={async () => {
              // Read and store the content of selected SVG files

              const svgFileContents: {
                fileName: string;
                fileContent: string;
              }[] = [];

              for (const file of selectedFiles) {
                const fileContent = await readFileAsText(file);
                svgFileContents.push({
                  fileName: file.name,
                  fileContent: fileContent.toString(),
                });
              }

              console.log('🚀 ~ file: index.tsx:92 ~ selectedFiles.forEach ~ svgFileContents:', svgFileContents);
              const { data } = await axios.post('/api/bulk-transform', {
                svgFileContents,
              });
              if (data.jsxFileContents && data.jsxFileContents.length > 0) {
                setJsxFiles(data.jsxFileContents);
                setViewMode('jsx-lookup');
              }
              console.log('🚀 ~ file: index.tsx:98 ~ onClick={ ~ data:', data);
            }}
          >
            Convert to JSX
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Bulk Page</h1>
      <div style={iconsContainerStyle}>
        {jsxFiles.map(({ iconName, fileContent }) => {
          const IconFuncComponent = transformJSXToComponent(fileContent);
          console.log("🚀 ~ file: index.tsx:146 ~ {jsxFiles.map ~ IconFuncComponent:", IconFuncComponent)
          return <div>{2}</div>;
        })}
        {/* Render each icon component */}
        {/* {jsxFiles.map({iconName, fileContent}) => (
          <div key={IconComponent.name} 
          // onClick={() => handleIconClick(iconName, IconComponent)} 
          style={iconStyle}>
            
            <div style={nameStyle}>{iconName}</div>
          </div>
        ))} */}
      </div>
      <div style={panelStyle}>
        {selectedIcon && (
          <>
            <h2>{selectedIcon.iconName}</h2>

            <Editor value={plainTextSourceCode[selectedIcon.iconName]} mode="jsx" isReadOnly onChange={() => {}} />
          </>
        )}
      </div>
    </div>
  );
}

export default BulkPage;
