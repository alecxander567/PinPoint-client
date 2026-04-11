import { useContext } from "react";
import { ItemCountContext } from "../components/ItemCountContext";

export function useItemCount() {
  return useContext(ItemCountContext);
}
