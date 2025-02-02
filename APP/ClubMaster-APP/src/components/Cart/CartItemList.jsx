import React from 'react';
import { ShoppingCart } from 'lucide-react';
import CartItem from './CartItem';

function CartItemList({ panier, onRemoveItem, onQuantityChange }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <h2 className="text-2xl font-semibold">Votre panier</h2>
        <ShoppingCart className="h-5 w-5" />
      </div>
      
      <div className="space-y-4">
        {panier.map((item) => (
          <CartItem 
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onQuantityChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
          />
        ))}
      </div>
    </div>
  );
}

export default CartItemList;