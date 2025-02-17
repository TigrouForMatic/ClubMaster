import React, { useState, useEffect, useMemo } from "react";
import useStore from '../store/store';
import api from '../js/App/Api';
import ProductCard from "../components/Shop/ProductCard";
import CartBar from "../components/Shop/CartBar";

const useShopData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userClubs = useStore((state) => state.userClubs);
  const setItems = useStore((state) => state.setItems);
  const productTypes = useStore((state) => state.productTypes);
  const products = useStore((state) => state.products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const arrayClubId = userClubs.map(club => club.id);

        const typeShopData = await api.get("/productType", { params: { arrayClubId: JSON.stringify(arrayClubId) } });
        setItems('productTypes', typeShopData);

        const arrayTypeProductId = typeShopData.map(type => type.id);
        const productData = await api.get("/product", { params: { arrayTypeProductId: JSON.stringify(arrayTypeProductId) } });
        setItems('products', productData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setItems, userClubs]);

  return { productTypes, products, isLoading, error };
};

function ShopView() {
  const { productTypes, products, isLoading, error } = useShopData();
  const [selectedType, setSelectedType] = useState("all");
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);
  const panier = useStore((state) => state.panier);

  const filteredTypes = useMemo(() => {
    const uniqueLabels = Array.from(new Set(productTypes.map(type => type.label)));
    return uniqueLabels.map(label => ({
      label,
      ids: productTypes.filter(type => type.label === label).map(type => type.id)
    }));
  }, [productTypes]);

  const filteredProducts = useMemo(() => {
    if (selectedType === "all") {
      return products;
    }
    const selectedTypeIds = filteredTypes.find(type => type.label === selectedType)?.ids || [];
    return products.filter(prod => selectedTypeIds.includes(prod.producttypeid));
  }, [products, selectedType, filteredTypes]);

  const handleAddToCart = (product) => {
    let productWithQuantity = product;
    let labelNotif;

    const prodInCart = panier.find(prod => prod.id === product.id);
    if (prodInCart) {
      labelNotif = "Ajout d'un produit dans le panier : " + product.label
      productWithQuantity.quantity = prodInCart.quantity + 1;
      updateItem('panier', product.id, productWithQuantity)
    } else {
      labelNotif = "Nouvel element dans le panier : " + product.label;
      productWithQuantity.quantity = 1;
      addItem('panier',productWithQuantity);
    }

    const createdClubNotif = {
      label: labelNotif,
      time: new Date()
    };

    addItem('notifications', createdClubNotif);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-gray-600">Chargement...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-red-600">Une erreur est survenue : {error.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            La Boutique
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl text-center">
            Découvrez notre sélection de produits
          </p>
        </div>

        {/* Panier */}
        {panier.length > 0 && <CartBar />}

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 py-4">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedType === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tous
          </button>
          {filteredTypes.map((type) => (
            <button
              key={type.label}
              onClick={() => setSelectedType(type.label)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedType === type.label
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod}
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopView;