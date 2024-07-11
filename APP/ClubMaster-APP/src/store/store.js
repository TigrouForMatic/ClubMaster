import create from 'zustand'

const useStore = create((set) => ({
  clubs: [],
  addresses: [],
  people: [],
  notifications: [
    { id : 1, label: "Nouvelle mise à jour disponible", time: "2024-07-10 14:30:20" },
    { id : 2, label: "Message reçu de Jean", time: "2024-07-10 15:45:02" },
    { id : 3, label: "Rappel : Réunion à 16h" },
  ],

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


// const { addItem, updateItem, deleteItem } = useStore()

// addItem('clubs', { id: 1, name: 'Club A' })
// updateItem('addresses', 2, { street: 'New Street' })
// deleteItem('people', 3)