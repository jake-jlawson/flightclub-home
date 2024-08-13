import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export default function PortalContainer() {
    const portalRoot = useRef(null);
  
    useEffect(() => {
      portalRoot.current = document.createElement('div');
      document.body.appendChild(portalRoot.current);
  
      return () => {
        document.body.removeChild(portalRoot.current);
      };
    }, []);
  
    return ReactDOM.createPortal(
      <div id="portal-container"></div>,
      portalRoot.current
    );
  }