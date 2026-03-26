import type{ PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const LOCAL_KEY = "kart_searches";
const MAX_RECENT = 6;

const loadSearches = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSearches = (searches: string[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(searches));
  } catch {}
};

interface SearchState {
  query: string;
  recentSearches: string[];
}

const initialState: SearchState = {
  query: "",
  recentSearches: loadSearches(),
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      const term = action.payload.trim();
      if (!term) return;
      state.recentSearches = [
        term,
        ...state.recentSearches.filter((s) => s !== term),
      ].slice(0, MAX_RECENT);
      saveSearches(state.recentSearches);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
      saveSearches([]);
    },
  },
});

export const { setQuery, addRecentSearch, clearRecentSearches } =
  searchSlice.actions;
export default searchSlice.reducer;