import { useState } from "react";
import { ItemCountContext } from "./ItemCountContext";

export const RETURNED_SEEN_KEY = "returned_last_seen_count";

export function ItemCountProvider({ children }) {
  const [lostCount, setLostCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);

  return (
    <ItemCountContext.Provider
      value={{ lostCount, setLostCount, returnedCount, setReturnedCount }}>
      {children}
    </ItemCountContext.Provider>
  );
}
