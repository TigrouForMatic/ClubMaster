import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ onChange, className }) => {
  const padRef = useRef(null);

  const clear = () => {
    padRef.current?.clear();
  };

  const handleEnd = () => {
    const signature = padRef.current?.toDataURL();
    if (signature) {
      onChange(signature);
    }
  };

  return (
    <div className={className}>
      <SignatureCanvas
        ref={padRef}
        onEnd={handleEnd}
        canvasProps={{
          className: "signature-canvas",
          width: 500,
          height: 200,
        }}
      />
      <button
        onClick={clear}
        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
      >
        Effacer la signature
      </button>
    </div>
  );
};