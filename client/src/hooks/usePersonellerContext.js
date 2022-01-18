import { useContext } from "react";
import { PersonellerContext } from "../context/PersonellerContext";

export const usePersonellerContext = () => {
  const context = useContext(PersonellerContext);
  if (!context) {
    throw new Error("PersonellerContext must be inside a provider");
  }
  return context;
};
