/**
 * Application Entry Point
 *
 * Initializes React 18 with createRoot API and mounts the App component to the DOM.
 * The root element with id="root" must exist in index.html.
 *
 * Imports:
 * - App: Root application component with routing and providers
 * - index.css: Global styles (Tailwind CSS and custom CSS variables)
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Mount the React application to the DOM element with id="root".
 * The non-null assertion (!) is safe because Vite guarantees the element exists.
 */
createRoot(document.getElementById("root")!).render(<App />);

