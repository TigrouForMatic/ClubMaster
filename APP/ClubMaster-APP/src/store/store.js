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
  setShowApp: () => set((state) => {
    const newShowAppState = !state.showApp;

    if (!newShowAppState) {
      state.initialize();
    }

    return { showApp: newShowAppState };
  }),



  // Notifications
  deleteNotif: (index) => set((state) => ({
    notifications: state.notifications.filter((_, i) => i !== index)
  })),

   // Ajout d'un message dans une conversation spécifique dans le tableau de conversations
   addMessageToConversation: (conversationId, newMessage) => set((state) => ({
    conversations: state.conversations.map(conversationArray => 
      conversationArray.map(conversation => 
        conversation.conversationid === conversationId
          ? {...conversation, messages: [...conversation.messages, newMessage]}
          : conversation
      )
    )
  })),

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

  initialize: () => set((state) => {
    const emptyState = Object.keys(state).reduce((acc, key) => {
      if (Array.isArray(state[key])) {
        acc[key] = [];
      }
      return acc;
    }, {});
    return emptyState;
  }),
}));

export default useStore;