import { create } from 'zustand'

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
  currentUserRoles: [],
  roles: [],
  login: [],
  typesEvent: [],
  events: [],
  matchTeams: [],
  matchScores: [],
  teams: [],
  teamMembers: [],
  inscriptions: [],
  productTypes: [],
  products: [],
  panier: [],
  conversations: [],
  infoBanners: [],
  photos: [],
  requestToJoin: [],
  membershipForms: [],
  requestToJoinAdmin: [],
  licencesAdmin: [],
  showApp: false,
  lastFetchTime: null,
  // ShowApp
  setShowApp: () => set((state) => {
    const newShowAppState = !state.showApp;

    if (!newShowAppState) {
      state.initialize();
    }

    return { showApp: newShowAppState };
  }),

  setLastFetchTime: (time) => set({ lastFetchTime: time }),

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

  // Récupérer un élément
  getItem: (category, id) => (state) => state[category].find(item => item.id === id),

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

  // Cette fonction permet d'ajouter un ou plusieurs éléments à une catégorie spécifique du state
  // Si items est un tableau, elle ajoute tous les éléments du tableau
  // Si items est un objet unique, elle l'ajoute comme un seul élément
  // La catégorie est créée si elle n'existe pas encore (|| [])
  addItems: (category, items) => set((state) => ({
  [category]: Array.isArray(items) 
    ? [...state[category] || [], ...items]
    : [...state[category] || [], items]
  })),

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


  setLogin: (login) => set(() => ({
    login: login
  })),

  setCurrentUser: (currentUser) => set(() => ({
    currentUser: currentUser
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