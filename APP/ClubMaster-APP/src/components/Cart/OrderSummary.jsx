import React from 'react';

function OrderSummary({ panier }) {
  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="sticky top-4 bg-card rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Prix unitaire</th>
              <th>Article</th>
              <th>Quantité</th>
              <th className="text-right">Sous-total</th>
            </tr>
          </thead>
          <tbody>
          {panier.map((item) => (
            <tr key={item.id}>
              <td>{item.price.toFixed(2)}€</td>
              <td>{item.label}</td>
              <td>{item.quantity}</td>
              <td className="text-right">
                {(item.price * item.quantity).toFixed(2)}€
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="font-medium">Total :</td>
            <td className="text-right font-bold">
              {total.toFixed(2)}€
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <button className="w-full mt-6 p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
        Passer la commande
      </button>
    </div>
  );
}

export default OrderSummary;