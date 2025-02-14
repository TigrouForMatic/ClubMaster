import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/store';
import { ShoppingCart } from 'lucide-react';

const CartBar = () => {
  const navigate = useNavigate();
  const { panier } = useStore();
  const lastAddedProduct = panier[0];

  const calculateTotalCost = () => panier.reduce((total, product) => total + product.quantity * product.price, 0);
  const calculateItemCount = () => panier.reduce((count, product) => count + product.quantity, 0);

  const totalCost = calculateTotalCost();
  const itemCount = calculateItemCount();

  return (
    <div 
      onClick={() => navigate('/cart')}
      className="fixed bottom-4 right-4 md:right-8 z-50 flex items-center gap-4 bg-white rounded-lg border shadow-lg p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] max-w-sm"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          Dernier ajout : {lastAddedProduct?.label || 'Aucun'}
        </p>
      </div>

      <div className="flex items-center gap-3 text-foreground">
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <span className="font-medium">
          {totalCost.toFixed(2)} €
        </span>
      </div>
    </div>
  );
};

export default CartBar;