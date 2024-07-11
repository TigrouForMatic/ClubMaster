import create from 'zustand'

const useStore = create((set) => ({
  clubs: [],
  addresses: [],
  people: [],
  notifications: [
    { label: "Nouvelle mise à jour disponible", time: "2024-07-10 14:30:20" },
    { label: "Message reçu de Jean", time: "2024-07-10 15:45:02" },
    { label: "Rappel : Réunion à 16h" },
  ],

  // Notifications
  deleteNotif: (index) => set((state) => ({
    notifications: state.notifications.filter((_, i) => i !== index)
  })),

  addItem: (category, newItem) => set((state) => ({
    [category]: [...state[category], newItem]
  })),

  updateItem: (category, id, updatedItem) => set((state) => ({
    [category]: state[category].map(item => 
      item.id === id ? {...item, ...updatedItem} : item
    )
  })),

  deleteItem: (category, id) => set((state) => ({
    [category]: state[category].filter(item => item.id !== id)
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