import { BaskanliklarContext } from "../context/BaskanliklarContext";
import { useContext } from "react";

export const useBaskanliklarContext = () => {
  const context = useContext(BaskanliklarContext);
  if (!context) {
    throw new Error("BaskanliklarContext must be inside a provider");
  }
  return context;
};
