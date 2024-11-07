// FullscreenCaptureViewer.js
import React from 'react';
import { useParams } from 'react-router-dom';

const FullscreenCaptureViewer = () => {
  const { nid } = useParams();

  return (
    <div className="fullscreen-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Capture Eye Viewer</h3>
      <div id="capture-eye-container" style={{ width: '100%', height: '80vh', margin: '20px 0' }}>
        <capture-eye nid={nid}>
          <media-viewer
            width="100%"
            height="100%"
            src={`https://ipfs-pin.numbersprotocol.io/ipfs/${nid}`}
          ></media-viewer>
        </capture-eye>
      </div>
    </div>
  );
};

export default FullscreenCaptureViewer;
