import { useState, useEffect } from "react";
import axios from "axios";

function ShopView() {
    const [typeShop, setTypeShop] = useState([]);
    const [produit, setProduit] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typeShopResponse, produitResponse] = await Promise.all([
                    axios.get("http://localhost:3200/produitType?clubid=1"),
                    axios.get("http://localhost:3200/produit"),
                ]);
                setTypeShop(typeShopResponse.data);

                const produitsDuClub = produitResponse.data.filter(prod =>
                    typeShopResponse.data.some(type => prod.produittypeid === type.id)
                );

                setProduit(produitsDuClub);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>ShopView</h1>

            <h2>Types de produits :</h2>
            <ul>
                {typeShop.map((type) => (
                    <li key={type.id}>
                        <p>Nom : {type.label}</p>
                    </li>
                ))}
            </ul>

            <h2>Produits :</h2>
            <ul>
                {produit.map((prod) => (
                    <li key={prod.id}>
                        <p>Nom : {prod.label}</p>
                        <p>Description : {prod.description}</p>
                        <p>Prix : {prod.price}</p>
                        <p>Stock : {prod.stock}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShopView;
