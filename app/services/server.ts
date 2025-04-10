//handles context serving for view loaders
//IN PROGRESS
// https://remix.run/docs/en/main/route/loader#context
import { createContext, useContext, useState, ReactNode } from "react";

// Define the context state shape. Adjust as needed.
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// Create the context with an initial undefined value.
const MyContext: React.Context<MyContextType | undefined> = createContext<MyContextType | undefined>(undefined);

// Provider component that will wrap your app or parts of it.
export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("default value");
}

// A custom hook for easier consumption of the context.
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
}