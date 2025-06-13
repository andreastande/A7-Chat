import { createStore } from "zustand"

export type SearchState = {
  searchTerm: string
}

export type SearchActions = {
  setSearchTerm: (searchTerm: string) => void
}

export type SearchStore = SearchState & SearchActions

export const initSearchStore = (): SearchState => {
  return { searchTerm: "" }
}

const defaultInitState: SearchState = {
  searchTerm: "",
}

export const createSearchStore = (initState: SearchState = defaultInitState) => {
  return createStore<SearchStore>()((set) => ({
    ...initState,
    setSearchTerm: (searchTerm) => set({ searchTerm }),
  }))
}
