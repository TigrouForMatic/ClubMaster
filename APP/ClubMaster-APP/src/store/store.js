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

// Exemple of controlled store
//  // Clubs
//  addClub: (newClub) => set((state) => ({ clubs: [...state.clubs, newClub] })),
//  updateClub: (id, updatedClub) => set((state) => ({
//    clubs: state.clubs.map(club => club.id === id ? {...club, ...updatedClub} : club)
//  })),
//  deleteClub: (id) => set((state) => ({
//    clubs: state.clubs.filter(club => club.id !== id)
//  })),