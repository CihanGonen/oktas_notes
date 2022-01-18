import { BaskanlarContext } from "../context/BaskanlarContext";
import { useContext } from "react";

export const useBaskanlarContext = () => {
  const context = useContext(BaskanlarContext);
  if (!context) {
    throw new Error("BaskanlarContext must be inside a provider");
  }
  return context;
};
