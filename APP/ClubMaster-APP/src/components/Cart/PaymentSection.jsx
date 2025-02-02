import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Wallet,
  Apple,
  Chrome,
  PlusCircle,
  Tag
} from 'lucide-react';

function PaymentSection() {
  const [promoCode, setPromoCode] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  useEffect(() => {
    // Simuler le chargement des cartes sauvegardées
    setSavedCards([
      { id: 1, last4: '1234', brand: 'Visa' },
      { id: 2, last4: '5678', brand: 'Mastercard' },
    ]);
  }, []);

  const handleNewCardSubmit = (e) => {
    e.preventDefault();
    // Logique pour ajouter une nouvelle carte
    console.log('Nouvelle carte:', newCard);
    setShowAddCard(false);
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyPromo = () => {
    console.log("Code promo appliqué:", promoCode);
  };

  const handlePayWithCard = (cardId) => {
    console.log("Paiement avec la carte:", cardId);
  };

  const handlePayWithPaypal = () => {
    // Implement PayPal redirection
    console.log("Redirection vers PayPal");
  };

  const handlePayWithApplePay = () => {
    // Implement Apple Pay
    console.log("Paiement avec Apple Pay");
  };

  const handlePayWithGooglePay = () => {
    // Implement Google Pay
    console.log("Paiement avec Google Pay");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <h2 className="text-2xl font-semibold">Mode de paiement</h2>
        <Wallet className="h-5 w-5" />
      </div>

      {/* Cartes sauvegardées */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cartes bancaires</h3>
        <div className="grid gap-3">
          {savedCards.map(card => (
            <div
              key={card.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{card.brand}</p>
                  <p className="text-sm text-muted-foreground">
                    se terminant par {card.last4}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100"
          onClick={() => setShowAddCard(!showAddCard)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une nouvelle carte
        </button>

        {showAddCard && (
          <div className="p-6 border rounded-lg">
            <form onSubmit={handleNewCardSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardNumber">Numéro de carte</label>
                <input
                  id="cardNumber"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  onChange={handleCardChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiry">Date d'expiration</label>
                  <input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/AA"
                    value={newCard.expiry}
                    onChange={handleCardChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={handleCardChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveCard"
                  name="saveCard"
                  checked={newCard.saveCard}
                  onCheckedChange={(checked) => 
                    setNewCard(prev => ({ ...prev, saveCard: checked }))
                  }
                />
                <label htmlFor="saveCard">
                  Sauvegarder pour mes prochains achats
                </label>
              </div>
              <button type="submit" className="w-full p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
                Ajouter la carte
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Autres moyens de paiement */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Autres moyens de paiement</h3>
        <div className="grid gap-3">
          {[
            { icon: Wallet, label: 'PayPal' },
            { icon: Apple, label: 'Apple Pay' },
            { icon: Chrome, label: 'Google Pay' }
          ].map((payment) => (
            <div
              key={payment.label}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <payment.icon className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Payer avec {payment.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code promo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          <h3 className="text-lg font-medium">Code promo</h3>
        </div>
        <div className="flex gap-2">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Saisissez votre code"
            className="flex-1"
          />
          <button className="p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSection;