import create from 'zustand'

const useStore = create((set) => ({
  clubs: [],
  addresses: [],
  people: [],

  // Clubs
  addClub: (newClub) => set((state) => ({ clubs: [...state.clubs, newClub] })),
  updateClub: (id, updatedClub) => set((state) => ({
    clubs: state.clubs.map(club => club.id === id ? {...club, ...updatedClub} : club)
  })),
  deleteClub: (id) => set((state) => ({
    clubs: state.clubs.filter(club => club.id !== id)
  })),

  // Addresses
  addAddress: (newAddress) => set((state) => ({ addresses: [...state.addresses, newAddress] })),
  updateAddress: (id, updatedAddress) => set((state) => ({
    addresses: state.addresses.map(address => address.id === id ? {...address, ...updatedAddress} : address)
  })),
  deleteAddress: (id) => set((state) => ({
    addresses: state.addresses.filter(address => address.id !== id)
  })),

  // People
  addPerson: (newPerson) => set((state) => ({ people: [...state.people, newPerson] })),
  updatePerson: (id, updatedPerson) => set((state) => ({
    people: state.people.map(person => person.id === id ? {...person, ...updatedPerson} : person)
  })),
  deletePerson: (id) => set((state) => ({
    people: state.people.filter(person => person.id !== id)
  })),
}))

export default useStore