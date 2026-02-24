import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

async function enableMocking() {
  // Only enable mocking in development mode
  const enableMocking = async () => {
    const { worker } = await import("./mocks/browser");
    return worker.start();
  };

  enableMocking(); // Start the mocking service worker
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
