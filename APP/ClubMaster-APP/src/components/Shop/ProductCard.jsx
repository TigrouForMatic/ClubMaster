import React from 'react';
import ComingSoonImage from "../../assets/photos/comming_soon.jpg";
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => (
  <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
      <img 
        src={product.imageurl || ComingSoonImage} 
        alt={product.imageurl ? product.label : "Image à venir"} 
        className="h-[200px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {product.label}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">
            {product.price.toFixed(2)} €
          </p>
          <p className={`mt-1 text-sm ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `En stock: ${product.stock}` : 'Rupture de stock'}
          </p>
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;