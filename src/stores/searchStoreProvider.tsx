"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { useStore } from "zustand"
import { createSearchStore, initSearchStore, SearchStore } from "./searchStore"

export type SearchStoreAPI = ReturnType<typeof createSearchStore>

const SearchStoreContext = createContext<SearchStoreAPI | null>(null)

export function SearchStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<SearchStoreAPI | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createSearchStore(initSearchStore())
  }

  return <SearchStoreContext.Provider value={storeRef.current}>{children}</SearchStoreContext.Provider>
}

export const useSearchStore = <T,>(selector: (store: SearchStore) => T): T => {
  const searchStoreContext = useContext(SearchStoreContext)

  if (!searchStoreContext) {
    throw new Error(`useSearchStore must be used within SearchStoreProvider`)
  }

  return useStore(searchStoreContext, selector)
}
