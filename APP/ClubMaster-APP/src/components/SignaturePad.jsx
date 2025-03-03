import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = React.forwardRef(({ onChange, className }, ref) => {
  const handleEnd = () => {
    const signature = ref.current?.toDataURL();
    if (signature) {
      onChange(signature);
    }
  };

  return (
    <div className={className}>
      <SignatureCanvas
        ref={ref}
        onEnd={handleEnd}
        canvasProps={{
          className: "signature-canvas",
          width: 500,
          height: 200,
        }}
      />
      <button
        onClick={() => ref.current?.clear()}
        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
      >
        Effacer la signature
      </button>
    </div>
  );
});

export default SignaturePad;