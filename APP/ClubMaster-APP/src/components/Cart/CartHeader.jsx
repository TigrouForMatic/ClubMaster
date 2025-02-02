import React from 'react';
import { ArrowLeft } from 'lucide-react';

function CartHeader({ onUndo }) {
  return (
    <div className="flex items-start gap-2">
      <button 
        onClick={onUndo}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
    >
        <ArrowLeft className="h-4 w-4" />
        Retour à la boutique
      </button>
    </div>
  );
}

export default CartHeader;