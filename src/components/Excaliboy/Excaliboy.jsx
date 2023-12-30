import {
  Excalidraw,
  Footer,
  Sidebar,
  exportToCanvas,
} from '@excalidraw/excalidraw';
import { useEffect, useState } from 'react';
import './Excalistyles.css';
import initialData from './initialData';
import { nanoid } from 'nanoid';

const customTabs = [
  {
    name: 'extras',
    displayName: 'Extra Options',
  },
  {
    name: 'themes',
    displayName: 'Theme Switch',
  },
];

const Excaliboy = () => {
  const [excalidrawApi, setExcalidrawApi] = useState(null);
  const [currDrawState, setCurrDrawState] = useState(null);
  const [imageCollection, setImageCollection] = useState([]);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [docked, setDocked] = useState(false);
  const [optionsDisplayModeEnabled, setOptionsDisplayModeEnabled] =
    useState(false);
  const [canvasUrl, setCanvasUrl] = useState(null);

  useEffect(() => {
    if (canvasUrl) {
      setImageCollection((prevImageUrls) => [
        ...prevImageUrls,
        {
          id: nanoid(),
          imageUrl: canvasUrl,
        },
      ]);
    }
  }, [canvasUrl]);

  useEffect(() => {
    if (!excalidrawApi) {
      return;
    }
  }, [excalidrawApi]);

  // function to export drawn state and images to canvas
  const exportToCanvasFile = async () => {
    if (!excalidrawApi) {
      return;
    }
    if (excalidrawApi) {
      const elements = excalidrawApi.getSceneElements();
      if (!elements || !elements.length) {
        return;
      }
      const originalCanvas = await exportToCanvas({
        elements,
        appState: {
          ...initialData.appState,
          viewBackgroundColor: '#121212',
          exportWithDarkMode,
        },
        files: excalidrawApi.getFiles(),
        getDimensions: () => {
          return { width: 350, height: 350 };
        },
      });
      // Create a new canvas with reduced size
      const resizedCanvas = document.createElement('canvas');
      const resizedContext = resizedCanvas.getContext('2d');

      // Set the desired dimensions for the resized image
      const resizedWidth = 200; // Adjust this based on your needs
      const resizedHeight = 200; // Adjust this based on your needs

      resizedCanvas.width = resizedWidth;
      resizedCanvas.height = resizedHeight;

      // Draw the original image onto the resized canvas
      resizedContext.drawImage(
        originalCanvas,
        0,
        0,
        originalCanvas.width,
        originalCanvas.height,
        0,
        0,
        resizedWidth,
        resizedHeight
      );

      // Convert the resized canvas to a data URL
      const resizedCanvasUrl = resizedCanvas.toDataURL();
      setCanvasUrl(resizedCanvasUrl);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        border: '2px solid gray',
        borderRadius: '10px',
      }}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawApi(api)}
        onChange={(currentState) => setCurrDrawState(currentState)}
        viewModeEnabled={optionsDisplayModeEnabled}
        theme="dark"
      >
        <Sidebar name="custom" docked={docked} onDock={setDocked}>
          <Sidebar.Header>Additional Options</Sidebar.Header>
          <Sidebar.Tabs style={{ padding: '0.5rem' }}>
            <Sidebar.Tab tab="extras">
              <div className="sidebar-options">
                <div className="option">
                  <input
                    checked={optionsDisplayModeEnabled}
                    type="checkbox"
                    value={optionsDisplayModeEnabled}
                    onChange={() =>
                      setOptionsDisplayModeEnabled(!optionsDisplayModeEnabled)
                    }
                  ></input>
                  <span>
                    {optionsDisplayModeEnabled
                      ? 'Show Options'
                      : 'Hide Options'}
                  </span>
                </div>
                <div className="option">
                  <button
                    onClick={exportToCanvasFile}
                    className="custom-button"
                  >
                    Export To Canvas
                  </button>
                </div>
              </div>
            </Sidebar.Tab>
            <Sidebar.Tab tab="theme"></Sidebar.Tab>
            <Sidebar.TabTriggers>
              {customTabs.map((currTab, index) => {
                const { displayName, name } = currTab;
                return (
                  <Sidebar.TabTrigger tab={name} key={index}>
                    {displayName}
                  </Sidebar.TabTrigger>
                );
              })}
            </Sidebar.TabTriggers>
          </Sidebar.Tabs>
        </Sidebar>
        <Footer>
          <Sidebar.Trigger
            name="custom"
            tab={customTabs[0].name}
            style={{
              marginLeft: '0.5rem',
              background: '#70b1ec',
              color: 'white',
            }}
          >
            <span>Custom Options</span>
          </Sidebar.Trigger>
        </Footer>
      </Excalidraw>

      {imageCollection.length > 0 && (
        <div className="image-container">
          {imageCollection?.map((currImageSrc) => {
            const { imageUrl, id } = currImageSrc;
            return (
              <img
                key={id}
                className="responsive-image"
                src={imageUrl}
                alt="something"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Excaliboy;
