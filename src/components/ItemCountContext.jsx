import { createContext } from "react";

export const ItemCountContext = createContext({
  lostCount: 0,
  returnedCount: 0,
  setLostCount: () => {},
  setReturnedCount: () => {},
  fetchCounts: async () => {},
});
