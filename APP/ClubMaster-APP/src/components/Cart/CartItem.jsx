import React from 'react';
import { Trash2 } from 'lucide-react';
import ComingSoonImage from "../../assets/photos/comming_soon.jpg";

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="flex items-center gap-6 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={item.imageurl || ComingSoonImage}  
          alt={item.imageurl ? item.label : "Image à venir"} 
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        <h3 className="font-semibold text-foreground">{item.label}</h3>
        <p className="text-sm text-muted-foreground">
          Prix unitaire : {item.price.toFixed(2)}€
        </p>
        <div className="flex items-center gap-2">
          {item.stock > 0 ? (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
              Rupture de stock
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={item.quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {[...Array(Math.min(10, item.stock)).keys()].map(i => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
          {item.stock > 10 && <option value={10}>10+</option>}
        </select>

        <button 
          onClick={onRemove}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Supprimer l'article"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;