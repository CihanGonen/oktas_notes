import { useContext } from "react";
import { TaleplerContext } from "../context/TaleplerContext";

export const useTaleplerContext = () => {
  const context = useContext(TaleplerContext);
  if (!context) {
    throw new Error("TaleplerContext must be inside a provider");
  }
  return context;
};
