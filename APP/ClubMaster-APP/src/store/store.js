import create from 'zustand'

const useStore = create((set) => ({
  userClubs: [],
  clubs: [],
  addresses: [],
  currentUserAddresses: [],
  personPhysics: [],
  licences: [],
  licenceTypes: [],
  notifications: [],
  currentUser: [],
  roles: [],
  login: [],
  typesEvent: [],
  events: [],
  inscriptions: [],
  productTypes: [],
  products: [],
  panier: [],
  conversations: [],
  showApp: false,

  // ShowApp
  setShowApp: () => set((state) => ({
    showApp: !state.showApp
  })),


  // Notifications
  deleteNotif: (index) => set((state) => ({
    notifications: state.notifications.filter((_, i) => i !== index)
  })),

  // Messages
  addMesToConv: (id, newMess) => set((state) => {
    const conversationIndex = state.conversations.findIndex(item => item.id === id);
    if (conversationIndex === -1) return state;

    console.log(...state.conversations[conversationIndex].messages)
  
    const updatedConversation = {
      ...state.conversations[conversationIndex],
      messages: [...state.conversations[conversationIndex].messages, newMess]
    };
  
    return {
      conversations: [
        ...state.conversations.slice(0, conversationIndex),
        updatedConversation,
        ...state.conversations.slice(conversationIndex + 1)
      ]
    };
  }),

  // addMesToConv: (id, newMess) => set((state) => {
  //   const conversationIndex = state.conversations.findIndex(item => item.conversationid === id);
  //   if (conversationIndex === -1) return state;

  //   // Assurez-vous que messages est un tableau
  //   const currentMessages = state.conversations[conversationIndex].messages || [];

  //   if (!Array.isArray(currentMessages)) {
  //     console.error("Messages is not an array");
  //     return state;
  //   }

  //   // Créez la conversation mise à jour
  //   const updatedConversation = {
  //     ...state.conversations[conversationIndex],
  //     messages: [...currentMessages, newMess]
  //   };

  //   // Retournez le nouvel état
  //   return {
  //     conversations: [
  //       ...state.conversations.slice(0, conversationIndex),
  //       updatedConversation,
  //       ...state.conversations.slice(conversationIndex + 1)
  //     ]
  //   };
  // }),

  // Ajouter un élément
  addItem: (category, newItem) => set((state) => ({
    [category]: [...state[category], newItem]
  })),

  // Mettre à jour un élément
  updateItem: (category, id, updatedItem) => set((state) => ({
    [category]: state[category].map(item => item.id === id ? {...item, ...updatedItem} : item)
  })),

  // Supprimer un élément
  deleteItem: (category, id) => set((state) => ({
    [category]: state[category].filter(item => item.id !== id)
  })),

  // Nouvelles fonctions pour manipuler tout un tableau
  setItems: (category, items) => set(() => ({
    [category]: items
  })),

  updateItems: (category, updatedItems) => set((state) => ({
    [category]: state[category].map(item => {
      const updatedItem = updatedItems.find(u => u.id === item.id);
      return updatedItem ? {...item, ...updatedItem} : item;
    })
  })),

  deleteItems: (category, ids) => set((state) => ({
    [category]: state[category].filter(item => !ids.includes(item.id))
  })),
}))

export default useStore