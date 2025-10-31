import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { reportWebVitals } from "@/lib/performance";

createRoot(document.getElementById("root")!).render(<App />);

// Report web vitals in development
if (import.meta.env.DEV) {
  reportWebVitals();
}
