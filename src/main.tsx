import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppWithLoading from "./components/AppWithLoading";
import { LoadingProvider } from "./contexts/LoadingContext";
import "./styles.css";

// Register service worker for image caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AppWithLoading>
          <App />
        </AppWithLoading>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
