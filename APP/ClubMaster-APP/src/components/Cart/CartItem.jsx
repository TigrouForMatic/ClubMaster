import React from 'react';
import { Trash2 } from 'lucide-react';
import ComingSoonImage from "../../assets/photos/comming_soon.jpg";

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={item.imageurl || ComingSoonImage}  
          alt={item.imageurl ? item.label : "Image à venir"} 
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="font-medium text-foreground">{item.label}</h3>
        <p className="text-sm text-muted-foreground">
          Prix: {item.price.toFixed(2)}€
        </p>
        {item.stock > 0 && (
          <span className="mt-1 inline-flex items-center text-xs font-medium text-green-600">
            En stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={item.quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {[...Array(Math.min(10, item.stock)).keys()].map(i => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
          {item.stock > 10 && <option value={10}>10+</option>}
        </select>

        <button 
          onClick={onRemove}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;