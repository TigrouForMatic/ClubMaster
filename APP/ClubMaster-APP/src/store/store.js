import create from 'zustand'

const useStore = create((set) => ({
  clubs: [],
  addresses: [],
  people: [],

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