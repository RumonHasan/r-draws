import { Excalidraw, Footer, Sidebar } from '@excalidraw/excalidraw';
import { useEffect, useState } from 'react';
import './Excalistyles.css';

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
  const [docked, setDocked] = useState(false);
  const [optionsDisplayModeEnabled, setOptionsDisplayModeEnabled] =
    useState(false);

  useEffect(() => {
    if (!excalidrawApi) {
      console.log('api still loading');
      return;
    }
  }, [excalidrawApi]);

  useEffect(() => {
    if (currDrawState) {
      console.log(currDrawState);
    }
  }, [currDrawState]);

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
      >
        <Sidebar name="custom" docked={docked} onDock={setDocked}>
          <Sidebar.Header>Additional Options</Sidebar.Header>
          <Sidebar.Tabs style={{ padding: '0.5rem' }}>
            <Sidebar.Tab tab="extras">
              <div className="sidebar-options">
                <div className="option">
                  <input
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
    </div>
  );
};

export default Excaliboy;
